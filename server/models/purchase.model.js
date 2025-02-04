const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    products: [
      {
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
        expiry: {
          type: Date,
        },
        mrp: {
          type: Number,
        },
      },
    ],
    followUpPayments: [{
      paidAmount: {
        type: Number,
      },
      createdAt: {
        type: Date,
      },
      notes: {
        type: String,
      },
    }],
    subTotal: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    otherCharges: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    paidAmount:{
      type: Number,
    },
    deficitAmount:{
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
    invoice: {
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

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
