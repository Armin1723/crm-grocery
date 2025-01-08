const Purchase = require("../models/purchase.model");
const Expenses = require("../models/expense.model");

const getExpenseReport = async (req, res) => {
    const { startDate, endDate } = req.query;

    // Match within the date range
    const matchStage = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    // Define queries
    const purchaseQuery = Purchase.aggregate([
      { $match: matchStage },
      { $unwind: "$products" },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "signedBy",
          foreignField: "_id",
          as: "signedBy",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $lookup: {
          from: "suppliers",
          localField: "supplier",
          foreignField: "_id",
          as: "supplierDetails",
        },
      },
      {
        $addFields: {
          supplier: { $arrayElemAt: ["$supplierDetails.name", 0] },
          supplierId: { $arrayElemAt: ["$supplierDetails._id", 0] },
          signedBy: { $arrayElemAt: ["$signedBy.name", 0] },
          signedById: { $arrayElemAt: ["$signedBy._id", 0] },
          description: "$notes",
          amount: {
            $subtract: [
              {
                $multiply: ["$products.quantity", "$products.purchaseRate"],
              },
              "$deficitAmount",
            ],
          },
        },
      },
      {
        $project: {
          createdAt: 1,
          category: "purchase",
          supplier: 1,
          supplierId: 1,
          amount: 1,
          description: 1,
          signedBy: 1,
          signedById: 1,
        },
      },
    ]);

    const otherExpensesQuery = Expenses.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "signedBy",
          foreignField: "_id",
          as: "signedBy",
        },
      },
      {
        $addFields: {
          source: "other",
          signedBy: { $arrayElemAt: ["$signedBy.name", 0] },
          signedById: { $arrayElemAt: ["$signedBy._id", 0] },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          amount: 1,
          source: 1,
          createdAt: 1,
          description: 1,
          category: 1,
          signedBy: 1,
          signedById: 1,
        },
      },
    ]);

    const reportQuery = Purchase.aggregate([
      { $match: matchStage },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $lookup: {
          from: "suppliers",
          localField: "supplier",
          foreignField: "_id",
          as: "supplierDetails",
        },
      },
      {
        $addFields: {
          productCategory: { $arrayElemAt: ["$productDetails.category", 0] },
          supplierName: { $arrayElemAt: ["$supplierDetails.name", 0] },
          expenseAmount: {
            $subtract: [
              {
                $multiply: ["$products.quantity", "$products.purchaseRate"],
              },
              "$deficitAmount",
            ],
          },
        },
      },
      {
        $facet: {
          totalExpenses: [
            {
              $group: {
                _id: null,
                total: { $sum: "$expenseAmount" },
              },
            },
          ],
          expensesByCategory: [
            {
              $group: {
                _id: "$productCategory",
                total: { $sum: "$expenseAmount" },
              },
            },
          ],
          expensesBySupplier: [
            {
              $group: {
                _id: "$supplierName",
                total: { $sum: "$expenseAmount" },
              },
            },
          ],
        },
      },
      {
        $project: {
          totalExpenses: { $arrayElemAt: ["$totalExpenses.total", 0] },
          expensesByCategory: {
            $map: {
              input: "$expensesByCategory",
              as: "category",
              in: {
                category: "$$category._id",
                total: "$$category.total",
              },
            },
          },
          expensesBySupplier: {
            $map: {
              input: "$expensesBySupplier",
              as: "supplier",
              in: {
                supplier: "$$supplier._id",
                total: "$$supplier.total",
              },
            },
          },
        },
      },
    ]);

    // Run all queries concurrently
    const [purchaseExpenses, otherExpenses, report] = await Promise.all([
      purchaseQuery,
      otherExpensesQuery,
      reportQuery,
    ]);

    // Combine and calculate totals
    const expenseList = [
      ...purchaseExpenses.map((expense) => ({ ...expense, source: "purchase" })),
      ...otherExpenses.map((expense) => ({ ...expense, source: "other" })),
    ];

    res.status(200).json({
      success: true,
      data: {
        ...report[0],
        expenseList,
        totalPurchases: purchaseExpenses.reduce((acc, curr) => acc + curr.amount, 0),
        totalOtherExpenses: otherExpenses.reduce((acc, curr) => acc + curr.amount, 0),
      },
    });
};


module.exports = { getExpenseReport };
