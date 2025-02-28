const { mongoose } = require("mongoose");

const Purchase = require("../models/purchase.model");
const Supplier = require("../models/supplier.model");
const User = require("../models/user.model");

const getSuppliers = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    name,
    sort = "name",
    sortType = "asc",
  } = req.query;

  const query = { company: req.user.company };
  if (name) {
    query.name = { $regex: name, $options: "i" };
  }
  const suppliers = await Supplier.find(query)
    .limit(name ? 5 : limit)
    .skip((page - 1) * limit)
    .sort({ [sort]: sortType });

  const totalResults = await Supplier.countDocuments(query);
  const totalPages = Math.ceil(totalResults / limit) || 1;

  res.json({ success: true, suppliers, page, totalResults, totalPages });
};

const getSupplier = async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) {
    return res.json({ success: false, message: "Supplier not found" });
  }
  res.json({ success: true, supplier });
};

const getSupplierPurchases = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    sort = "createdAt",
    sortType = "desc",
    pending,
  } = req.query;
  const supplier = await Supplier.findById(req.params.id).select("_id").lean();
  if (!supplier) {
    return res.json({ success: false, message: "Supplier not found" });
  }

  const query = { supplier: req.params.id };
  if (pending) {
    query.deficitAmount = { $gt: 0 };
  }
  const purchases = await Purchase.find(query)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ [sort]: sortType });
  const totalResults = await Purchase.countDocuments(query);
  const totalPages = Math.ceil(totalResults / limit) || 1;

  res.json({ success: true, purchases, page, totalResults, totalPages });
};

const addSupplierRepayments = async (req, res) => {
  const { id } = req.params;
  const { purchases, amount } = req.body;

  const supplier = await Supplier.findById(id);
  if (!supplier) {
    return res.status(404).json({ message: "Supplier not found" });
  }

  // Update all purchases
  for (const purchaseId of purchases) {
    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return res
        .status(404)
        .json({ message: "One or more purchases not found" });
    }
    const biller = await User.findById(req.user.id).select("name");
    purchase?.followUpPayments?.push({
      paidAmount: purchase.deficitAmount,
      createdAt: new Date(),
      notes:
        "Repayment of ₹" +
        purchase.deficitAmount +
        " received on " +
        new Date().toLocaleString() +
        " signed by " +
        biller.name +
        ". ",
    });
    purchase.deficitAmount = 0;
    await purchase.save();
  }

  // Update supplier balance
  supplier.balance -= amount;
  await supplier.save();

  res.json({ success: true, message: "Repayment added successfully" });
};

const getSupplierProducts = async (req, res) => {
  const { limit = 5, page = 1 } = req.query;
  const supplierId = req.params.id;

  // Validate if the supplier exists
  const supplier = await Supplier.findById(supplierId).select("_id").lean();
  if (!supplier) {
    return res.json({ success: false, message: "Supplier not found" });
  }

  const products = await Purchase.aggregate([
    { $match: { supplier: new mongoose.Types.ObjectId(supplierId) } }, // Match supplier purchases
    { $unwind: "$products" }, // Decompose products array
    {
      $lookup: {
        from: "products", // Reference products collection
        localField: "products.product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" }, // Unwind the product array
    {
      $group: {
        _id: "$product._id", // Group by product ID to ensure distinct products
        product: { $first: "$product" }, // Select the first instance of the product
      },
    },
    { $replaceRoot: { newRoot: "$product" } },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: parseInt(limit) },
  ]);

  const totalProducts = await Purchase.aggregate([
    { $match: { supplier: new mongoose.Types.ObjectId(supplierId) } },
    { $unwind: "$products" },
    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $group: {
        _id: "$product._id",
      },
    },
  ]);

  const totalPages = Math.ceil(totalProducts.length / limit);

  res.json({
    success: true,
    products,
    currentPage: parseInt(page),
    totalPages,
    totalProducts: totalProducts.length,
    hasMore: page < totalPages,
  });
};

const addSupplier = async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) {
    return res.json({ success: false, message: "Please fill in all fields" });
  }
  const supplier = new Supplier({
    ...req.body,
    company: req.user.company,
  });

  await supplier.save();
  res.json({ success: true, supplier });
};

const editSupplier = async (req, res) => {
  const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body);
  if (!supplier) {
    return res.json({ success: false, message: "Supplier not found" });
  }
  res.json({ success: true, supplier });
};

const deleteSupplier = async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) {
    return res.json({ success: false, message: "Supplier not found" });
  }
  await supplier.delete();
  res.json({ success: true, message: "Supplier deleted" });
};

module.exports = {
  getSuppliers,
  getSupplier,
  getSupplierPurchases,
  addSupplierRepayments,
  getSupplierProducts,
  addSupplier,
  editSupplier,
  deleteSupplier,
};
