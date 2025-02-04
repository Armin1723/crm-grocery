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
    location: {
      shelf: { type: String },
      row: { type: String },
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
    mrp: {
      type: Number,
    },
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
      quantity: { type: Number, default: 0 },
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ upid: 1 }, { unique: true });

//Pre save hook to generate upid code from process.env.INITIALS
productSchema.pre("save", async function (next) {
  const company = await mongoose.model("Company").findById(this.company).select("initials").lean();
  if (!this.upid) {
    const timestamp = Date.now().toString(36).slice(-3);
    const random = Math.random().toString(36).substr(2, 3);
    const counter = await this.constructor
      .countDocuments()
      .then((count) => count.toString(36).padStart(3, "0"));
    this.upid = (
      company?.initials +
      timestamp +
      random +
      counter
    ).toUpperCase();
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
