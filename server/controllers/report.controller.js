const Purchase = require("../models/purchase.model");
const Expense = require("../models/expense.model");
const Sale = require("../models/sale.model");
const SalesReturn = require("../models/salesReturn.model");

// Utils
const matchStage = (startDate, endDate) => ({
  $match: {
    createdAt: {
      $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
      $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
    },
  },
});

const userLookup = {
  $lookup: {
    from: "users",
    localField: "signedBy",
    foreignField: "_id",
    as: "signedBy",
  },
};

const productLookup = {
  $lookup: {
    from: "products",
    localField: "products.product",
    foreignField: "_id",
    as: "productDetails",
  },
};

const supplierLookup = {
  $lookup: {
    from: "suppliers",
    localField: "supplier",
    foreignField: "_id",
    as: "supplierDetails",
  },
};

const customerLookup = {
  $lookup: {
    from: "customers",
    localField: "customer",
    foreignField: "_id",
    as: "customerDetails",
  },
};

const mergeSortedArrays = (arr1, arr2, key) => {
  let i = 0,
    j = 0;
  const mergedArray = [];
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i][key] > arr2[j][key]) {
      mergedArray.push(arr1[i]);
      i++;
    } else {
      mergedArray.push(arr2[j]);
      j++;
    }
  }
  while (i < arr1.length) {
    mergedArray.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    mergedArray.push(arr2[j]);
    j++;
  }
  return mergedArray;
};

