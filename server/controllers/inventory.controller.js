const { mergeBatchesHelper } = require("../helpers");
const Inventory = require("../models/inventory.model");
const Product = require("../models/product.model");

const matchStage = {
  $match: {
    totalQuantity: { $gt: 0 },
  },
};

const getProductsFromInventory = async (req, res) => {
  const { name, barcode, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const pipeline = [
    matchStage,
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "details",
      },
    },
    { $unwind: { path: "$details", preserveNullAndEmptyArrays: true } },
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
    { $unwind: { path: "$batches", preserveNullAndEmptyArrays: true } },
    { $match: { totalQuantity: { $gt: 0 } } },
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
        barcodeInfo: "$details.barcodeInfo",
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
  const { page = 1, limit = 5, query = "", category } = req.query;
  const skip = (page - 1) * limit;
  const actualLimit = parseInt(limit);
  const extendedLimit = actualLimit + 1;

  const pipeline = [
    // Match products with positive quantity
    matchStage,

    // Lookup to populate product details (only fetch required fields)
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productDetails",
      },
    },

    // Project only required fields to reduce document size
    {
      $project: {
        productDetails: {
          category: 1,
          subCategory: 1,
          upid: 1,
          name: 1,
          tags: 1,
          description: 1,
        },
        totalQuantity: 1,
      },
    },

    // Unwind the productDetails array
    { $unwind: "$productDetails" },

    // Filter products based on the category if provided
    ...(category
      ? [
          {
            $match: {
              "productDetails.category": { $regex: category, $options: "i" },
            },
          },
        ]
      : []),

    // Filter products based on search query
    ...(query
      ? [
          {
            $match: {
              $or: [
                { "productDetails.name": { $regex: query, $options: "i" } },
                { "productDetails.category": { $regex: query, $options: "i" } },
                {
                  "productDetails.subCategory": {
                    $regex: query,
                    $options: "i",
                  },
                },
                {
                  "productDetails.description": {
                    $regex: query,
                    $options: "i",
                  },
                },
                { "productDetails.tags": { $regex: query, $options: "i" } },
              ],
            },
          },
        ]
      : []),

    // Group by product category and aggregate products
    {
      $group: {
        _id: "$productDetails.category",
        products: {
          $push: {
            upid: "$productDetails.upid",
          },
        },
      },
    },

    // Sort categories alphabetically
    { $sort: { _id: 1 } },

    // Pagination: Skip and limit results
    { $skip: skip },
    { $limit: extendedLimit },
  ];

  try {
    // Execute the aggregation pipeline
    const groupedInventory = await Inventory.aggregate(pipeline);

    // Check if there are more results
    const hasMore = groupedInventory.length > actualLimit;

    // Remove the extra document if present
    if (hasMore) {
      groupedInventory.pop();
    }

    // Send the response with grouped inventory and pagination info
    res.status(200).json({
      success: true,
      page: parseInt(page, 10),
      limit: actualLimit,
      hasMore,
      data: groupedInventory,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getExpiringInventory = async (req, res) => {
  const { page = 1, limit = 10, query = '', category, time = 'day'} = req.query;
  const skip = (page - 1) * limit;

  const getExpiryDateRange = (timePeriod) => {
    const now = new Date();
    switch (timePeriod) {
      case "day": 
        return {
          $gte: new Date(now.setHours(0, 0, 0, 0)),
          $lte: new Date(now.setHours(23, 59, 59, 999)),
        };
      case "week": 
        const endOfWeek = new Date(now.setDate(now.getDate() + (7 - now.getDay())));
        endOfWeek.setHours(23, 59, 59, 999);
        return { $gte: new Date(), $lte: endOfWeek };
      case "month":
        const nextMonth = new Date(now.setMonth(now.getMonth() + 1));
        nextMonth.setHours(23, 59, 59, 999);
        return { $gte: new Date(), $lte: nextMonth };
      case "year":
        const nextYear = new Date(now.setFullYear(now.getFullYear() + 1));
        nextYear.setHours(23, 59, 59, 999);
        return { $gte: new Date(), $lte: nextYear };
      default: 
        return null;
    }
  };

  const expiryDateRange = getExpiryDateRange(time);

  const pipeline = [
    matchStage,
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "details",
      },
    },
    { $unwind: "$details" },

    // Filter products based on expiry date
    ...(expiryDateRange ?
    [{
      $match: {
        "batches.expiry": expiryDateRange,
      },
    }]
    : []),
    
    // Filter products based on the category if provided
    ...(category
      ? [
          {
            $match: {
              "details.category": { $regex: category, $options: "i" },
            },
          },
        ]
      : []),
    
      // Filter products based on search query
    ...(query
      ? [
        {
          $match: {
            $or: [
              { "details.name": { $regex: query, $options: "i" } },
              { "details.category": { $regex: query, $options: "i" } },
              { "details.subCategory": { $regex: query, $options: "i" } },
              { "details.description": { $regex: query, $options: "i" } },
              { "details.tags": { $regex: query, $options: "i" } },
            ],
        }
      },
    ]
    : []),

    {
      $project: {
        upid: "$details.upid",
        category: "$details.category",
      },
    },
    { $skip: skip },
    { $limit: limit },
    { $sort: { expiry: 1 } },

    // Group by product category and aggregate products
    {
      $group: {
        _id: "$category",
        products: {
          $push: {
            upid: "$upid",
          },
        },
      },
    },
  ];

  const inventory = await Inventory.aggregate(pipeline);

  res.status(200).json({
    success: true,
    inventory,
  });
};

const getRates = async (req, res) => {
  const { upid } = req.params;

  const product = await Product.findOne({ upid })
    .select("_id secondaryUnit")
    .lean();
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  const inventory = await Inventory.findOne({ product: product._id })
    .select("batches")
    .lean();
  if (!inventory) {
    return res.status(404).json({
      success: false,
      message: "Product not found in inventory",
    });
  }
  inventory.batches.sort((a, b) => b.sellingRate - a.sellingRate);
  const highestSellingRate = inventory.batches[0].sellingRate;
  const MRP = inventory.batches[0].mrp;

  res.json({
    success: true,
    highestSellingRate,
    MRP,
  });
};

const editBatch = async (req, res) => {
  const { upid } = req.params;
  const { oldBatch, newBatch } = req.body;

  const product = await Product.findOne({ upid }).select("_id").lean();
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  const inventory = await Inventory.findOne({ product: product._id }).select(
    "batches"
  );

  const batchIndex = inventory.batches.findIndex(
    (batch) =>
      batch.sellingRate === oldBatch.sellingRate &&
      (batch.expiry && oldBatch.expiry
        ? new Date(batch.expiry).getTime() ===
          new Date(oldBatch.expiry).getTime()
        : true)
  );

  if (batchIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Batch not found",
    });
  } else {
    inventory.batches[batchIndex].sellingRate = newBatch.sellingRate;
    inventory.batches[batchIndex].expiry = newBatch.expiry;

    inventory.batches = await mergeBatchesHelper(inventory.batches);
    await inventory.save();
    res.json({
      success: true,
      message: "Batch updated successfully",
    });
  }
};

