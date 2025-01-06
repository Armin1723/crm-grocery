const mongoose = require("mongoose");

const salesReturnSchema = new mongoose.Schema(
  {
    reason: {
      type: String,
      required: true,
    },
    saleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale",
    },
    products: [
      { 
        expiry:{
          type: Date,
        },
        mrp:{
          type: Number,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
        },
        sellingRate: {
          type: Number,
        },
      },
    ],
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    subTotal: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    otherCharges: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    invoice: {
      type: String,
    },
    signedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const SalesReturn = mongoose.model("SalesReturn", salesReturnSchema);

module.exports = SalesReturn;