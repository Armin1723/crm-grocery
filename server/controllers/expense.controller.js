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
  });

  return res
    .status(201)
    .json({
      success: true,
      message: "Expenses Added Successfully",
      newExpense,
    });
};

const getExpenses = async (req, res) => {
  const {page = 1, limit = 10} = req.query;
  const expenses = await Expense.find().skip((page - 1) * limit).limit(limit);
  const totalExpenses = await Expense.countDocuments();
  return res.status(200).json({ success: true, expenses, page, totalPages: Math.ceil(totalExpenses / limit), totalExpenses });
};

module.exports = {
  addExpense,
  getExpenses,
};