// Controller to fetch the Expense Report
const getExpenseReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Define queries
  const purchaseQuery = Purchase.aggregate([
    matchStage(startDate, endDate),
    userLookup,
    { $sort: { createdAt: -1 } },
    { $unwind: "$products" },
    productLookup,
    supplierLookup,
    {
      $addFields: {
        supplier: { $arrayElemAt: ["$supplierDetails.name", 0] },
        supplierId: { $arrayElemAt: ["$supplierDetails._id", 0] },
        signedBy: { $arrayElemAt: ["$signedBy.name", 0] },
        signedById: { $arrayElemAt: ["$signedBy._id", 0] },
        description: "$notes",
        amount: {
          $multiply: ["$products.quantity", "$products.purchaseRate"],
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

  const otherExpensesQuery = Expense.aggregate([
    matchStage(startDate, endDate),
    userLookup,
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
    matchStage(startDate, endDate),
    { $unwind: "$products" },
    productLookup,
    supplierLookup,
    {
      $addFields: {
        productCategory: { $arrayElemAt: ["$productDetails.category", 0] },
        supplierName: { $arrayElemAt: ["$supplierDetails.name", 0] },
        expenseAmount: {
          $multiply: ["$products.quantity", "$products.purchaseRate"],
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
  const expenseList = mergeSortedArrays(purchaseExpenses, otherExpenses, "createdAt");

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

  // Define queries
  const salesQuery = Sale.aggregate([
    matchStage(startDate, endDate),
    { $unwind: "$products" },
    { $sort: { createdAt: -1 } },
    userLookup,
    productLookup,
    customerLookup,
    {
      $group: {
        _id: "$_id", // Group by the sale document ID
        createdAt: { $first: "$createdAt" },
        signedBy: { $first: { $arrayElemAt: ["$signedBy.name", 0] } },
        signedById: { $first: { $arrayElemAt: ["$signedBy._id", 0] } },
        customer: {
          $first: {
            $ifNull: [
              { $arrayElemAt: ["$customerDetails.name", 0] },
              { $arrayElemAt: ["$customerDetails.phone", 0] },
            ],
          },
        },
        customerId: { $first: { $arrayElemAt: ["$customerDetails._id", 0] } },
        description: { $first: "$notes" },
        amount: { $first: "$totalAmount" },
        paymentMode: { $first: "$paymentMode" },
      },
    },
    { $sort: { createdAt: -1 } },
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
        paymentMode: 1,
      },
    },
  ]);

  const salesReturnQuery = SalesReturn.aggregate([
    matchStage(startDate, endDate),
    { $unwind: "$products" },
    userLookup, 
    productLookup,
    customerLookup,
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
    { $sort: { createdAt: -1 } },
    {
      $project: {
        createdAt: 1,
        category: "return",
        amount: 1,
        description: "$notes",
        customer: 1,
        customerId: 1,
        signedBy: 1,
        signedById: 1,
      },
    },
  ]);

  const reportQuery = Sale.aggregate([
    matchStage(startDate, endDate),
    { $unwind: "$products" },
    productLookup,
    customerLookup,
    {
      $addFields: {
        productCategory: { $arrayElemAt: ["$productDetails.category", 0] },
        customerPhone: {
          $ifNull: [
            { $arrayElemAt: ["$customerDetails.name", 0] },
            { $arrayElemAt: ["$customerDetails.phone", 0] },
            "Others",
          ],
        },
        saleAmount: {
          $multiply: ["$products.sellingRate", "$products.quantity"],
        },
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

  const totalSales = sales.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalSalesReturns = salesReturns.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );
  const netSales = totalSales - totalSalesReturns;

  // Calculate cashInHand and cashAtBank
  const cashInHand =
    sales
      .filter((sale) => sale.paymentMode === "cash")
      .reduce((acc, curr) => acc + curr.amount, 0) - totalSalesReturns;

  const cashAtBank = netSales - cashInHand;

  res.status(200).json({
    success: true,
    data: {
      totalSales,
      cashInHand,
      cashAtBank,
      totalSalesReturns,
      netSales,
      ...report[0],
      salesList: [...sales.map((sale) => ({ ...sale, source: "sales" }))],
      returnsList: salesReturns,
    },
  });
};

// Controller to fetch the Profit/Loss report
const getProfitLossReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    // Aggregating Sales Data
    const salesAggregation = await Sale.aggregate([
      matchStage(startDate, endDate),
      {
        $project: {
          totalAmount: 1,
          discount: 1,
          otherCharges: 1,
          products: 1,
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
        },
      },
    ]);

    const returns = await SalesReturn.aggregate([
      matchStage(startDate, endDate),
      {
        $project: {
          totalAmount: 1,
        },
      },
      {
        $group: {
          _id: null,
          totalReturns: { $sum: "$totalAmount" },
        },
      },
    ]);

    salesAggregation[0].totalReturns = returns[0]?.totalReturns || 0;
    salesAggregation[0].netSales =
      salesAggregation[0].totalSales - salesAggregation[0].totalReturns;

    // Aggregating Purchase Data
    const purchasesAggregation = await Purchase.aggregate([
      matchStage(startDate, endDate),
      {
        $project: {
          totalAmount: 1,
          products: 1,
        },
      },
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Aggregating Expense Data
    const expenseAggregation = await Expense.aggregate([
      matchStage(startDate, endDate),
      {
        $group: {
          _id: null,
          totalOtherExpenses: { $sum: "$amount" },
        },
      },
    ]);

    // Grouped sales data by category
    const salesByCategory = await Sale.aggregate([
      matchStage(startDate, endDate),
      {
        $unwind: "$products",
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
        $group: {
          _id: "$productDetails.category",
          totalSales: {
            $sum: {
              $multiply: ["$products.sellingRate", "$products.quantity"],
            },
          },
        },
      },
    ]);

    // Calculating Gross Profit (Sales - Purchases)
    const grossProfit =
      salesAggregation[0]?.netSales - purchasesAggregation[0]?.totalPurchases ||
      0;

    // Calculating Net Profit (Gross Profit - Expenses)
    const netProfit =
      grossProfit - (expenseAggregation[0]?.totalOtherExpenses || 0);

    // Preparing Chart Data for Recharts (Sales and Expenses over time)
    const salesChartData = await Sale.aggregate([
      matchStage(startDate, endDate),
      {
        $project: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          totalAmount: 1,
        },
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          sales: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Aggregating Expense Data
    const expenseChartData = await Expense.aggregate([
      matchStage(startDate, endDate),
      {
        $project: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          amount: 1,
        },
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          totalExpense: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Grouped expenses data by category
    const expensesByCategory = await Expense.aggregate([
      matchStage(startDate, endDate),
      {
        $group: {
          _id: "$category",
          totalExpense: { $sum: "$amount" },
        },
      },
    ]);
    const purchasesByCategory = await Purchase.aggregate([
      matchStage(startDate, endDate), 
      {
        $unwind: "$products",
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
        $group: {
          _id: "$productDetails.category",
          totalPurchases: {
            $sum: {
              $multiply: ["$products.quantity", "$products.purchaseRate"],
            },
          },
        },
      },
    ]);

    const allExpensesByCategory = [
      ...expensesByCategory,
      ...purchasesByCategory,
    ];

    // Formatting the response data
    const reportData = {
      expenses: {
        purchases: purchasesAggregation[0]?.totalPurchases || 0,
        otherExpenses: expenseAggregation[0]?.totalOtherExpenses || 0,
        total:
          (purchasesAggregation[0]?.totalPurchases || 0) +
          (expenseAggregation[0]?.totalOtherExpenses || 0),
      },
      sales: {
        sales: salesAggregation[0]?.totalSales || 0,
        returns: salesAggregation[0]?.totalReturns || 0,
        netSales: salesAggregation[0]?.netSales || 0,
      },
      grossProfit: grossProfit,
      netProfit: netProfit,
      charts: {
        salesChartData: salesChartData.map((item) => ({
          month: `${item._id.month}-${item._id.year}`,
          sales: item.sales,
        })),
        expenseChartData: expenseChartData.map((item) => ({
          month: `${item._id.month}-${item._id.year}`,
          expense: item.totalExpense,
        })),
        salesByCategory: salesByCategory.map((item) => ({
          category: item._id[0] || item._id,
          total: item.totalSales,
        })),
        expensesByCategory: allExpensesByCategory.map((item) => ({
          category: item.totalExpense ? item._id : item._id[0],
          total: item.totalExpense || item.totalPurchases,
        })),
      },
    };

    return res.status(200).json(reportData);
  } catch (error) {
    console.error("Error generating ProfitLossReport:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getExpenseReport, getSalesReport, getProfitLossReport };
