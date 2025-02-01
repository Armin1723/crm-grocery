const Customer = require("../models/customer.model");

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&'); // Escapes special regex characters
};

const getCustomer = async (req, res) => {
  const { phone } = req.params;

  const customer = await Customer.findOne({ phone });
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  res.json({ success: true, customer });
};

const getCustomersByName = async (req, res) => {
  const { query } = req.query;

  // Escape the query to avoid special character issues
  const escapedQuery = escapeRegExp(query);

  const customers = await Customer.find({
    $or: [
      { name: { $regex: escapedQuery, $options: "i" } },
      { phone: { $regex: escapedQuery, $options: "i" } },
    ],
  }).limit(5);
  res.json({ success: true, customers });
};

const addEditCustomer = async (req, res) => {
  const { name, email, phone, address } = req.body;
  if (!phone) {
    return res
      .status(400)
      .json({ message: "Phone number is required", customer: null });
  }
  const customer = await Customer.findOneAndUpdate(
    { phone },
    { name, email, address },
    { new: true, upsert: true }
  );
  res.json({
    success: true,
    customer: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    },
  });
};

module.exports = {
  getCustomer,
  getCustomersByName,
  addEditCustomer,
};