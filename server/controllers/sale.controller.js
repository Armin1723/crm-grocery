const { generateSaleInvoice, sendMail } = require("../helpers");
const Inventory = require("../models/inventory.model");
const Product = require("../models/product.model");
const Sale = require("../models/sale.model");
const { roundToTwo } = require("../utils");

const getSales = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const sales = await Sale.find()
    .populate("signedBy")
      .limit(limit)
      .skip((page - 1) * limit);

    const totalSales = await Sale.countDocuments();

    res.json({
      success: true,
      sales,
      totalPages: Math.ceil(totalSales / limit) || 1,
      page,
      totalSales,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getEmployeeSales = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    res.json({ success: true, sale });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const addSale = async (req, res) => {
  try {
    const {
      products = [
        {
          product: "",
          quantity: 0,
          sellingRate: 0,
          tax: 0,
        },
      ],
      signedBy,
      customer,
      otherCharges = 0,
      discount = 0,
      paymentMode = "cash",
    } = req.body;

    const sale = await Sale.create({
      products,
      signedBy,
      customer,
      otherCharges,
      paymentMode,
      discount,
    });

    sale.subTotal = roundToTwo(
      req.body.products.reduce(
        (acc, product) =>
          acc +
          product.sellingRate * product.quantity +
          product.tax * product.sellingRate * product.quantity * 0.01,
        0
      )
    );
    sale.totalAmount = roundToTwo(sale.subTotal + otherCharges - discount);
    await sale.save();

    // Update Inventory
    req.body.products.forEach(async (product) => {
      const inventory = await Inventory.findOne({
        product: product.product,
        sellingRate: product.sellingRate,
      });
      const detailedProduct = await Product.findById(product.product);

      inventory.quantity -= product.quantity;
      await inventory.save();

      // Send Mail to Admin if stockPreference set
      if (detailedProduct.stockPreference) {
        if (inventory.quantity < detailedProduct.stockPreference) {
          sendMail(
            (to = process.env.ADMIN_EMAIL),
            (subject = "Low Stock Alert"),
            (message = `${detailedProduct.name} is running low on stock. Current Stock: ${inventory.quantity}`)
          );
        }
      }
    });

    // 10 digit transaction ID prefixed by TRN
    const generateTransactionId = async () => {
        const ID = `TRN${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        const sale = await Sale.findOne({ transactionId: ID });
        if (sale) {
          return generateTransactionId();
        } else {
          return ID;
        }
      };

    sale.transactionId = await generateTransactionId() 

    sale.invoice = await generateSaleInvoice(sale._id);

    await sale.save();
    res.json({ success: true, sale });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getRecentSale = async (req, res) => {
  try {
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
        productName: item.product.name,
        quantity: item.quantity,
        unit: item.product.unit,
        rate: item.saleRate,
        totalPrice: item.quantity * item.saleRate,
      })),
      customer: recentSale.customer
        ? {
            name: recentSale.customer.name,
            phone: recentSale.customer.phone,
            email: recentSale.customer.email,
          }
        : null,
      signedBy: recentSale.signedBy
        ? {
            name: recentSale.signedBy.name,
            email: recentSale.signedBy.email,
            phone: recentSale.signedBy.phone,
          }
        : null,
    };

    res.json({ recentSale: recentSaleDetails });
  } catch (error) {
    console.error("Error fetching recent sale:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch the most recent sale." });
  }
};

module.exports = {
  getSales,
  getEmployeeSales,
  getSale,
  addSale,
  getRecentSale,
};
