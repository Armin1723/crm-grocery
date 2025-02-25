const Purchase = require("../models/purchase.model");
const Expense = require("../models/expense.model");
const Sale = require("../models/sale.model");
const SalesReturn = require("../models/salesReturn.model");
const PurchaseReturn = require("../models/purchaseReturn.model");
const mongoose = require("mongoose");

// Utils
const matchStage = (startDate, endDate, req) => ({
  $match: {
    createdAt: {
      $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
      $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
    },
    company: new mongoose.Types.ObjectId(req.user.company),
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

// Controller to fetch the Expense Report
const getExpenseReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Define queries
  const purchaseQuery = Purchase.aggregate([
    matchStage(startDate, endDate, req),
    userLookup,
    { $sort: { createdAt: -1 } },
    supplierLookup,
    {
      $addFields: {
        supplier: { $arrayElemAt: ["$supplierDetails.name", 0] },
        supplierId: { $arrayElemAt: ["$supplierDetails._id", 0] },
        signedBy: { $arrayElemAt: ["$signedBy.name", 0] },
        signedById: { $arrayElemAt: ["$signedBy._id", 0] },
        description: "$notes",
        amount: "$totalAmount",
      },
    },
    {
      $project: {
        _id: 1,
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
    matchStage(startDate, endDate, req),
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
        _id: 1,
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

  const purchaseReturnQuery = PurchaseReturn.aggregate([
    matchStage(startDate, endDate, req),
    supplierLookup,
    userLookup,
    {
      $project: {
        _id: 1,
        createdAt: 1,
        category: "return",
        purchaseId: 1,
        supplier: { $arrayElemAt: ["$supplierDetails.name", 0] },
        supplierId: { $arrayElemAt: ["$supplierDetails._id", 0] },
        signedBy: { $arrayElemAt: ["$signedBy.name", 0] },
        signedById: { $arrayElemAt: ["$signedBy._id", 0] },
        amount: "$totalAmount",
      },
    },
  ]);

  const creditQuery = Purchase.aggregate([
    matchStage(startDate, endDate, req),
    {
      $match: {
        $expr: { $gt: ["$deficitAmount", 0] },
      },
    },
    {$group:{
      _id : null,
      totalCredit : {$sum : { $ceil: "$deficitAmount"}}
    }}
  ]);

  const reportQuery = Purchase.aggregate([
    matchStage(startDate, endDate, req),
    { $unwind: "$products" },
    productLookup,
    supplierLookup,
    {
      $addFields: {
        productCategory: { $arrayElemAt: ["$productDetails.category", 0] },
        supplierName: { $arrayElemAt: ["$supplierDetails.name", 0] },
        expenseAmount: {
          $ceil: {
            $multiply: ["$products.quantity", "$products.purchaseRate"],
          },
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
  const [purchases, otherExpenses, purchaseReturns, credit, report] =
    await Promise.all([
      purchaseQuery,
      otherExpensesQuery,
      purchaseReturnQuery,
      creditQuery,
      reportQuery,
    ]);

  res.status(200).json({
    success: true,
    data: {
      ...report[0],
      purchases,
      otherExpenses,
      purchaseReturnsList: purchaseReturns,
      totalPurchases: purchases.reduce(
        (acc, curr) => acc + curr.amount,
        0
      ),
      totalCredit: credit[0]?.totalCredit || 0,
      totalReturns: purchaseReturns.reduce((acc, curr) => acc + curr.amount, 0),
      totalOtherExpenses: otherExpenses.reduce(
        (acc, curr) => acc + curr.amount,
        0
      ),
    },
  });
};

// Controller to fetch the Sales Report
const getSalesReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Define queries
  const salesQuery = Sale.aggregate([
    matchStage(startDate, endDate, req),
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
        _id: 1,
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
    matchStage(startDate, endDate, req),
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
        saleId: 1,
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
    matchStage(startDate, endDate, req),
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
          $ceil: {
            $multiply: ["$products.sellingRate", "$products.quantity"],
          },
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

  // Aggregating Sales Data
  const salesAggregation = await Sale.aggregate([
    matchStage(startDate, endDate, req),
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
    matchStage(startDate, endDate, req),
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

  if (!salesAggregation[0]) {
    salesAggregation[0] = { totalSales: 0, totalReturns: 0, netSales: 0 };
  }

  salesAggregation[0].totalReturns = returns[0]?.totalReturns || 0;
  salesAggregation[0].netSales =
    salesAggregation[0].totalSales - salesAggregation[0].totalReturns;

  // Aggregating Purchase Data
  const purchasesAggregation = await Purchase.aggregate([
    matchStage(startDate, endDate, req),
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
    matchStage(startDate, endDate, req),
    {
      $group: {
        _id: null,
        totalOtherExpenses: { $sum: "$amount" },
      },
    },
  ]);

  // Aggregating Purchase Returns
  const purchaseReturns = await PurchaseReturn.aggregate([
    matchStage(startDate, endDate, req),
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

  if (!purchasesAggregation[0]) {
    purchasesAggregation[0] = {
      totalPurchases: 0,
      totalOtherExpenses: 0,
      totalReturns: 0,
    };
  }

  purchasesAggregation[0].totalReturns = purchaseReturns[0]?.totalReturns || 0;
  purchasesAggregation[0].totalExpenses =
    (purchasesAggregation[0]?.totalPurchases || 0) +
    (expenseAggregation[0]?.totalOtherExpenses || 0);
  purchasesAggregation[0].netExpenses =
    (purchasesAggregation[0].totalExpenses || 0) -
    (purchasesAggregation[0].totalReturns || 0);

  // Grouped sales data by category
  const salesByCategory = await Sale.aggregate([
    matchStage(startDate, endDate, req),
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
            $ceil: {
              $multiply: ["$products.sellingRate", "$products.quantity"],
            },
          },
        },
      },
    },
  ]);

  // Calculating Gross Profit (Sales - Purchases)
  const grossProfit =
    salesAggregation[0]?.netSales -
    purchasesAggregation[0]?.totalPurchases +
    purchasesAggregation[0]?.totalReturns;

  // Calculating Net Profit (Gross Profit - Expenses)
  const netProfit =
    grossProfit - (expenseAggregation[0]?.totalOtherExpenses || 0);

  // Preparing Chart Data for Recharts (Sales and Expenses over time)
  const salesChartData = await Sale.aggregate([
    matchStage(startDate, endDate, req),
    {
      $project: {
        month: { $month: "$createdAt" },
        year: { $year: "$createdAt" },
        totalAmount: 1,
      },
    },
    {
      $group: {
        _id: {
          month: "$month",
          year: "$year",
        },
        sales: { $sum: "$totalAmount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  // Aggregating Expense Data
  const expenseChartData = await Expense.aggregate([
    matchStage(startDate, endDate, req),
    {
      $project: {
        month: { $month: "$createdAt" },
        year: { $year: "$createdAt" },
        amount: 1,
      },
    },
    {
      $group: {
        _id: {
          month: "$month",
          year: "$year",
        },
        totalExpense: { $sum: "$amount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  const purchaseChartData = await Purchase.aggregate([
    matchStage(startDate, endDate, req),
    {
      $project: {
        month: { $month: "$createdAt" },
        year: { $year: "$createdAt" },
        totalAmount: 1,
      },
    },
    {
      $group: {
        _id: {
          month: "$month",
          year: "$year",
        },
        totalPurchase: { $sum: "$totalAmount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  const combinedExpenseChartData = purchaseChartData.map((purchase) => {
    // Find matching expense data for the same month-year combination
    const expense = expenseChartData.find(
      (expense) =>
        expense._id.month === purchase._id.month &&
        expense._id.year === purchase._id.year
    );

    // If there's no matching expense data, create a default object
    if (!expense) {
      return {
        month: `${purchase._id.month}-${purchase._id.year}`,
        expense: 0,
        purchase: purchase.totalPurchase, // Return the purchase data
      };
    }

    // If there's no matching purchase data, create a default object
    if (!purchase) {
      return {
        month: `${expense._id.month}-${expense._id.year}`,
        expense: expense.totalExpense, // Return the expense data
        purchase: 0,
      };
    }

    // Return the combined data if both exist
    return {
      month: `${expense._id.month}-${expense._id.year}`,
      expense: expense.totalExpense,
      purchase: purchase.totalPurchase,
    };
  });

  // Ensure you include months that are in the `expenseChartData` but not in `purchaseChartData`
  expenseChartData.forEach((expense) => {
    const purchase = purchaseChartData.find(
      (purchase) =>
        purchase._id.month === expense._id.month &&
        purchase._id.year === expense._id.year
    );

    if (!purchase) {
      combinedExpenseChartData.push({
        month: `${expense._id.month}-${expense._id.year}`,
        expense: expense.totalExpense,
        purchase: 0,
      });
    }
  });

  // Grouped expenses data by category
  const expensesByCategory = await Expense.aggregate([
    matchStage(startDate, endDate, req),
    {
      $group: {
        _id: "$category",
        totalExpense: { $sum: "$amount" },
      },
    },
  ]);
  const purchasesByCategory = await Purchase.aggregate([
    matchStage(startDate, endDate, req),
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
            $ceil: {
              $multiply: ["$products.quantity", "$products.purchaseRate"],
            },
          },
        },
      },
    },
  ]);

  const allExpensesByCategory = [...expensesByCategory, ...purchasesByCategory];

  // Formatting the response data
  const reportData = {
    expenses: {
      expenses: purchasesAggregation[0]?.totalExpenses || 0,
      returns: purchasesAggregation[0]?.totalReturns || 0,
      netExpenses: purchasesAggregation[0]?.netExpenses || 0,
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
      expenseChartData: combinedExpenseChartData,
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
};

// Controller for tax report
const getTaxReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Aggregation for Tax Out (Sales) - excluding returned products
  const taxOutPipeline = [
    matchStage(startDate, endDate, req),
    { $unwind: "$products" },
    productLookup,
    userLookup,
    {
      $match: {
        "productDetails.tax": { $exists: true, $ne: null, $gt: 0 },
      },
    },
    // Exclude products from sale returns
    {
      $lookup: {
        from: "saleReturns",
        let: { productId: "$products.product", saleId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$saleId", "$$saleId"] },
                  { $eq: ["$product", "$$productId"] },
                ],
              },
            },
          },
          {
            $project: { _id: 1 },
          },
        ],
        as: "returnedProducts",
      },
    },
    {
      $match: { returnedProducts: { $size: 0 } },
    },
    {
      $addFields: {
        taxAmount: {
          $round: [
            {
              $multiply: [
                { $multiply: ["$products.sellingRate", "$products.quantity"] },
                {
                  $divide: [{ $arrayElemAt: ["$productDetails.tax", 0] }, 100],
                },
              ],
            },
            2,
          ],
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        totalTax: { $sum: "$taxAmount" },
        totalAmount: {
          $sum: { $multiply: ["$products.sellingRate", "$products.quantity"] },
        },
        products: {
          $push: {
            product: "$products.product",
            image: { $arrayElemAt: ["$productDetails.image", 0] },
            name: { $arrayElemAt: ["$productDetails.name", 0] },
            upid: { $arrayElemAt: ["$productDetails.upid", 0] },
            secondaryUnit: {$arrayElemAt: ["$productDetails.secondaryUnit", 0] },
            quantity: "$products.quantity",
            rate: "$products.sellingRate",
            tax: { $arrayElemAt: ["$productDetails.tax", 0] },
            taxAmount: "$taxAmount",
          },
        },
        createdAt: { $first: "$createdAt" },
        signedBy: { $first: {$arrayElemAt : ["$signedBy.name", 0]} },
        signedById: { $first: {$arrayElemAt : ["$signedBy._id", 0]} },
      },
    },
    {
      $project: {
        _id: 1,
        totalTax: 1,
        totalAmount: 1,
        createdAt: 1,
        products: 1,
        signedBy: 1,
        signedById: 1,
      },
    },
    { $sort: { createdAt: -1 } },
  ];

  // Aggregation for Tax In (Purchases) - excluding returned products
  const taxInPipeline = [
    matchStage(startDate, endDate, req),
    { $unwind: "$products" },
    productLookup,
    userLookup,
    {
      $match: {
        "productDetails.tax": { $exists: true, $ne: null, $gt: 0 },
      },
    },
    // Exclude products from purchase returns
    {
      $lookup: {
        from: "purchaseReturns",
        let: { productId: "$products.product", purchaseId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$purchaseId", "$$purchaseId"] },
                  { $eq: ["$product", "$$productId"] },
                ],
              },
            },
          },
          {
            $project: { _id: 1 },
          },
        ],
        as: "returnedProducts",
      },
    },
    {
      $match: { returnedProducts: { $size: 0 } },
    },
    {
      $addFields: {
        taxAmount: {
          $round: [
            {
              $multiply: [
                { $multiply: ["$products.purchaseRate", "$products.quantity"] },
                {
                  $divide: [{ $arrayElemAt: ["$productDetails.tax", 0] }, 100],
                },
              ],
            },
            2,
          ],
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        totalTax: { $sum: "$taxAmount" },
        totalAmount: {
          $sum: {
            $multiply: ["$products.purchaseRate", "$products.quantity"],
          },
        },
        products: {
          $push: {
            product: "$products.product",
            image: { $arrayElemAt: ["$productDetails.image", 0] },
            name: { $arrayElemAt: ["$productDetails.name", 0] },
            upid: { $arrayElemAt: ["$productDetails.upid", 0] },
            secondaryUnit: {$arrayElemAt: ["$productDetails.secondaryUnit", 0] },
            quantity: "$products.quantity",
            rate: "$products.purchaseRate",
            tax: { $arrayElemAt: ["$productDetails.tax", 0] },
            taxAmount: "$taxAmount",
          },
        },
        createdAt: { $first: "$createdAt" },
        signedBy: { $first: {$arrayElemAt : ["$signedBy.name", 0]} },
        signedById: { $first: {$arrayElemAt : ["$signedBy._id", 0]} },
      },
    },
    {
      $project: {
        _id: 1,
        totalTax: 1,
        totalAmount: 1,
        createdAt: 1,
        signedBy: 1,
        signedById: 1,
        products: 1,
      },
    },
    { $sort: { createdAt: -1 } },
  ];

  const [taxOutTransactions, taxInTransactions] = await Promise.all([
    Sale.aggregate(taxOutPipeline),
    Purchase.aggregate(taxInPipeline),
  ]);

  const totalTaxIn = Number(
    parseFloat(
      taxInTransactions.reduce((sum, tx) => sum + tx.totalTax, 0)
    ).toFixed(2)
  );
  const totalTaxOut = Number(
    parseFloat(
      taxOutTransactions.reduce((sum, tx) => sum + tx.totalTax, 0)
    ).toFixed(2)
  );

  // Calculate Net Payable
  const netPayable = Number(parseFloat(totalTaxOut - totalTaxIn).toFixed(2));

  // Send Response
  res.status(200).json({
    totalTaxIn,
    totalTaxOut,
    netPayable,
    taxInTransactions,
    taxOutTransactions,
  });
};

module.exports = {
  getExpenseReport,
  getSalesReport,
  getProfitLossReport,
  getTaxReport,
};
