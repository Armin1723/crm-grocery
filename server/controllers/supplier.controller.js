const Supplier = require("../models/supplier.model");

const getSuppliers = async (req, res) => {
  try {
    const { limit = 10, page = 1, name } = req.query;

    const nameQuery = name ? { name: { $regex: name, $options: "i" } } : {};
    const suppliers = await Supplier.find(nameQuery)
      .limit(name ? 5 : limit)
      .skip((page - 1) * limit);

    const totalSuppliers = await Supplier.countDocuments(nameQuery);
    const totalPages = Math.ceil(totalSuppliers / limit) || 1;

    res.json({ success: true, suppliers, page, totalSuppliers, totalPages });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.json({ success: false, message: "Supplier not found" });
    }
    res.json({ success: true, supplier });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const addSupplier = async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.json({ success: true, supplier });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const editSupplier = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.json({ success: false, message: "Supplier not found" });
    }
    await supplier.delete();
    res.json({ success: true, message: "Supplier deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  getSuppliers,
  getSupplier,
  addSupplier,
  editSupplier,
  deleteSupplier,
};
