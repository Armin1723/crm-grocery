require("dotenv").config();

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    rate: {
      type: Number,
    },
    tax: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    primaryUnit: {
      type: String,
      required: true,
    },
    secondaryUnit: {
      type: String,
      required: true,
    },
    conversionFactor: {
      type: Number,
      required: true,
    },
    shelfLife: {
      type: Number,
    },
    image: {
      type: String,
    },
    upc: {
      type: String,
    },
    upid: {
      type: String,
    },
    barcodeInfo: {
      type: String,
    },
    stockAlert: {
      preference: { type: Boolean, default: false },
      quantity: { type: Number },
    },
  },
  { timestamps: true }
);

productSchema.index({upid: 1}, {unique: true});

//Pre save hook to generate upid code from process.env.INITIALS
productSchema.pre("save", async function (next) {
    if (!this.upid) {
        const timestamp = Date.now().toString(36).slice(-3); 
        const random = Math.random().toString(36).substr(2, 3); 
        const counter = await this.constructor
          .countDocuments()
          .then((count) => count.toString(36).padStart(3, "0")); 
        this.upid = (process.env.INITIALS + timestamp + random + counter).toUpperCase(); 
      }
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
