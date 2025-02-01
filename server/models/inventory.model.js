const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    totalQuantity: {
      type: Number,
    },
    batches: [
      {
        quantity: {
          type: Number,
        },
        purchaseRate: {
          type: Number,
        },
        createdAt: {
          type: Date,
        },
        sellingRate: {
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
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
