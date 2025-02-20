const Expense = require("../models/expense.model");

const addExpense = async (req, res) => {
  const { amount, category, description } = req.body;
  if (!amount || !category) {
    return res
      .status(400)
      .json({ message: "Amount and Category are required" });
  }

  const newExpense = await Expense.create({
    amount,
    category,
    description,
    signedBy: req.user.id,
    company: req.user.company,
  });

  return res.status(201).json({
    success: true,
    message: "Expense Added Successfully",
    newExpense,
  });
};

const getExpenses = async (req, res) => {
  const { page = 1, limit = 10, sort = "createdAt", sortType = "desc", category, startDate, endDate } = req.query;
  const query = { company: req.user.company };
  if (category) {
    query.category = { $regex: category, $options: "i" };
  };

  if (startDate && endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: end,
    };
  }
  const expenses = await Expense.find(query)
    .populate("signedBy", "name")
    .sort({ [sort]: sortType })
    .skip((page - 1) * limit)
    .limit(limit);
  const totalExpenses = await Expense.countDocuments(query);
  return res.status(200).json({
    success: true,
    expenses,
    page,
    totalPages: Math.ceil(totalExpenses / limit),
    totalExpenses,
  });
};

module.exports = {
  addExpense,
  getExpenses,
};
