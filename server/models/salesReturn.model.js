const mongoose = require("mongoose");

const salesReturnSchema = new mongoose.Schema(
  {
    reason: {
      type: String,
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
        },
        rate: {
          type: Number,
        },
      },
    ],
    transactionId: {
      type: Number,
    },
    subTotal: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    paidAmount: {
      type: Number,
    },
    signedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
  },
  { timestamps: true }
);

const SalesReturn = mongoose.model("SalesReturn", salesReturnSchema);

module.exports = SalesReturn;