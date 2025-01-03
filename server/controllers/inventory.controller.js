const Inventory = require("../models/inventory.model");
const Product = require("../models/product.model");

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
    { $unwind: { path : "$details", preserveNullAndEmptyArrays: true } },
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
    { $unwind: { path : "$batches", preserveNullAndEmptyArrays: true  }},
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
  const { page = 1, limit = 5, query = '' } = req.query;
  const skip = (page - 1) * limit;
  const actualLimit = parseInt(limit);
  const extendedLimit = actualLimit + 1;

  const pipeline = [
    // Match products with positive quantity
    { $match: { totalQuantity: { $gt: 0 } } },

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

    // Filter products based on search query
    ...(query
      ? [
          {
            $match: {
              $or: [
                { "productDetails.name": { $regex: query, $options: "i" } },
                { "productDetails.description": { $regex: query, $options: "i" } },
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

  const inventory = await Inventory.findOne({ product: product._id })
    .select("batches")

  const batchIndex = inventory.batches.findIndex(
    (batch) =>
      batch.sellingRate === oldBatch.sellingRate &&
      ((batch.expiry && oldBatch.expiry)
      ? new Date(batch.expiry).getTime() === new Date(oldBatch.expiry).getTime()
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
  const inventory = await Inventory.findOne({ product: product._id }).select("batches").lean();
  if (!inventory || !inventory.batches || inventory.batches.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No batches found for this product",
    });
  }

  let { batches } = inventory;

  // Merge batches with same MRP, sellingRate, and compatible expiry
  const mergedBatches = [];
  const visited = new Set();

  for (let i = 0; i < batches.length; i++) {
    if (visited.has(i)) continue;

    const batch1 = batches[i];
    let mergedBatch = { ...batch1 };
    visited.add(i);

    for (let j = i + 1; j < batches.length; j++) {
      if (visited.has(j)) continue;

      const batch2 = batches[j];

      // Check if MRP, sellingRate match, and expiry is compatible
      const canMerge =
        batch1.mrp == batch2.mrp &&
        batch1.sellingRate == batch2.sellingRate &&
        (!batch1.expiry || !batch2.expiry || batch1.expiry.getTime() == batch2.expiry.getTime());

      if (canMerge) {
        // Merge quantities and mark batch as visited
        mergedBatch.quantity = (mergedBatch.quantity || 0) + (batch2.quantity || 0);
        mergedBatch.purchaseRate = Math.max(mergedBatch.purchaseRate, batch2.purchaseRate);
        visited.add(j);
      }
    }

    mergedBatches.push(mergedBatch);
  }

  // Update the inventory with merged batches
  inventory.batches = mergedBatches;
  await Inventory.updateOne({ product: product._id }, { $set: { batches: mergedBatches } });

  return res.status(200).json({
    success: true,
    message: "Batches merged successfully",
    batches: mergedBatches,
  });
};

module.exports = {
  getProductsFromInventory,
  getProductFromInventory,
  getProductsGroupedByCategory,
  getRates,
  editBatch,
  mergeBatches,  
};
