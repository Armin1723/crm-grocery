require("dotenv").config();
const Product = require("../models/product.model");
const Sale = require('../models/sale.model'); 

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const addProduct = async (req, res) => {
  try {
    const { hsn, name } = req.body;
    if (hsn) {
      const existingProduct = await Product.findOne({ hsn });
      if (existingProduct) {
        return res.status(400).json({
          message: "Product with this HSN already exists",
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

    const generateUPID = async () => {
      let upid =
        process.env.INITIALS +
        Math.random().toString(36).substr(2, 6).toUpperCase();
      const existingProduct = await Product.findOne({ upid });
      if (existingProduct) {
        return generateUPID();
      } else {
        return upid;
      }
    };

    product.upid = await generateUPID();

    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getProducts = async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      category = { $exists: true },
      sort = "createdAt",
      sortType = "desc",
    } = req.query;
    const products = await Product.find({ category })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ [sort]: sortType });

    const totalProducts = await Product.countDocuments({ category });
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({ success: true, products, page, totalProducts, totalPages });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getTrendingProducts = async (req, res) => {
  try {
    const trendingProducts = await Sale.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product", // Group by product ID
          totalSales: { $sum: "$products.quantity" }, // Calculate total quantity sold
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
    ]);

    // Populate product details
    const populatedTrendingProducts = await Product.populate(trendingProducts, {
      path: "_id",
      select: "name category", // Select fields to simplify response
    });

    // Flatten the response structure
    const formattedProducts = populatedTrendingProducts.map((item) => ({
      product: item._id, // Rename '_id' to 'product'
      totalSales: item.totalSales,
    }));

    res.status(200).json({ success: true, trendingProducts: formattedProducts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch trending products", error: err.message });
  }
};

const searchProduct = async (req, res) => {
  try {
    const { query, limit = 10, page = 1 } = req.query;
    if (query.startsWith("BPG")) {
      const product = await Product.findOne({ upid: query });
      if (product) {
        return res.json({ success: true, products: product });
      }
      return res.json({ success: false, message: "Product not found" });
    } else if (query.length == 8) {
      const product = await Product.findOne({ hsn: query });
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
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const setStockPreference = async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    product.stockAlert.preference = !product.stockAlert.preference;
    product.stockAlert.quantity = product.stockAlert.preference ? quantity : undefined;

    await product.save();
    res.json({ success: true, product, message: "Stock preference updated" });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const editProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
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
};
