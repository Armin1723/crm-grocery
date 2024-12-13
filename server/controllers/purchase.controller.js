require("dotenv").config();

const Purchase = require("../models/purchase.model");
const Inventory = require("../models/inventory.model");
const Product = require("../models/product.model");

const { roundToTwo } = require("../utils");

const { sendMail, generatePurchaseInvoice } = require("../helpers");

const getPurchases = async (req, res) => {
  try {
    const { limit = 10, page = 1, supplierId = { $exists: true } } = req.query;
    const purchases = await Purchase.find({ supplier: supplierId })
      .limit(limit)
      .skip((page - 1) * limit);

    const totalPurchases = await Purchase.countDocuments({
      supplier: supplierId,
    });
    res.json({
      success: true,
      purchases,
      totalPages: Math.ceil(totalPurchases.length / limit) || 1,
      page,
      totalPurchases,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getEmployeePurchases = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    res.json({ success: true, purchase });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const addPurchase = async (req, res) => {
  try {
    const {
      products = [
        {
          product: "",
          quantity: 0,
          purchaseRate: 0,
          tax: 0,
        },
      ],
      signedBy,
      supplier,
      otherCharges = 0,
      discount = 0,
    } = req.body;

    const purchase = await Purchase.create({
      products,
      signedBy,
      supplier,
      otherCharges,
      discount,
    });

    purchase.subTotal = roundToTwo(
      purchase.products.reduce(
        (acc, product) =>
          acc +
          product.purchaseRate * product.quantity +
          product.tax * product.purchaseRate * product.quantity * 0.01,
        0
      )
    );
    purchase.totalAmount = roundToTwo(
      purchase.subTotal + otherCharges - discount
    );
    await purchase.save();

    // Update Inventory
    req.body.products.forEach(async (product) => {
      const inventory = await Inventory.findOne({
        product: product.product,
        purchaseRate: product.purchaseRate,
      });
      const detailedProduct = await Product.findById(product.product);

      let updatedInventory;

      if (inventory) {
        inventory.quantity += product.quantity;
        updatedInventory = await inventory.save();
      } else {
        updatedInventory = await Inventory.create({
          product: product.product,
          quantity: product.quantity,
          purchaseRate: product.purchaseRate,
        });
      }

      // Send Mail to Admin if rate not found
      if (!detailedProduct.rate) {
        sendMail(
          (to = process.env.ADMIN_EMAIL),
          (subject = "Product Rate Not Found"),
          (message = `Product Rate for ${detailedProduct.name} not found. Please update the product rate <a href='/'>here</a>.`)
        );
        updatedInventory.sellingRate = updatedInventory.purchaseRate * 1.05;
      } else {
        updatedInventory.sellingRate = detailedProduct.rate;
      }
      await updatedInventory.save();
    });

    purchase.invoice = await generatePurchaseInvoice(purchase._id);

    await purchase.save();
    res.json({ success: true, purchase });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  getPurchases,
  getEmployeePurchases,
  getPurchase,
  addPurchase,
};
