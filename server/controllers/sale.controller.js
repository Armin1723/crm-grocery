const { generateSaleInvoice, sendMail } = require("../helpers");
const Inventory = require("../models/inventory.model");
const Sale = require("../models/sale.model");
const Customer = require("../models/customer.model");
const SalesReturn = require("../models/salesReturn.model");
const lowStockMailTemplate = require("../templates/email/lowStockMailTemplate");
const generateSalesReturnInvoice = require("../templates/invoice/saleReturnInvoice");

const getSales = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    sort = "createdAt",
    sortType = "desc",
  } = req.query;
  const sales = await Sale.find()
    .populate("signedBy")
    .populate("customer")
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ [sort]: sortType });

  const totalSales = await Sale.countDocuments();

  res.json({
    success: true,
    sales,
    totalPages: Math.ceil(totalSales / limit) || 1,
    page,
    totalSales,
  });
};

const getEmployeeSales = async (req, res) => {
  const { limit = 10, page = 1, employeeId = { $exists: true } } = req.query;
  const sales = await Sale.find({ signedBy: employeeId })
    .limit(limit)
    .skip((page - 1) * limit);

  const totalSales = await Sale.countDocuments({ signedBy: employeeId });
  res.json({
    success: true,
    sales,
    totalPages: Math.ceil(totalSales / limit) || 1,
    page,
    totalSales,
  });
};

const getSale = async (req, res) => {
  const sale = await Sale.findById(req.params.id).populate(
    "products.product customer signedBy"
  );

  const saleReturn = await SalesReturn.findOne({ saleId: sale._id })
    .populate("customer products.product")
    .lean();

  const formattedSale = {
    _id: sale._id,
    subTotal: sale.subTotal,
    otherCharges: sale.otherCharges,
    discount: sale.discount,
    totalAmount: sale.totalAmount,
    createdAt: sale.createdAt,
    paymentMode: sale.paymentMode,
    invoice: sale.invoice,
    products: sale.products.map((item) => ({
      product: item?.product?._id,
      image: item?.product?.image,
      name: item?.product?.name,
      quantity: item?.quantity,
      primaryUnit: item?.product?.primaryUnit,
      secondaryUnit: item?.product?.secondaryUnit,
      expiry: item?.expiry,
      mrp: item?.mrp,
      sellingRate: item?.sellingRate,
      discount: item?.discount,
      price: item?.sellingRate * item?.quantity,
    })),
    customer: sale.customer
      ? {
          name: sale?.customer?.name,
          phone: sale?.customer?.phone,
          email: sale?.customer?.email,
        }
      : null,
    signedBy: sale?.signedBy,
  };

  if (saleReturn) {
    formattedSale.saleReturn = saleReturn;
  }
  res.json({ success: true, sale: formattedSale });
};

const getSaleReturns = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    sort = "createdAt",
    sortType = "desc",
  } = req.query;
  const salesReturns = await SalesReturn.find()
    .populate("signedBy")
    .populate("customer")
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ [sort]: sortType });

  const totalSalesReturns = await SalesReturn.countDocuments();
  res.json({
    success: true,
    salesReturns,
    totalPages: Math.ceil(totalSalesReturns / limit) || 1,
    page,
    totalSalesReturns,
  });
};

const addSale = async (req, res) => {
  const {
    products = [
      {
        product: "",
        quantity: 0,
        sellingRate: 0,
        expiry: "",
      },
    ],
    customerMobile,
    otherCharges = 0,
    discount = 0,
    subTotal = 0,
    totalAmount = 0,
    paymentMode = "cash",
  } = req.body;

  if (!products.length) {
    return res.status(400).json({ message: "Products are required." });
  }

  const sale = await Sale.create({
    products,
    signedBy: req.user.id,
    subTotal,
    otherCharges,
    discount,
    totalAmount,
    paymentMode,
  });

  if (customerMobile) {
    const customer = await Customer.findOne({ phone: customerMobile });
    if (!customer) {
      const newCustomer = new Customer({ phone: customerMobile });
      await newCustomer.save();
      sale.customer = newCustomer._id;
    } else {
      sale.customer = customer._id;
    }
  }
  products.map(async (product) => {
    const inventory = await Inventory.findOne({
      product: product.product,
    }).populate("product");
    if (!inventory) {
      console.log("Inventory not found");
      return;
    }
    if (!inventory.batches) {
      console.log("No Batches found");
      return;
    }

    inventory?.batches.forEach((batch) => {
      const sameBatch =
        (!batch.expiry ||
          !product.expiry ||
          new Date(batch?.expiry).getTime() ===
            new Date(product?.expiry).getTime()) &&
        batch.sellingRate === product.sellingRate &&
        (!!product.mrp || batch?.mrp === product?.mrp);
      if (sameBatch) {
        console.log("Same Batch");
      }
    });
  });

  await sale.save();

  // Update Inventory
  products.forEach(async (product) => {
    const inventory = await Inventory.findOne({
      product: product.product,
    }).populate("product");
    inventory?.batches.forEach((batch) => {
      const sameBatch =
        (!batch.expiry ||
          !product.expiry ||
          new Date(batch?.expiry).getTime() ===
            new Date(product?.expiry).getTime()) &&
        batch.sellingRate === product.sellingRate &&
        (!!product.mrp || batch?.mrp === product?.mrp);
      if (sameBatch) {
        batch.quantity -= product.quantity;
        if (batch.quantity === 0) {
          inventory.batches.pull(batch._id);
        }
        return;
      }
    });
    inventory.totalQuantity -= product.quantity;
    await inventory.save();

    // Send Mail to Admin if stockPreference set
    if (inventory?.product?.stockAlert?.preference) {
      if (inventory.totalQuantity < detailedProduct.stockAlert.quantity) {
        sendMail(
          (to = process.env.ADMIN_EMAIL),
          (subject = "Low Stock Alert"),
          (message = lowStockMailTemplate(
            inventory.product.name,
            inventory.totalQuantity
          ))
        );
      }
    }
  });

  sale.invoice = await generateSaleInvoice(sale._id);

  await sale.save();
  res.json({ success: true, sale });
};

