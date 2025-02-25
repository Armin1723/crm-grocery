const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
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
        sellingRate: {
          type: Number,
        },
        purchaseRate: {
          type: Number,
        },
        mrp: {
          type: Number,
        },
        expiry: {
          type: Date,
        },
      },
    ],
    subTotal: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    paidAmount: {
      type: Number,
    },
    deficitAmount: {
      type: Number,
    },
    paymentMode: {
      type: String,
      enum: ["cash", "card", "upi"],
      required: true,
    },
    invoice: {
      type: String,
    },
    signedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    transactionId: {
      type: String,
    },
    notes: {
      type: String,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;
