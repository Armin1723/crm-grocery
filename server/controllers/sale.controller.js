const { generateSaleInvoice, sendMail } = require("../helpers");
const Inventory = require("../models/inventory.model");
const Sale = require("../models/sale.model");
const Customer = require("../models/customer.model");
const lowStockMailTemplate = require("../templates/email/lowStockMailTemplate");

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
  res.json({ success: true, sale });
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

  await sale.save();

  // Update Inventory
  products.forEach(async (product) => {
    const inventory = await Inventory.findOne({
      product: product.product,
    }).populate("product");
    inventory?.batches.forEach((batch) => {
      const sameBatch =
        (!batch.expiry || !product.expiry || batch.expiry === product.expiry) &&
        batch.purchaseRate === product.purchaseRate;
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
  addSale,
  getRecentSale,
};
