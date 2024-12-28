const Product = require("../models/product.model");
const Purchase = require("../models/purchase.model");
const Supplier = require("../models/supplier.model");

const getSuppliers = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    name,
    sort = "name",
    sortType = "asc",
  } = req.query;

  const nameQuery = name ? { name: { $regex: name, $options: "i" } } : {};
  const suppliers = await Supplier.find(nameQuery)
    .limit(name ? 5 : limit)
    .skip((page - 1) * limit)
    .sort({ [sort]: sortType });

  const totalResults = await Supplier.countDocuments(nameQuery);
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
  } = req.query;
  const supplier = await Supplier.findById(req.params.id).select("_id").lean();
  if (!supplier) {
    return res.json({ success: false, message: "Supplier not found" });
  }
  const purchases = await Purchase.find({ supplier: req.params.id })
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ [sort]: sortType });
  const totalPurchases = await Purchase.countDocuments({
    supplier: req.params.id,
  });
  const totalPages = Math.ceil(totalPurchases / limit) || 1;

  res.json({ success: true, purchases, page, totalPurchases, totalPages });
};

const getSupplierProducts = async (req, res) => {
  const { limit = 10, page = 1 } = req.query;
  const supplier = await Supplier.findById(req.params.id).select("_id").lean();
  if (!supplier) {
    return res.json({ success: false, message: "Supplier not found" });
  }
  const products = await Product.find({ supplier: req.params.id })
    .limit(limit)
    .skip((page - 1) * limit);
  const totalProducts = await Product.find({
    supplier: req.params.id,
  }).countDocuments();
  const hasMore = totalProducts > page * limit;

  res.json({ success: true, products, hasMore });
};

const addSupplier = async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) {
    return res.json({ success: false, message: "Please fill in all fields" });
  }
  const supplier = new Supplier(req.body);

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
  getSupplierProducts,
  addSupplier,
  editSupplier,
  deleteSupplier,
};
