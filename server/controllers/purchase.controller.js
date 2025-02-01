require("dotenv").config();

const Purchase = require("../models/purchase.model");
const Inventory = require("../models/inventory.model");
const Supplier = require("../models/supplier.model");
const PurchaseReturn = require("../models/purchaseReturn.model");
const Product = require("../models/product.model");

const followUpPaymentMailTemplate = require("../templates/email/followUpPaymentMailTemplate");
const generatePurchaseInvoice = require("../templates/invoice/purchaseInvoice");
const generatePurchaseReturnInvoice = require("../templates/invoice/purchaseReturnInvoice");
const { sendMail, mergeBatchesHelper } = require("../helpers");

const getPurchases = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    supplierId,
    sort = "createdAt",
    sortType = "desc",
  } = req.query;

  const query = { company : req.user.company };
  if (supplierId) {
    query.supplier = supplierId;
  }

  const purchases = await Purchase.find(query)
    .populate("products.product")
    .populate("supplier")
    .populate("signedBy")
    .sort({ [sort]: sortType })
    .limit(limit)
    .skip((page - 1) * limit);

  const totalPurchases = await Purchase.countDocuments(query);
  res.json({
    success: true,
    purchases,
    totalPages: Math.ceil(totalPurchases / limit),
    page,
    totalPurchases,
  });
};

const getEmployeePurchases = async (req, res) => {
  const { limit = 10, page = 1, employeeId = { $exists: true } } = req.query;
  const purchases = await Purchase.find({ signedBy: employeeId, company: req.user.company })

    .limit(limit)
    .skip((page - 1) * limit);

  const totalPurchases = await Purchase.countDocuments({
    signedBy: employeeId,
    company: req.user.company,
  });

  res.json({
    success: true,
    purchases,
    totalPages: Math.ceil(totalPurchases / limit) || 1,
    page,
    totalPurchases,
  });
};

const getPurchase = async (req, res) => {
  const { return: isReturn } = req.query;
  const purchase = await Purchase.findById(req.params.id)
    .populate("products.product")
    .populate("supplier")
    .populate("signedBy");

  if (!purchase) {
    return res
      .status(404)
      .json({ success: false, message: "Purchase not found." });
  }

  const alreadyReturned = await PurchaseReturn.findOne({
    purchase: purchase._id,
  });
  if (alreadyReturned) {
    return res.status(400).json({
      success: false,
      message: "Purchase already returned for this bill.",
    });
  }

  if (!isReturn) {
    const formattedPurchase = {
      products: purchase.products,
      supplier: purchase.supplier,
      signedBy: purchase.signedBy,
      subTotal: purchase.subTotal,
      otherCharges: purchase.otherCharges,
      deficitAmount: purchase.deficitAmount,
      followUpPayments: purchase.followUpPayments,
      discount: purchase.discount,
      totalAmount: purchase.totalAmount,
      paidAmount: purchase.paidAmount,
      invoice: purchase.invoice,
    };
    const purchaseReturn = await PurchaseReturn.findOne({
      purchaseId: purchase._id,
    }).populate("products.product", "name secondaryUnit image");
    if (purchaseReturn) {
      formattedPurchase.return = purchaseReturn;
    }
    return res.status(200).json({ success: true, purchase: formattedPurchase });
  }
  const purchaseObj = purchase.toObject();
  for (const product of purchaseObj.products) {
    const inventory = await Inventory.findOne({
      product: product.product,
      totalQuantity: { $gte: product.quantity },
      company: req.user.company,
    });
    if (!inventory || !inventory.batches.length) {
      product.maxQuantity = 0;
      continue;
    }
    const sameBatch = inventory.batches.find(
      (batch) =>
        batch.purchaseRate === product.purchaseRate &&
        (!product.expiry ||
          new Date(batch.expiry).getTime() ==
            new Date(product.expiry).getTime()) &&
        (!product.mrp || batch.mrp == product.mrp)
    );
    if (sameBatch) {
      product.maxQuantity = Math.min(sameBatch.quantity, product.quantity);
    } else {
      product.maxQuantity = 0;
    }
  }
  res.json({
    success: true,
    purchase: {
      ...purchaseObj,
      products: purchaseObj.products.map((product) => ({
        _id: product.product._id,
        expiry: product.expiry,
        name: product.product.name,
        purchaseRate: product.purchaseRate,
        mrp: product.mrp,
        primaryUnit: product.product.primaryUnit,
        secondaryUnit: product.product.secondaryUnit,
        conversion: product.product.conversion,
        quantity: product.quantity,
        maxQuantity: product.maxQuantity,
        price: product.purchaseRate * product.quantity,
      })),
    },
  });
};