const mergeBatches = async (req, res) => {
  const { upid } = req.params;

  // Find the product by UPID
  const product = await Product.findOne({ upid }).select("_id").lean();
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Fetch inventory and batches
  const inventory = await Inventory.findOne({ product: product._id }).select(
    "batches"
  );
  if (!inventory || !inventory.batches || inventory.batches.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No batches found for this product",
    });
  }

  // Update the inventory with merged batches
  inventory.batches = await mergeBatchesHelper(inventory.batches);
  await inventory.save();

  return res.status(200).json({
    success: true,
    message: "Batches merged successfully",
    batches: inventory.batches,
  });
};

const hardMergeBatches = async (req, res) => {
  const { upid } = req.params;

  // Find the product by UPID
  const product = await Product.findOne({ upid }).select("_id").lean();

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Fetch inventory and batches
  const inventory = await Inventory.findOne({ product: product._id }).select(
    "batches"
  );

  const { batches } = inventory;

  if (batches.length > 2) {
    // Merge batches with same MRP, sellingRate, and compatible expiry
    const mergedBatches = [];
    const visited = new Set();

    for (let i = 0; i < batches.length; i++) {
      if (visited.has(i)) continue;

      const batch1 = batches[i];
      let mergedBatch = { ...batch1, quantity: Number(batch1.quantity) || 0 };
      visited.add(i);

      for (let j = i + 1; j < batches.length; j++) {
        if (visited.has(j)) continue;

        const batch2 = batches[j];

        // Check if MRP, sellingRate match, and expiry is compatible
        const canMerge =
          (!batch1.mrp || !batch2.mrp || batch1.mrp == batch2.mrp) &&
          batch1.sellingRate == batch2.sellingRate &&
          (!batch1.expiry ||
            !batch2.expiry ||
            batch1.expiry.getTime() == batch2.expiry.getTime());

        if (canMerge) {
          // Merge quantities and mark batch as visited
          mergedBatch.quantity += Number(batch2?.quantity) || 0;
          mergedBatch.expiry = mergedBatch.expiry || batch2.expiry;
          visited.add(j);
        }
      }

      mergedBatches.push(mergedBatch);
    }
    inventory.batches = mergedBatches;
    await inventory.save();
  }
};

module.exports = {
  getProductsFromInventory,
  getProductFromInventory,
  getProductsGroupedByCategory,
  getExpiringInventory,
  getRates,
  editBatch,
  mergeBatches,
  hardMergeBatches,
};
