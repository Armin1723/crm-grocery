const Supplier = require("../models/supplier.model");

const getSuppliers = async (req, res) => {
  const { limit = 10, page = 1, name, sort = 'name', sortType = 'asc' } = req.query;

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
  const { name, email, phone, address } = req.body;
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) {
    return res.json({ success: false, message: "Supplier not found" });
  }
  supplier.name = name;
  supplier.email = email;
  supplier.phone = phone;
  supplier.address = address;
  await supplier.save();
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
  addSupplier,
  editSupplier,
  deleteSupplier,
};