const getPurchaseReturns = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    sort = "createdAt",
    sortType = "desc",
  } = req.query;
  const purchaseReturns = await PurchaseReturn.find({company: req.user.company})
    .populate("products.product supplier signedBy")
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ [sort]: sortType });

  const totalPurchaseReturns = await PurchaseReturn.countDocuments({company: req.user.company});
  res.status(200).json({
    success: true,
    purchaseReturns,
    totalPages: Math.ceil(totalPurchaseReturns / limit),
    page,
    totalPurchaseReturns,
  });
};

const addPurchaseReturn = async (req, res) => {
  const { products, invoiceId } = req.body;

  const alreadyReturned = await PurchaseReturn.findOne({
    purchaseId: invoiceId,
    company: req.user.company,
  });
  if (alreadyReturned) {
    return res.status(400).json({
      success: false,
      message: "Return already exists on this bill.",
    });
  }

  const purchaseReturn = await PurchaseReturn.create({
    products: products.map((product) => ({
      product: product._id,
      quantity: product.quantity,
      purchaseRate: product.purchaseRate,
      expiry: product?.expiry,
      mrp: product?.mrp,
    })),
    subTotal: req.body.subTotal,
    otherCharges: req.body.otherCharges,
    discount: req.body.discount,
    totalAmount: req.body.totalAmount,
    reason: req.body.reason,
    supplier: req.body.supplierId,
    signedBy: req.user.id,
    purchaseId: invoiceId,
    company: req.user.company,
  });

  // Update Inventory
  for (const product of products) {
    const inventory = await Inventory.findOne({
      product: product._id,
    });
    if (!inventory) {
      return res.status(404).json({ error: "Product not found in inventory." });
    }
    const sameBatch = inventory.batches.find(
      (batch) =>
        batch.purchaseRate === product.purchaseRate &&
        batch.mrp === product.mrp &&
        ((!product.expiry && !batch.expiry) ||
          new Date(batch.expiry).getTime() ==
            new Date(product.expiry).getTime())
    );
    if (sameBatch) {
      sameBatch.quantity -= product.quantity;
      inventory.totalQuantity -= product.quantity;
      if (sameBatch.quantity === 0) {
        inventory.batches = inventory.batches.filter(
          (batch) => batch._id.toString() !== sameBatch._id.toString()
        );
      }
    }
    await inventory.save();
  }

  purchaseReturn.invoice = await generatePurchaseReturnInvoice(
    purchaseReturn._id
  );
  await purchaseReturn.save();
  res.json({ success: true, purchaseReturn });
};

