const Purchase = require("../models/purchase.model");
const Expenses = require("../models/expense.model");
const Sale = require("../models/sale.model");
const SalesReturn = require("../models/salesReturn.model");

const getExpenseReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Match within the date range
  const matchStage = {
    createdAt: {
      $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)), // Start of the day for startDate
      $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)), // End of the day for endDate
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
        source: "expense",
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
      totalPurchases: purchaseExpenses.reduce(
        (acc, curr) => acc + curr.amount,
        0
      ),
      totalOtherExpenses: otherExpenses.reduce(
        (acc, curr) => acc + curr.amount,
        0
      ),
    },
  });
};

const getSalesReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Match within the date range
  const matchStage = {
    createdAt: {
      $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
      $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
    },
  };

  // Define queries
  const salesQuery = Sale.aggregate([
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
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customerDetails",
      },
    },
    {
      $addFields: {
        customer: {
          $ifNull: [
            { $arrayElemAt: ["$customerDetails.name", 0] },
            { $arrayElemAt: ["$customerDetails.phone", 0] },
          ],
        },
        customerId: { $arrayElemAt: ["$customerDetails._id", 0] },
        signedBy: { $arrayElemAt: ["$signedBy.name", 0] },
        signedById: { $arrayElemAt: ["$signedBy._id", 0] },
        description: "$notes",
        amount: "$totalAmount",
      },
    },
    {
      $project: {
        createdAt: 1,
        category: "sale",
        customer: 1,
        customerId: 1,
        amount: 1,
        description: 1,
        signedBy: 1,
        signedById: 1,
      },
    },
  ]);

  const salesReturnQuery = SalesReturn.aggregate([
    { $match: matchStage },
    { $unwind: "$products" },
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
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customerDetails",
      },
    },
    {
      $addFields: {
        signedBy: { $arrayElemAt: ["$signedBy.name", 0] },
        signedById: { $arrayElemAt: ["$signedBy._id", 0] },
        customer: {
          $ifNull: [
            { $arrayElemAt: ["$customerDetails.name", 0] },
            { $arrayElemAt: ["$customerDetails.phone", 0] },
          ],
        },
        customerId: { $arrayElemAt: ["$customerDetails._id", 0] },
        amount: "$totalAmount",
      },
    },
    {
      $project: {
        createdAt: 1,
        category: "return",
        amount: 1,
        description: "$notes",
        signedBy: 1,
        signedById: 1,
      },
    },
  ]);

  const reportQuery = Sale.aggregate([
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
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customerDetails",
      },
    },
    {
      $addFields: {
        productCategory: { $arrayElemAt: ["$productDetails.category", 0] },
        customerPhone: { $arrayElemAt: ["$customerDetails.phone", 0] },
        saleAmount: "$totalAmount",
      },
    },
    {
      $facet: {
        totalSales: [
          {
            $group: {
              _id: null,
              total: { $sum: "$saleAmount" },
            },
          },
        ],
        salesByCategory: [
          {
            $group: {
              _id: "$productCategory",
              total: { $sum: "$saleAmount" },
            },
          },
        ],
        salesByCustomer: [
          {
            $group: {
              _id: "$customerPhone",
              total: { $sum: "$saleAmount" },
            },
          },
        ],
      },
    },
    {
      $project: {
        totalSales: { $arrayElemAt: ["$totalSales.total", 0] },
        salesByCategory: {
          $map: {
            input: "$salesByCategory",
            as: "category",
            in: {
              category: "$$category._id",
              total: "$$category.total",
            },
          },
        },
        salesByCustomer: {
          $map: {
            input: "$salesByCustomer",
            as: "customer",
            in: {
              customer: "$$customer._id",
              total: "$$customer.total",
            },
          },
        },
      },
    },
  ]);

  // Run all queries concurrently
  const [sales, salesReturns, report] = await Promise.all([
    salesQuery,
    salesReturnQuery,
    reportQuery,
  ]);

  res.status(200).json({
    success: true,
    data: {
      ...report[0],
      salesList: [...sales.map((sale) => ({ ...sale, source: "sales" }))],
      totalSales: sales.reduce((acc, curr) => acc + curr.amount, 0),
      returnsList: salesReturns,
      totalSalesReturns: salesReturns.reduce(
        (acc, curr) => acc + curr.amount,
        0
      ),
    },
  });
};

module.exports = { getExpenseReport, getSalesReport };
