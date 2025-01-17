const Inventory = require("../models/inventory.model");
const Product = require("../models/product.model");
const Purchase = require("../models/purchase.model");
const Sale = require("../models/sale.model");

const matchStage = {
  $match: {
    totalQuantity: { $gt: 0 },
  },
};

// Basic stats of sales, purchases, and inventory for recharts
const getBasicStats = async (req, res) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const sixMonthsAgoDate = new Date();
  sixMonthsAgoDate.setMonth(sixMonthsAgoDate.getMonth() - 6);

  // Helper function to calculate percentage change
  const calculatePercentageChange = (current, last) =>
    last > 0 ? ((current - last) / last) * 100 : current > 0 ? 100 : 0;

  // Helper function to find previous month data
  const calculatePreviousMonthData = (data, currentMonth, currentYear) => {
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    return (
      data.find(
        (d) => d._id.month === previousMonth && d._id.year === previousYear
      ) || { count: 0, totalValue: 0 }
    );
  };

  // Aggregate data for sales, purchases, products, and inventory
  const [salesData, purchaseData, productsData, inventoryData] =
    await Promise.all([
      Sale.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgoDate } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: "$totalAmount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Purchase.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgoDate } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: "$totalAmount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Product.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgoDate } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Inventory.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgoDate } } },
        { $unwind: "$batches" },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            totalValue: {
              $sum: {
                $multiply: ["$batches.quantity", "$batches.purchaseRate"],
              },
            },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

  // Add date strings for Recharts and calculate totals
  const formatData = (data) =>
    data.map((item) => ({
      ...item,
      date: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`, // e.g., "2024-06"
    }));

  const formattedSalesData = formatData(salesData);
  const formattedPurchaseData = formatData(purchaseData);
  const formattedProductsData = formatData(productsData);
  const formattedInventoryData = formatData(inventoryData);

  const totalSales = salesData.reduce((acc, curr) => acc + curr.count, 0);
  const totalPurchases = purchaseData.reduce(
    (acc, curr) => acc + curr.count,
    0
  );
  const totalProducts = await Product.countDocuments();
  const totalInventory = inventoryData.reduce(
    (acc, curr) => acc + curr.totalValue,
    0
  );

  // Get current and last month's data for percentage change calculations
  const currentSales =
    salesData.find(
      (d) => d._id.month === currentMonth && d._id.year === currentYear
    )?.count || 0;
  const lastMonthSales = calculatePreviousMonthData(
    salesData,
    currentMonth,
    currentYear
  ).count;

  const currentPurchases =
    purchaseData.find(
      (d) => d._id.month === currentMonth && d._id.year === currentYear
    )?.count || 0;
  const lastMonthPurchases = calculatePreviousMonthData(
    purchaseData,
    currentMonth,
    currentYear
  ).count;

  const currentProducts =
    productsData.find(
      (d) => d._id.month === currentMonth && d._id.year === currentYear
    )?.count || 0;
  const lastMonthProducts = calculatePreviousMonthData(
    productsData,
    currentMonth,
    currentYear
  ).count;

  const currentInventory =
    inventoryData.find(
      (d) => d._id.month === currentMonth && d._id.year === currentYear
    )?.totalValue || 0;
  const lastMonthInventory = calculatePreviousMonthData(
    inventoryData,
    currentMonth,
    currentYear
  ).totalValue;

  // Build stats object
  const stats = {
    sales: {
      total: totalSales,
      currentValue: currentSales,
      increase: calculatePercentageChange(currentSales, lastMonthSales),
      data: formattedSalesData,
    },
    purchases: {
      total: totalPurchases,
      currentValue: currentPurchases,
      increase: calculatePercentageChange(currentPurchases, lastMonthPurchases),
      data: formattedPurchaseData,
    },
    products: {
      total: totalProducts,
      currentValue: currentProducts,
      increase: calculatePercentageChange(currentProducts, lastMonthProducts),
      data: formattedProductsData,
    },
    inventory: {
      total: totalInventory,
      currentValue: currentInventory,
      increase: calculatePercentageChange(currentInventory, lastMonthInventory),
      data: formattedInventoryData,
    },
  };

  res.json({ success: true, stats });
};

const getProductsGroupedByCategory = async (req, res) => {
  const productData = await Inventory.aggregate([
    matchStage,
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $group: {
        _id: "$productDetails.category",
        value: { $sum: 1 },
      },
    },
  ]);

  res.json({ success: true, data: productData });
};

const getPurchaseStats = async (req, res) => {
  const { date = new Date().toISOString() } = req.query;

  // Parse the provided date
  const targetDate = new Date(date);

  // Daily Purchase Stats
  const dailyPurchases = await Purchase.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by day
        totalAmount: { $sum: "$totalAmount" },
        totalTax: { $sum: "$tax" },
        totalDiscount: { $sum: "$discount" },
        totalQuantity: { $sum: "$products.quantity" },
      },
    },
    { $sort: { _id: 1 } }, // Sort by date
  ]);

  // Weekly Purchase Stats
  const weeklyPurchases = await Purchase.aggregate([
    {
      $group: {
        _id: {
          week: { $week: "$createdAt" }, // Group by week
          year: { $year: "$createdAt" },
        },
        totalAmount: { $sum: "$totalAmount" },
        totalTax: { $sum: "$tax" },
        totalDiscount: { $sum: "$discount" },
        totalQuantity: { $sum: "$products.quantity" },
      },
    },
    { $sort: { "_id.year": 1, "_id.week": 1 } }, // Sort by year and week
  ]);

  // Monthly Purchase Stats
  const monthlyPurchases = await Purchase.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, // Group by month
        totalAmount: { $sum: "$totalAmount" },
        totalTax: { $sum: "$tax" },
        totalDiscount: { $sum: "$discount" },
        totalQuantity: { $sum: "$products.quantity" },
      },
    },
    { $sort: { _id: 1 } }, // Sort by month
  ]);

  // Top Purchased Products
  const topPurchasedProducts = await Purchase.aggregate([
    {
      $unwind: "$products", // Deconstruct the products array
    },
    {
      $group: {
        _id: "$products.product", // Group by product ID
        totalQuantity: { $sum: "$products.quantity" }, // Sum quantities purchased
        totalPurchaseAmount: {
          $sum: {
            $multiply: ["$products.quantity", "$products.purchaseRate"],
          },
        }, // Total amount for each product
      },
    },
    { $sort: { totalPurchaseAmount: -1 } }, // Sort by purchase amount descending
    { $limit: 10 }, // Limit to top 10 purchased products
  ]);

  // Monthly Category-wise Purchase Stats
  const categoryPurchaseStats = await Purchase.aggregate([
    {
      $unwind: "$products", // Deconstruct the products array
    },
    {
      $lookup: {
        from: "products", // Join with the Product collection to fetch category details
        localField: "products.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails", // Deconstruct product details array
    },
    {
      $group: {
        _id: {
          month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, // Group by month
          category: "$productDetails.category", // Group by category
        },
        totalPurchaseAmount: {
          $sum: {
            $multiply: ["$products.quantity", "$products.purchaseRate"],
          },
        }, // Total purchase amount for category
      },
    },
    {
      $group: {
        _id: "$_id.month", // Group by month
        categories: {
          $push: {
            category: "$_id.category", // Push category and purchase amount
            totalPurchaseAmount: "$totalPurchaseAmount",
          },
        },
      },
    },
    { $sort: { _id: 1 } }, // Sort by month
  ]);

  res.json({
    success: true,
    stats: {
      dailyPurchases,
      weeklyPurchases,
      monthlyPurchases,
      topPurchasedProducts,
      categoryPurchaseStats, // Monthly category-wise purchase stats for pie charts
    },
  });
};

const getProductStats = async (req, res) => {
  const productData = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        totalProducts: { $sum: 1 },
      },
    },
  ]);

  res.json({ success: true, data: productData });
};

const getSaleStats = async (req, res) => {
  const currentMonth = new Date().getMonth() + 1;

  // Fetch total sales grouped by date
  const salesData = await Sale.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt", $year: "$createdAt" },
        count: { $sum: "$totalAmount" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Total sales
  const totalSales = await Sale.countDocuments();

  const lastMonthCount =
    salesData.find(
      (stat) => stat._id === (currentMonth === 1 ? 12 : currentMonth - 1)
    )?.count || 0;

  const currentMonthCount =
    salesData.find((data) => data._id === currentMonth)?.count || 0;

  // Calculate percentage change
  const percentageChange =
    lastMonthCount > 0
      ? ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100
      : currentMonthCount > 0
      ? 100
      : 0;
  res.json({
    success: true,
    stats: {
      sales: {
        total: totalSales,
        increase: percentageChange.toFixed(1),
        data: salesData,
      },
    },
  });
};

const getInventoryGroupedByCategory = async (req, res) => {
  const inventoryData = await Inventory.aggregate([
    matchStage,
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $group: {
        _id: "$productDetails.category",
        totalStock: { $sum: "$quantity" },
        totalValue: {
          $sum: { $multiply: ["$quantity", "$productDetails.rate"] },
        },
      },
    },
  ]);

  res.json({ success: true, data: inventoryData });
};

const salesPurchaseChart = async (req, res) => {
  // Sales/Purchase chart data
  const { groupBy = "daily" } = req.query; // 'daily', 'weekly', or 'monthly'

  if (!groupBy || !["daily", "weekly", "monthly"].includes(groupBy)) {
    return res.status(400).json({ error: "Invalid 'groupBy' parameter" });
  }

  // Set the grouping format based on the query param
  let groupFormat;
  switch (groupBy) {
    case "daily":
      groupFormat = {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
      };
      break;
    case "weekly":
      groupFormat = {
        $concat: [
          { $toString: { $isoWeekYear: "$createdAt" } }, // Year of the ISO week
          "-",
          { $toString: { $isoWeek: "$createdAt" } }, // ISO week number
        ],
      };
      break;
    case "monthly":
      groupFormat = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
      break;
  }

  const salesData = await Sale.aggregate([
    {
      $group: {
        _id: groupFormat,
        totalSales: { $sum: "$totalAmount" },
      },
    },
    {
      $sort: { _id: 1 }, // Sort by date ascending
    },
  ]);
  const purchaseData = await Purchase.aggregate([
    {
      $group: {
        _id: groupFormat,
        totalPurchases: { $sum: "$totalAmount" },
      },
    },
    {
      $sort: { _id: 1 }, // Sort by date ascending
    },
  ]);

  // Format the response
  let formattedData;
  if (salesData.length > purchaseData.length) {
    formattedData = salesData.map((salesItem) => {
      const purchaseItem = purchaseData.find(
        (item) => item._id === salesItem._id
      );
      return {
        name: salesItem._id,
        sales: salesItem.totalSales,
        purchases: purchaseItem ? purchaseItem.totalPurchases : 0,
      };
    });
  } else {
    formattedData = purchaseData.map((purchaseItem) => {
      const salesItem = salesData.find((item) => item._id === purchaseItem._id);
      return {
        name: purchaseItem._id,
        sales: salesItem ? salesItem.totalSales : 0,
        purchases: purchaseItem.totalPurchases,
      };
    });
  }

  res.json({ success: true, stats: formattedData });
};

module.exports = {
  getBasicStats,
  getPurchaseStats,
  getProductStats,
  getSaleStats,
  salesPurchaseChart,
  getInventoryGroupedByCategory,
  getProductsGroupedByCategory,
};