const addPurchase = async (req, res) => {
  const {
    supplierId,
    subTotal,
    otherCharges = 0,
    discount = 0,
    totalAmount,
    paidAmount = 0,
  } = req.body;

  const purchase = await Purchase.create({
    products: req.body.products.map((product) => ({
      product: product._id,
      purchaseRate: product.purchaseRate,
      quantity: product.quantity || 1,
      expiry: product?.expiry,
      mrp: product?.mrp,
    })),
    signedBy: req.user.id,
    supplier: supplierId,
    subTotal,
    otherCharges,
    discount,
    totalAmount,
    paidAmount,
    deficitAmount: totalAmount - paidAmount,
    company: req.user.company,
  });

  // Track the deficit amount and update the supplier's balance
  if (purchase.deficitAmount > 0) {
    const supplier = await Supplier.findById(supplierId);
    supplier.balance += purchase.deficitAmount;
    await supplier.save();
  }

  // Update Inventory
  req.body.products.forEach(async (product) => {
    const inventory = await Inventory.findOne({
      product: product._id,
    });

    if (!inventory) {
      await Inventory.create({
        product: product._id,
        batches: [
          {
            quantity: product.quantity,
            purchaseRate: product.purchaseRate,
            sellingRate: product.sellingRate,
            expiry: product.expiry,
            mrp: product.mrp,
          },
        ],
        totalQuantity: product.quantity,
        company: req.user.company,
      });
    } else {
        inventory.batches.push({
          quantity: product.quantity,
          purchaseRate: product.purchaseRate,
          sellingRate: product.sellingRate,
          expiry: product.expiry,
          mrp: product.mrp,
        });
        inventory.totalQuantity = inventory.totalQuantity + product.quantity;
        inventory.batches = await mergeBatchesHelper(inventory.batches);
        await inventory.save();
      }

    // Set MRP of product if not already set
    if (product.mrp) {
      const productDoc = await Product.findById(product._id);
      if (!productDoc.mrp) {
        productDoc.mrp = product.mrp;
        await productDoc.save();
      }
    }
  });

  purchase.invoice = await generatePurchaseInvoice(purchase._id);

  await purchase.save();
  res.json({ success: true, purchase });
};

const getRecentPurchase = async (req, res) => {
  // Find the most recent purchase by sorting by date descending
  const recentPurchase = await Purchase.findOne({company: req.user.company})
    .sort({ createdAt: -1 })
    .populate("products.product")
    .populate("supplier")
    .populate("signedBy");

  if (!recentPurchase) {
    return res.status(404).json({ error: "No recent purchases found." });
  }

  // Format the recent purchase data to include all the relevant details
  const recentPurchaseDetails = {
    _id: recentPurchase._id,
    date: recentPurchase.createdAt,
    totalAmount: recentPurchase.totalAmount,
    products: recentPurchase.products.map((item) => ({
      productName: item.product.name,
      quantity: item.quantity,
      primaryUnit: item.product.primaryUnit,
      secondaryUnit: item.product.secondaryUnit,
      rate: item.purchaseRate,
      totalPrice: item.quantity * item.purchaseRate,
    })),
    supplier: recentPurchase.supplier
      ? {
          name: recentPurchase.supplier.name,
          contact: recentPurchase.supplier.contact,
          email: recentPurchase.supplier.email,
        }
      : null,
    signedBy: recentPurchase.signedBy
      ? {
          name: recentPurchase.signedBy.name,
          email: recentPurchase.signedBy.email,
          phone: recentPurchase.signedBy.phone,
        }
      : null,
    customer: recentPurchase.customer
      ? {
          name: recentPurchase.customer.name,
          email: recentPurchase.customer.email,
          phone: recentPurchase.customer.phone,
        }
      : null,
  };

  res.json({ recentPurchase: recentPurchaseDetails });
};

const addPayment = async (req, res) => {
  const { paidAmount, notes } = req.body;
  const purchase = await Purchase.findById(req.params.id);

  if (!purchase) {
    return res.status(404).json({ error: "Purchase not found." });
  }

  purchase.followUpPayments.push({
    paidAmount,
    createdAt: new Date(),
    notes,
  });

  purchase.deficitAmount -= paidAmount;

  // Update the supplier's balance
  const supplier = await Supplier.findById(purchase.supplier);
  supplier.balance -= paidAmount;

  await Promise.all([purchase.save(), supplier.save()]);

  // Send an email notification to the supplier
  if (supplier.email) {
    const message = followUpPaymentMailTemplate(
      supplier.name,
      paidAmount,
      purchase._id
    );
    await sendMail(supplier.email, "Payment Received", message);
  }

  res.json({ success: true });
};

module.exports = {
  getPurchases,
  getEmployeePurchases,
  getRecentPurchase,
  getPurchase,
  getPurchaseReturns,
  addPurchaseReturn,
  addPurchase,
  addPayment,
};
