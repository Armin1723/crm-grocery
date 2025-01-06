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
    paidAmount: {
      type: Number,
    },
    signedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
  },
  { timestamps: true }
);

const PurchaseReturn = mongoose.model("PurchaseReturn", purchaseReturnSchema);

module.exports = PurchaseReturn;