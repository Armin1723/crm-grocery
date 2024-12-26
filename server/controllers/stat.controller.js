const Inventory = require("../models/inventory.model");
const Product = require("../models/product.model");
const Purchase = require("../models/purchase.model");
const Sale = require("../models/sale.model");

// Basic stats of sales, purchases, and inventory for recharts
const getBasicStats = async (req, res) => {

  const currentMonth = new Date().getMonth() + 1;

    // Fetch total sales grouped by date
    const salesData = await Sale.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" }, 
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

    // Fetch total purchases grouped by date
    const purchaseData = await Purchase.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" }, 
          count: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 }, 
      },
    ]);

    // Total purchases
    const totalPurchases = await Purchase.countDocuments();

    const lastMonthPurchaseCount =
      purchaseData.find(
        (stat) => stat._id === (currentMonth === 1 ? 12 : currentMonth - 1)
      )?.count || 0;

    const currentMonthPurchaseCount =
      purchaseData.find((data) => data._id === currentMonth)?.count || 0;

    // Calculate percentage change
    const percentagePurchaseChange =
      lastMonthCount > 0
        ? ((currentMonthPurchaseCount - lastMonthPurchaseCount) / lastMonthPurchaseCount) * 100
        : currentMonthPurchaseCount > 0
        ? 100
        : 0;


    // Fetch total Products grouped by date
    const productsData = await Product.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" }, 
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month
      },
    ]);

    // Total products
    const totalProducts = await Product.countDocuments();

    const lastMonthProductCount =
      productsData.find(
        (stat) => stat._id === (currentMonth === 1 ? 12 : currentMonth - 1)
      )?.count || 0;

    const currentMonthProductCount =
      productsData.find((data) => data._id === currentMonth)?.count || 0;

    // Calculate percentage change
    const percentageProductChange =
      lastMonthCount > 0
        ? ((currentMonthProductCount - lastMonthProductCount) / lastMonthProductCount) * 100
        : currentMonthProductCount > 0
        ? 100
        : 0;

    // Fetch total Inventory value grouped by date
    const inventoryData = await Inventory.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group by month
          totalValue: { $sum: { $multiply: ["$quantity", "$sellingRate"] } }, // Calculate total value for each month
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month
      },
    ]);
    
    // Total Inventory value (sum of all quantities * selling rates)
    const totalInventoryValue = await Inventory.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ["$quantity", "$sellingRate"] } }, // Sum total value across all documents
        },
      },
    ]);
    
    // Handle total inventory value
    const totalInventory = totalInventoryValue[0]?.totalValue || 0;
    
    // Get current month and last month inventory values
    const currentMonthInventoryValue =
      inventoryData.find((data) => data._id === currentMonth)?.totalValue || 0;
    
    const lastMonthInventoryValue =
      inventoryData.find(
        (stat) => stat._id === (currentMonth === 1 ? 12 : currentMonth - 1)
      )?.totalValue || 0;
    
    // Calculate percentage change in inventory value
    const percentageInventoryChange =
      lastMonthInventoryValue > 0
        ? ((currentMonthInventoryValue - lastMonthInventoryValue) / lastMonthInventoryValue) * 100
        : currentMonthInventoryValue > 0
        ? 100
        : 0;

    // Format response
    res.json({
      success: true,
      stats: {
        sales: {
          total: totalSales,
          increase: parseFloat(percentageChange.toFixed(1)),
          data: salesData,
        },
        purchases: {
          total: totalPurchases,
          increase: parseFloat(percentagePurchaseChange.toFixed(1)),
          data: purchaseData,
        },
        products: {
          total: totalProducts,
          increase: parseFloat(percentageProductChange.toFixed(1)),
          data: productsData,
        },
        inventory: {
          total: totalInventory,
          increase: parseFloat(percentageInventoryChange.toFixed(1)),
          data: inventoryData,
        },
      },
    });
};

const getProductsGroupedByCategory = async (req, res) => {
    const productData = await Product.aggregate([
      {
        $group: {
          _id: "$category",
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
          _id: { $month: "$createdAt" }, // Group by month
          count: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month
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
      groupFormat = { $isoWeek: "$createdAt" }; // Week number of the year
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
    if(salesData.length > purchaseData.length){
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
  }else{
    formattedData = purchaseData.map((purchaseItem) => {
      const salesItem = salesData.find(
        (item) => item._id === purchaseItem._id
      );
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
