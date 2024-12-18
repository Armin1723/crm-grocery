const Inventory = require("../models/inventory.model");

const getProductsFromInventory = async (req, res) => {
  try {
    const { name, upid, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build the aggregation pipeline
    const pipeline = [
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "details",
        },
      },
      { $unwind: "$details" },
      {$match: {quantity: {$gt: 0}}},
    ];

    // If a name query is provided, add a match stage to filter by name
    if (name) {
      pipeline.push({
        $match: {
          "details.name": { $regex: name, $options: "i" },
        },
      });
    }else if (upid) {
      pipeline.push({
        $match: {
          "details.upid": { $regex: upid, $options: "i" },
        },
      });
    }

    // Add pagination stages
    pipeline.push({ $skip: skip }, { $limit: parseInt(limit) });

    // Execute the pipeline
    const inventoryItems = await Inventory.aggregate(pipeline);

    // Count total items for pagination metadata
    const totalItemsPipeline = [
      ...pipeline.slice(0, -2),
      { $count: "totalItems" },
    ];
    const totalItemsResult = await Inventory.aggregate(totalItemsPipeline);
    const totalItems = totalItemsResult[0]?.totalItems || 0;

    // Respond with data
    res.status(200).json({
      products: inventoryItems,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch inventory.", error: error.message });
  }
};

const getProductsGroupedByCategory = async (req, res) => {
  try {
    // Build the aggregation pipeline
    const pipeline = [
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
          products: {
            $push: {
              _id: "$_id",
              details: "$productDetails",
              quantity: "$quantity",
              purchaseRate: "$purchaseRate",
              sellingRate: "$sellingRate",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
            },
          },
        },
      },

      {
        $project: {
          category: "$_id",
          _id: 0,
          products: 1,
        },
      },
    ];

    // Execute the aggregation pipeline
    const groupedInventory = await Inventory.aggregate(pipeline);

    // Respond with grouped inventory
    res.status(200).json(groupedInventory);
  } catch (error) {
    console.error("Error fetching grouped inventory:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch grouped inventory.",
        error: error.message,
      });
  }
};

module.exports = { getProductsFromInventory, getProductsGroupedByCategory };