const addSaleReturn = async (req, res) => {
  // console.log(req.body);
  const { invoiceId, products = [] } = req.body;
  const sale = await Sale.findById(invoiceId).populate("customer").lean();
  if (!sale) {
    return res.status(404).json({ error: "Sale not found." });
  }
  // Check if valid products are returned (less than sold quantity)
  for (const product of products) {
    if (
      sale.products.find(
        (item) => item.product.toString() === product.product.toString()
      ).quantity < product.quantity
    ) {
      return res.status(400).json({ error: "Invalid quantity returned." });
    }
  }

  // Check already Existing Sales Return
  const existingReturn = await SalesReturn.findOne({ saleId: invoiceId })
    .select(" saleId ")
    .lean();
  if (existingReturn) {
    return res.status(400).json({ error: "Sales Return already exists." });
  }

  // Create a new sale return document
  const saleReturn = await SalesReturn.create({
    reason: req.body.reason,
    saleId: invoiceId,
    customer: sale?.customer,
    products: req.body.products,
    signedBy: req.user.id,
    subTotal: req.body.subTotal,
    otherCharges: req.body.otherCharges,
    discount: req.body.discount,
    totalAmount: req.body.totalAmount,
  });

  // Update Inventory
  products.forEach(async (product) => {
    const inventory = await Inventory.findOne({
      product: product.product,
    }).populate("product");
    if (!inventory) {
      await Inventory.create({
        product: product.product,
        totalQuantity: product.quantity,
        batches: [
          {
            quantity: product.quantity,
            mrp: product.mrp,
            sellingRate: product.sellingRate,
            expiry: product.expiry,
          },
        ],
      });
    }
    inventory?.batches.forEach((batch) => {
      const sameBatch =
        (!batch.expiry || !product.expiry || batch.expiry === product.expiry) &&
        batch.sellingRate === product.sellingRate &&
        batch.mrp === product.mrp;
      if (sameBatch) {
        batch.quantity += product.quantity;
        return;
      }
    });
    inventory.batches.push({
      quantity: product.quantity,
      mrp: product.mrp,
      sellingRate: product.sellingRate,
      expiry: product.expiry,
    });
    inventory.totalQuantity += product.quantity;
    await inventory.save();
  });

  // Generate a sales return invoice
  const invoice = await generateSalesReturnInvoice({
    _id: saleReturn._id,
    returnDate: saleReturn.createdAt,
    customer: saleReturn?.customer,
    products,
    subTotal: saleReturn?.subTotal,
    otherCharges: saleReturn?.otherCharges,
    discount: saleReturn?.discount,
    totalAmount: saleReturn?.totalAmount,
    reason: saleReturn?.reason,
  });

  saleReturn.invoice = invoice;
  await saleReturn.save();

  // Send the invoice to the customer
  if (sale?.customer?.email) {
    await sendMail(
      sale.customer.email,
      "Sales Return Invoice",
      "Please find attached the sales return invoice.",
      invoice
    );
  }

  res.json({ success: true, saleReturn });
};

const getRecentSale = async (req, res) => {
  // Find the most recent sale by sorting by date descending
  const recentSale = await Sale.findOne({})
    .sort({ createdAt: -1 })
    .populate("products.product")
    .populate("customer")
    .populate("signedBy");

  if (!recentSale) {
    return res.status(404).json({ error: "No recent sales found." });
  }

  // Format the recent sale data to include all the relevant details
  const recentSaleDetails = {
    saleId: recentSale._id,
    date: recentSale.createdAt,
    totalAmount: recentSale.totalAmount,
    products: recentSale.products.map((item) => ({
      productName: item?.product?.name,
      quantity: item?.quantity,
      primaryUnit: item?.product?.primaryUnit,
      secondaryUnit: item?.product?.secondaryUnit,
      rate: item?.sellingRate,
      totalPrice: item?.quantity * item?.sellingRate,
    })),
    customer: recentSale.customer
      ? {
          name: recentSale?.customer?.name,
          phone: recentSale?.customer?.phone,
          email: recentSale?.customer?.email,
        }
      : null,
    signedBy: recentSale?.signedBy
      ? {
          name: recentSale.signedBy.name,
          email: recentSale.signedBy.email,
          phone: recentSale.signedBy.phone,
        }
      : null,
  };

  res.json({ recentSale: recentSaleDetails });
};

module.exports = {
  getSales,
  getEmployeeSales,
  getSale,
  getSaleReturns,
  addSale,
  addSaleReturn,
  getRecentSale,
};
