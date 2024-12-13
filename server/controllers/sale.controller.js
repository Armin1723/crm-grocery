const { generateSaleInvoice, sendMail } = require("../helpers");
const Inventory = require("../models/inventory.model");
const Product = require("../models/product.model");
const Sale = require("../models/sale.model");
const { roundToTwo } = require("../utils");

const getSales = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const sales = await Sale.find()
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

module.exports = {
  getSales,
  getEmployeeSales,
  getSale,
  addSale,
};
