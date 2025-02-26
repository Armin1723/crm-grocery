const mongoose = require("mongoose");

const Customer = require("../models/customer.model");
const Sale = require("../models/sale.model");
const User = require("../models/user.model");

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
};

const getCustomer = async (req, res) => {
  const { id } = req.params;
  const company = req.user.company;

  const customer = await Customer.findOne({ _id: id, company });
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  res.json({ success: true, customer });
};

const getCustomers = async (req, res) => {
  const { query } = req.query;
  const company = req.user.company;

  const { limit = 5, page = 1, sort = "name", sortType = "asc" } = req.query;

  // Escape the query to avoid special character issues
  const escapedQuery = escapeRegExp(query);

  const customers = await Customer.find({
    $and: [
      { company },
      {
        $or: [
          { name: { $regex: escapedQuery, $options: "i" } },
          { phone: { $regex: escapedQuery, $options: "i" } },
        ],
      },
    ],
  })
    .sort({ [sort]: sortType })
    .limit(limit)
    .skip((page - 1) * limit);

  const totalResults = await Customer.countDocuments({
    $and: [
      { company },
      {
        $or: [
          { name: { $regex: escapedQuery, $options: "i" } },
          { phone: { $regex: escapedQuery, $options: "i" } },
        ],
      },
    ],
  });

  const totalPages = Math.ceil(totalResults / limit) || 1;

  res.json({ success: true, customers, page, totalResults, totalPages });
};

const addEditCustomer = async (req, res) => {
  const { name, email, phone, address, description } = req.body;
  if (!phone) {
    return res
      .status(400)
      .json({ message: "Phone number is required", customer: null });
  }
  const customer = await Customer.findOneAndUpdate(
    { phone, company: req.user.company },
    { name, email, address, description },
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

const getCustomerSales = async (req, res) => {
  const { id } = req.params;
  const company = req.user.company;

  const { pending } = req.query;

  let query = { customer: id, company };

  if (pending) {
    query = { ...query, deficitAmount: { $gt: 0 } };
  }

  const {
    limit = 10,
    page = 1,
    sort = "createdAt",
    sortType = "desc",
  } = req.query;

  const customer = await Customer.findOne({ _id: id, company });
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  const sales = await Sale.find(query)
    .sort({ [sort]: sortType })
    .limit(limit)
    .skip((page - 1) * limit);

  const totalResults = await Sale.countDocuments(query);

  const totalPages = Math.ceil(totalResults / limit) || 1;

  res.json({ success: true, sales, page, totalResults, totalPages });
};

const getCustomerProducts = async (req, res) => {
  const { limit = 5, page = 1 } = req.query;
  const customerId = req.params.id;

  // Validate if the customer exists
  const customer = await Customer.findById(customerId).select("_id").lean();
  if (!customer) {
    return res.json({ success: false, message: "Customer not found" });
  }

  const products = await Sale.aggregate([
    { $match: { customer: new mongoose.Types.ObjectId(customerId) } }, // Match customer sales
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

  const totalProducts = await Sale.aggregate([
    { $match: { customer: new mongoose.Types.ObjectId(customerId) } },
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

const addCustomerRepayments = async (req, res) => {
  const {id} = req.params;
  const {sales, amount} = req.body;

  const customer = await Customer.findById(id);
  if (!customer) {
    return res.status(404).json({message: "Customer not found"});
  }

  // Update all sales
  for (const saleId of sales) {
    const sale = await Sale.findById(saleId);
    if (!sale) {
      return res.status(404).json({message: "One or more sales not found"});
    }
    const biller = await User.findById(req.user.id).select("name");
    const remainingAmount = sale?.deficitAmount;
    sale.deficitAmount = 0;
    sale.paidAmount = sale?.totalAmount;
    sale.description = (sale?.description || '') + "Repayment of ₹" + remainingAmount + " received on " + new Date().toLocaleString() + " signed by " + biller.name + ". ";
    await sale.save();
  }

  // Update customer balance
  customer.balance -= amount;
  await customer.save();

  res.json({success: true, message: "Repayment added successfully"});
};

module.exports = {
  getCustomer,
  getCustomers,
  addEditCustomer,
  getCustomerSales,
  getCustomerProducts,
  addCustomerRepayments,
};
