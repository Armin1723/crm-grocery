require("dotenv").config();
const Product = require("../models/product.model");
const Sale = require("../models/sale.model");
const { sendMail } = require("../helpers");
const cloudinary = require("../config/cloudinary");
const Purchase = require("../models/purchase.model");
const mongoose = require("mongoose");
const stockAlertMailTemplate = require("../templates/email/stockAlertMailTemplate");
const Company = require("../models/company.model");
const Inventory = require("../models/inventory.model");

const getProduct = async (req, res) => {
  const product = await Product.findOne({
    upid: req.params.id,
    company: req.user.company,
  });
  res.json({ success: true, product });
};

const addProduct = async (req, res) => {
  const { upc, name } = req.body;
  const query = {
    company: req.user.company,
    $or: [],
  };

  if (upc) {
    query.$or.push({ upc });
  }

  if (name) {
    query.$or.push({ name });
  }

  if (query.$or.length > 0) {
    const existingProduct = await Product.findOne(query);
    if (existingProduct) {
      let message = "Product already exists";

      if (upc && name) {
        message = "Product with this upc or name already exists";
      } else if (upc) {
        message = "Product with this upc already exists";
      } else if (name) {
        message = "Product with this name already exists";
      }

      return res.status(400).json({
        message,
        success: false,
      });
    }
  }

  const product = await Product.create({
    ...req.body,
    company: req.user.company,
  });

  // Upload image to cloudinary
  if (req.files) {
    const { image } = req.files;
    const company = await Company.findById(req.user.company)
      .select("licenseKey")
      .lean();
    if (image) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          image[0].path,
          { folder: `${company?.licenseKey}/products` }
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
      company: req.user.company,
      name: { $regex: name, $options: "i" },
    })
      .limit(5)
      .lean();

    return res.json({ success: true, products });
  }

  let filter = { company: req.user.company };
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
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
        company: new mongoose.Types.ObjectId(req.user.company),
      },
    },
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
    select: "name category secondaryUnit",
  });

  // Flatten the response structure
  const formattedProducts = populatedTrendingProducts.map((item) => ({
    product: item._id, // Rename '_id' to 'product'
    totalSales: item.totalSales,
    secondaryUnit: item._id.secondaryUnit,
  }));

  res.status(200).json({ success: true, trendingProducts: formattedProducts });
};

const searchProduct = async (req, res) => {
  const { query, limit = 10, page = 1 } = req.query;
  const company = await Company.findById(req.user.company);

  if (query.startsWith(company?.initials)) {
    const product = await Product.findOne({
      upid: query,
      company: req.user.company,
    });
    if (product) {
      return res.json({ success: true, products: product });
    }
    return res.json({ success: false, message: "Product not found" });
  } else if (query.length == 12) {
    const product = await Product.findOne({
      upc: query,
      company: req.user.company,
    });
    if (product) {
      return res.json({ success: true, products: product });
    }
  }
  const products = await Product.find({
    name: { $regex: query, $options: "i" },
    company: req.user.company,
  })
    .limit(limit)
    .skip((page - 1) * limit);

  const totalProducts = await Product.countDocuments({
    name: { $regex: query, $options: "i" },
    company: req.user.company,
  });
  const totalPages = Math.ceil(totalProducts / limit);

  res.json({ success: true, products, page, totalProducts, totalPages });
};

