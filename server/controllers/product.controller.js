require("dotenv").config();
const Product = require("../models/product.model");
const Sale = require("../models/sale.model");
const { sendMail } = require("../helpers");
const cloudinary = require("../config/cloudinary");
const Purchase = require("../models/purchase.model");

const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json({ success: true, product });
};

const addProduct = async (req, res) => {
  const { upc, name } = req.body;
  if (upc) {
    const existingProduct = await Product.findOne({ upc });
    if (existingProduct) {
      return res.status(400).json({
        message: "Product with this upc already exists",
        success: false,
      });
    }
  }
  const existingProduct = await Product.findOne({ name });
  if (existingProduct) {
    return res.status(400).json({
      message: "Product with this name already exists",
      success: false,
    });
  }

  const product = await Product.create(req.body);

  // Upload image to cloudinary
  if (req.files) {
    const { image } = req.files;
    if (image) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          image[0].path,
          { folder: "Product_images" }
        );
        if (!cloudinaryResponse || cloudinaryResponse.error) {
          return res.status(500).json({
            success: false,
            message: "Failed to upload product image to cloud.",
            error: cloudinaryResponse.error,
          });
        }
        product.image = cloudinaryResponse.secure_url;
        await product.save();
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload product image to cloud.",
          error: error.message,
        });
      }
    }
  }

  // const generateUPID = async () => {
  //   let upid =
  //     process.env.INITIALS +
  //     Math.random().toString(36).substr(2, 6).toUpperCase();
  //   const existingProduct = await Product.findOne({ upid });
  //   if (existingProduct) {
  //     return generateUPID();
  //   } else {
  //     return upid;
  //   }
  // };

  // product.upid = await generateUPID();
  res.json({ success: true, product });
};

const getProducts = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    category,
    sort = "createdAt",
    sortType = "desc",
    name,
    query,
  } = req.query;

  if (name) {
    const products = await Product.find({
      name: { $regex: `${name}`, $options: "i" },
    }).limit(5);
    return res.json({ success: true, products });
  }

  let filter = {};
  if (category) {
    filter.category = { $regex: category, $options: "i" };
  }
  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { tags: { $elemMatch: { $regex: query, $options: "i" } } },
    ];
  }

  const products = await Product.find(filter)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ [sort]: sortType });

  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / limit);

  res.json({ success: true, products, page, totalProducts, totalPages });
};

const getTrendingProducts = async (req, res) => {
  const trendingProducts = await Sale.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.product",
        totalSales: { $sum: "$products.quantity" },
      },
    },
    { $sort: { totalSales: -1 } },
    { $limit: 5 },
  ]);

  // Populate product details
  const populatedTrendingProducts = await Product.populate(trendingProducts, {
    path: "_id",
    select: "name category",
  });

  // Flatten the response structure
  const formattedProducts = populatedTrendingProducts.map((item) => ({
    product: item._id, // Rename '_id' to 'product'
    totalSales: item.totalSales,
  }));

  res.status(200).json({ success: true, trendingProducts: formattedProducts });
};

const searchProduct = async (req, res) => {
  const { query, limit = 10, page = 1 } = req.query;
  if (query.startsWith(process.env.INITIALS)) {
    const product = await Product.findOne({ upid: query });
    if (product) {
      return res.json({ success: true, products: product });
    }
    return res.json({ success: false, message: "Product not found" });
  } else if (query.length == 12) {
    const product = await Product.findOne({ upc: query });
    if (product) {
      return res.json({ success: true, products: product });
    }
  }
  const products = await Product.find({
    name: { $regex: query, $options: "i" },
  })
    .limit(limit)
    .skip((page - 1) * limit);

  const totalProducts = await Product.countDocuments({
    name: { $regex: query, $options: "i" },
  });
  const totalPages = Math.ceil(totalProducts / limit);

  res.json({ success: true, products, page, totalProducts, totalPages });
};

const setStockPreference = async (req, res) => {
  const { quantity } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(404)
      .json({ message: "Product not found", success: false });
  }

  product.stockAlert.preference = !product.stockAlert.preference;
  product.stockAlert.quantity = product.stockAlert.preference
    ? quantity
    : undefined;

  if (product.stockAlert.preference) {
    sendMail(
      (to = process.env.ADMIN_EMAIL),
      (subject = "Stock Alert Set"),
      (text = `Stock alert set for ${product.name}. You will be notified when the stock reaches ${quantity} ${product.unit}`)
    );
  }

  await product.save();
  res.json({ success: true, product, message: "Stock preference updated" });
};

const editProduct = async (req, res) => {
  let updateData = { ...req.body };
  if (req.files) {
    const { image } = req.files;
    if (image) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          image[0].path,
          { folder: "Product_images" }
        );
        if (!cloudinaryResponse || cloudinaryResponse.error) {
          return res.status(500).json({
            success: false,
            message: "Failed to upload product image to cloud.",
            error: cloudinaryResponse.error,
          });
        }
        updateData.image = cloudinaryResponse.secure_url;
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload product image to cloud.",
          error: error.message,
        });
      }
    }
  }

  const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
  });
  res.json({ success: true, product, message: "Product updated successfully" });
};

const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Product deleted successfully" });
};

const autoSetRate = async (req, res) => {
  // Use aggregation to find the highest purchase rate for the product
  const result = await Purchase.aggregate([
    {
      // Match purchases that have the product in their products array
      $match: {
        "products.product": req.params.id,
      },
    },
    {
      // Project the purchase rate for the specific product in the products array
      $project: {
        purchaseRate: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$products",
                as: "product",
                cond: { $eq: ["$$product.product", req.params.id] },
              },
            },
            0,
          ],
        },
      },
    },
    {
      // Unwind the products array to get individual purchase records
      $unwind: "$purchaseRate",
    },
    {
      // Sort by purchase rate in descending order to find the highest
      $sort: { "purchaseRate.purchaseRate": -1 },
    },
    {
      // Limit to the top 1 record to get the highest purchase rate
      $limit: 1,
    },
  ]);

  // If no purchase records are found for the product
  if (result.length === 0) {
    res.status(404).json({
      success: false,
      message: "No purchase records found for the product",
    });
  } else {
    const highestPurchaseRate = result[0].purchaseRate.purchaseRate;

    // Calculate the new rate (10% more)
    const newPurchaseRate = highestPurchaseRate * 1.1;

    await Product.findByIdAndUpdate(
      req.params.id,
      { rate: newPurchaseRate },
      { new: true }
    );
    // You can update the product or perform any other action here
    res.status(200).json({
      success: true,
      message: "Rate set successfully",
    });
  }
};

module.exports = {
  getProduct,
  getProducts,
  getTrendingProducts,
  addProduct,
  setStockPreference,
  searchProduct,
  editProduct,
  deleteProduct,
  autoSetRate,
};
