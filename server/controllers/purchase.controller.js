require("dotenv").config();

const Purchase = require("../models/purchase.model");
const Inventory = require("../models/inventory.model");
const Product = require("../models/product.model");

const { sendMail, generatePurchaseInvoice } = require("../helpers");

const getPurchases = async (req, res) => {
    const {
      limit = 10,
      page = 1,
      supplierId,
      sort = "createdAt",
      sortType = "asc",
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
      totalPages: Math.ceil(totalPurchases / limit) ,
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
    const purchase = await Purchase.findById(req.params.id);
    res.json({ success: true, purchase });
};

const addPurchase = async (req, res) => {
    const {
      products = [
        {
          product: "",
          quantity: 0,
          purchaseRate: 0,
          tax: 0,
        },
      ],
      supplier,
      subTotal,
      otherCharges = 0,
      discount = 0,
      totalAmount,
    } = req.body;

    const purchase = await Purchase.create({
      products: req.body.products.map(product => ({
        product: product._id,               
        sellingRate: product.sellingRate || 0, 
        purchaseRate: product.purchaseRate , 
        quantity: product.quantity || 1,
      })),
      signedBy : req.user.id,
      supplier,
      subTotal,
      otherCharges,
      discount,
      totalAmount,
    });

    await purchase.save();

    // Update Inventory
    req.body.products.forEach(async (product) => {
      const inventory = await Inventory.findOne({
        product: product._id,
        sellingRate: product.sellingRate,
        purchaseRate: product.purchaseRate,
      });
      const detailedProduct = await Product.findById(product._id);

      if(!detailedProduct.rate && product.sellingRate){
        detailedProduct.rate = product.sellingRate;
        await detailedProduct.save();
      }

      let updatedInventory;

      if (inventory) {
        inventory.quantity += product.quantity;
        updatedInventory = await inventory.save();
      } else {
        updatedInventory = await Inventory.create({
          product: product._id,
          quantity: product.quantity,
          purchaseRate: product.purchaseRate,
          sellingRate: product.sellingRate,
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
      purchaseId: recentPurchase._id,
      date: recentPurchase.createdAt,
      totalAmount: recentPurchase.totalAmount,
      products: recentPurchase.products.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        unit: item.product.unit,
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

module.exports = {
  getPurchases,
  getEmployeePurchases,
  getRecentPurchase,
  getPurchase,
  addPurchase,
};