const productPurchases = async (req, res) => {
  const { limit = 5, page = 1 } = req.query;
  const { id } = req.params;

  const product = await Product.findOne({ upid: id, company: req.user.company })
    .select("_id secondaryUnit")
    .lean();
  if (!product) {
    return res.json({ success: false, message: "Product not found" });
  }

  const purchases = await Purchase.aggregate([
    { $match: { company: new mongoose.Types.ObjectId(req.user.company) } },
    { $unwind: "$products" },
    {
      $match: {
        "products.product": product._id,
      },
    },
    {
      $lookup: {
        from: "suppliers",
        localField: "supplier",
        foreignField: "_id",
        as: "supplier",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "signedBy",
        foreignField: "_id",
        as: "signedBy",
      },
    },
    {
      $project: {
        _id: 0,
        purchaseRate: "$products.purchaseRate",
        quantity: "$products.quantity",
        secondaryUnit: product.secondaryUnit,
        totalAmount: "$products.totalAmount",
        createdAt: 1,
        supplier: { $arrayElemAt: ["$supplier", 0] },
        signedBy: { $arrayElemAt: ["$signedBy", 0] },
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * parseInt(limit) },
    { $limit: parseInt(limit) },
  ]);

  const totalPurchases = await Purchase.aggregate([
    { $match: { company: new mongoose.Types.ObjectId(req.user.company) } },
    { $unwind: "$products" },
    {
      $match: {
        "products.product": product._id,
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
      },
    },
  ]);

  const totalResults = totalPurchases[0]?.total || 0;
  const totalPages = Math.ceil(totalResults / parseInt(limit)) || 1;
  const hasMore = totalResults > page * parseInt(limit);
  res.json({
    success: true,
    purchases,
    page,
    totalResults,
    totalPages,
    hasMore,
  });
};

const productSales = async (req, res) => {
  const { limit = 5, page = 1 } = req.query;
  const { id } = req.params;

  const product = await Product.findOne({ upid: id, company: req.user.company })
    .select("_id secondaryUnit")
    .lean();
  if (!product) {
    return res.json({ success: false, message: "Product not found" });
  }

  const sales = await Sale.aggregate([
    { $match: { company: new mongoose.Types.ObjectId(req.user.company) } },
    { $unwind: "$products" },
    {
      $match: {
        "products.product": product._id,
      },
    },
    {
      $lookup: {
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "signedBy",
        foreignField: "_id",
        as: "signedBy",
      },
    },
    {
      $project: {
        _id: 0,
        sellingRate: "$products.sellingRate",
        quantity: "$products.quantity",
        secondaryUnit: product.secondaryUnit,
        totalAmount: "$products.totalAmount",
        createdAt: 1,
        customer: { $arrayElemAt: ["$customer", 0] },
        signedBy: { $arrayElemAt: ["$signedBy", 0] },
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * parseInt(limit) },
    { $limit: parseInt(limit) },
  ]);

  const totalSales = await Sale.aggregate([
    { $match: { company: new mongoose.Types.ObjectId(req.user.company) } },
    { $unwind: "$products" },
    {
      $match: {
        "products.product": product._id,
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
      },
    },
  ]);

  const totalResults = totalSales[0]?.total || 0;
  const totalPages = Math.ceil(totalResults / parseInt(limit)) || 1;
  const hasMore = totalResults > page * parseInt(limit);
  res.json({
    success: true,
    sales,
    page,
    totalResults,
    totalPages,
    hasMore,
  });
};

const setStockPreference = async (req, res) => {
  const { quantity } = req.body;
  const product = await Product.findOne({
    _id: req.params.id,
    company: req.user.company,
  }).populate("company");
  if (!product) {
    return res
      .status(404)
      .json({ message: "Product not found", success: false });
  }

  product.stockAlert.preference = !product.stockAlert.preference;
  product.stockAlert.quantity = product.stockAlert.preference
    ? quantity
    : undefined;

  await product.save();
  res.json({ success: true, product, message: "Stock preference updated" });

  // Send email to company admin if stock alert is set (in background)
  process.nextTick(async () => {
    const company = await Company.findOne({ admin: req.user.id })
      .select("email")
      .lean();
    if (product.stockAlert.preference && company.email) {
      await sendMail(
        (to = company.email),
        (subject = "Stock Alert Set"),
        (message = stockAlertMailTemplate(product, product.company))
      );
    }
  });
};

const editProduct = async (req, res) => {
  let updateData = { ...req.body };

  //Check if units are updated and inventory exists
  if (
    updateData.primaryUnit ||
    updateData.secondaryUnit ||
    updateData.conversionFactor
  ) {
    const inventory = await Inventory.findOne({
      product: req.params.id,
      company: req.user.company,
    });
    if (inventory && inventory.totalQuantity > 0) {
      return res.status(400).json({
        success: false,
        message: "Product units cannot be updated as inventory exists",
      });
    }
  }

  if (req.files) {
    const { image } = req.files;
    if (image) {
      try {
        const company = await Company.findById(req.user.company)
          .select("licenseKey")
          .lean();
        const cloudinaryResponse = await cloudinary.uploader.upload(
          image[0].path,
          { folder: `${company?.licenseKey}/products` }
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
  try {
    // Use aggregation to find the highest purchase rate for the product
    const result = await Purchase.aggregate([
      // Match purchases for the company
      { $match: { company: new mongoose.Types.ObjectId(req.user.company) } },
      // Unwind the products array to access individual product entries
      { $unwind: "$products" },

      // Match the specific product ID in the products array
      {
        $match: {
          "products.product": new mongoose.Types.ObjectId(req.params.id),
        },
      },

      // Project only the purchase rate for the matched product
      {
        $project: {
          purchaseRate: "$products.purchaseRate",
        },
      },

      // Sort by purchase rate in descending order to get the highest
      { $sort: { purchaseRate: -1 } },

      // Limit to the top 1 record
      { $limit: 1 },
    ]);

    // If no purchase records are found for the product
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No purchase records found for the product",
      });
    }

    // Extract the highest purchase rate
    const highestPurchaseRate = result[0].purchaseRate;

    // Calculate the new rate (10% more)
    const newPurchaseRate = highestPurchaseRate * 1.1;

    // Update the product with the new rate
    await Product.findByIdAndUpdate(
      req.params.id,
      { rate: Math.floor(newPurchaseRate) },
      { new: true }
    );

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Rate set successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while setting the rate",
      error: error.message,
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
  productPurchases,
  productSales,
};
