const Inventory = require("../models/inventory.model");

const getProductsFromInventory = async (req, res) => {
  const { name, barcode, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

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
  ];

  // Initialize the query for matching name and barcode
  if (name) {
    pipeline.push({
      $match: {
        "details.name": { $regex: name, $options: "i" },
      },
    });
  }

  if (barcode) {
    if (!barcode.startsWith("BPG")) {
      pipeline.push({
        $match: {
          "details.upc": { $regex: barcode, $options: "i" },
        },
      });
    } else {
      pipeline.push({
        $match: {
          "details.upid": { $regex: barcode, $options: "i" },
        },
      });
    }
  }

  pipeline.push(
    { $unwind: "$batches" },
    {
      $project: {
        product: 1,
        name: "$details.name",
        upc: "$details.upc",
        upid: "$details.upid",
        tax: "$details.tax",
        category: "$details.category",
        primaryUnit: "$details.primaryUnit",
        secondaryUnit: "$details.secondaryUnit",
        conversionFactor: "$details.conversionFactor",
        purchaseRate: "$batches.purchaseRate",
        sellingRate: "$batches.sellingRate",
        mrp: "$batches.mrp",
        expiry: "$batches.expiry",
        maxQuantity: "$batches.quantity",
      },
    },
    { $skip: skip },
    { $limit: limit }
  );

  // Get the products data using the aggregation pipeline
  const products = await Inventory.aggregate(pipeline);

  // Aggregate pipeline for total count, without $skip and $limit
  const totalPipeline = [...pipeline.slice(0, -2), { $count: "total" }];

  // Get total product count
  const totalProducts = await Inventory.aggregate(totalPipeline);

  // Get the total count or fallback to 0 if no result
  const total = totalProducts.length > 0 ? totalProducts[0].total : 0;

  // Return the response
  res.json({
    success: true,
    products,
    totalPages: Math.ceil(total / limit) || 1,
    page,
    totalProducts: total,
  });
};

const getProductFromInventory = async (req, res) => {
  const { upid } = req.params;

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
    {
      $match: {
        "details.upid": upid,
      },
    },
    {
      $project: {
        product: 1,
        name: "$details.name",
        upc: "$details.upc",
        upid: "$details.upid",
        tax: "$details.tax",
        image: "$details.image",
        category: "$details.category",
        subCategory: "$details.subCategory",
        primaryUnit: "$details.primaryUnit",
        secondaryUnit: "$details.secondaryUnit",
        conversionFactor: "$details.conversionFactor",
        batches: 1,
        totalQuantity: 1,
      },
    },
  ];

  const product = await Inventory.aggregate(pipeline);

  res.json({
    success: true,
    product: product[0],
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

module.exports = {
  getProductsFromInventory,
  getProductFromInventory,
  getProductsGroupedByCategory,
};
