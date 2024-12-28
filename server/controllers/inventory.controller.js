const Inventory = require("../models/inventory.model");

const getProductsFromInventory = async (req, res) => {
    const { name, barcode, page = 1, limit = 10 } = req.query;
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
      { $match: { quantity: { $gt: 0 } } },
    ];

    // If a name query is provided, add a match stage to filter by name
    if (name) {
      pipeline.push({
        $match: {
          "details.name": { $regex: name, $options: "i" },
        },
      });
    } else if (barcode) {
      if (barcode.startsWith("BPG")) {
        pipeline.push({
          $match: {
            "details.upid": { $regex: barcode, $options: "i" },
          },
        });
      }
    } else {
      pipeline.push({
        $match: {
          "details.upc": { $regex: barcode, $options: "i" },
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
};

const getProductsGroupedByCategory = async (req, res) => {
  const pipeline = [
    // Unwind batches to access individual batch details
    { $unwind: "$batches" },
  
    // Lookup to populate product details
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
  
    // Unwind productDetails to access product fields
    { $unwind: "$productDetails" },
  
    // Group by product category
    {
      $group: {
        _id: "$productDetails.category",
        products: {
          $push: {
            _id: "$_id",
            productName: "$productDetails.name",
            quantity: "$batches.quantity",
            purchaseRate: "$batches.purchaseRate",
            sellingRate: "$batches.sellingRate",
            mrp: "$batches.mrp",
            expiry: "$batches.expiry",
            totalQuantity: "$totalQuantity",
            createdAt: "$createdAt",
            updatedAt: "$updatedAt",
          },
        },
      },
    },
  
    // Project the desired output
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
};

module.exports = { getProductsFromInventory, getProductsGroupedByCategory };
