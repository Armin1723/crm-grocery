const mongoose = require("mongoose");

const purchaseReturnSchema = new mongoose.Schema(
  {
    reason: {
      type: String,
      required: true,
    },
    purchaseId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
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
        purchaseRate: {
          type: Number,
        },
      },
    ],
    subTotal: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    signedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    invoice: {
      type: String,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

const PurchaseReturn = mongoose.model("PurchaseReturn", purchaseReturnSchema);

module.exports = PurchaseReturn;