require("dotenv").config();

const Purchase = require("../models/purchase.model");
const Inventory = require("../models/inventory.model");
const Supplier = require("../models/supplier.model");
const PurchaseReturn = require("../models/purchaseReturn.model");

const { sendMail, generatePurchaseInvoice } = require("../helpers");
const followUpPaymentMailTemplate = require("../templates/email/followUpPaymentMailTemplate");
const mongoose = require("mongoose");

const getPurchases = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    supplierId,
    sort = "createdAt",
    sortType = "desc",
  } = req.query;

  const query = {};
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
  const purchases = await Purchase.find({ signedBy: employeeId })

    .limit(limit)
    .skip((page - 1) * limit);

  const totalPurchases = await Purchase.countDocuments({
    signedBy: employeeId,
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
  const purchaseData = await Purchase.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },

    // Populate products.product with details
    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },

    // Map product details back into the products array
    {
      $addFields: {
        products: {
          $map: {
            input: "$products",
            as: "productItem",
            in: {
              _id: "$$productItem._id",
              product: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$productDetails",
                      as: "details",
                      cond: { $eq: ["$$details._id", "$$productItem.product"] },
                    },
                  },
                  0,
                ],
              },
              purchaseRate: "$$productItem.purchaseRate",
              quantity: "$$productItem.quantity",
            },
          },
        },
      },
    },

    // Populate supplier details and unwind (ensure single object instead of array)
    {
      $lookup: {
        from: "suppliers",
        localField: "supplier",
        foreignField: "_id",
        as: "supplier",
      },
    },
    { $unwind: { path: "$supplier", preserveNullAndEmptyArrays: true } },

    // Populate signedBy details and unwind
    {
      $lookup: {
        from: "users",
        localField: "signedBy",
        foreignField: "_id",
        as: "signedBy",
      },
    },
    { $unwind: { path: "$signedBy", preserveNullAndEmptyArrays: true } },

    // Project the desired fields
    {
      $project: {
        _id: 1,
        createdAt: 1,
        invoice: 1,
        products: 1,
        supplier: {
          _id: "$supplier._id",
          name: "$supplier.name",
          phone: "$supplier.phone",
          email: "$supplier.email",
          gstin: "$supplier.gstin",
          pan: "$supplier.pan",
          notes: "$supplier.notes",
          balance: "$supplier.balance",
        },
        signedBy: {
          _id: "$signedBy._id",
          name: "$signedBy.name",
          email: "$signedBy.email",
          phone: "$signedBy.phone",
        },
        subTotal: 1,
        otherCharges: 1,
        discount: 1,
        totalAmount: 1,
        paidAmount: 1,
        deficitAmount: 1,
        followUpPayments: 1,
      },
    },
  ]);

  if (!purchaseData.length) {
    return res.status(404).json({ error: "Purchase not found." });
  }
  res.json({ success: true, purchase: purchaseData[0] });
};

const getPurchaseReturns = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    sort = "createdAt",
    sortType = "desc",
  } = req.query;
  const purchaseReturns = await PurchaseReturn.find({})
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ [sort]: sortType });

  const totalPurchaseReturns = await PurchaseReturn.countDocuments({});
  res.json({
    success: true,
    purchaseReturns,
    totalPages: Math.ceil(totalPurchaseReturns / limit),
    page,
    totalPurchaseReturns,
  });
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
    })),
    signedBy: req.user.id,
    supplier: supplierId,
    subTotal,
    otherCharges,
    discount,
    totalAmount,
    paidAmount,
    deficitAmount: totalAmount - paidAmount,
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
      });
    } else {
      const existingBatch = inventory.batches.find(
        (batch) =>
          batch.sellingRate === product.sellingRate &&
          (!product.expiry ||
            !batch.expiry ||
            new Date(batch.expiry).getTime() ==
              new Date(product.expiry).getTime())
      );

      if (existingBatch) {
        // If a batch with the same selling rate exists, update its quantity
        existingBatch.quantity += product.quantity;
      } else {
        inventory.batches.push({
          quantity: product.quantity,
          purchaseRate: product.purchaseRate,
          sellingRate: product.sellingRate,
          expiry: product.expiry,
          mrp: product.mrp,
        });
      }
      inventory.totalQuantity = inventory.totalQuantity + product.quantity;
      await inventory.save();
    }
  });

  purchase.invoice = await generatePurchaseInvoice(purchase._id);

  await purchase.save();
  res.json({ success: true, purchase });
};

const getRecentPurchase = async (req, res) => {
  // Find the most recent purchase by sorting by date descending
  const recentPurchase = await Purchase.findOne({})
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
  addPurchase,
  addPayment,
};
