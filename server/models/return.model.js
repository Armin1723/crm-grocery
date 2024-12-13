const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["Purchase", "Sale"],
    },
    products: [
      {
        product: {
          type: mongoosee.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
        },
        rate: {
          type: Number,
        },
        tax: {
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
    otherCharges: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    signedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    participantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
  },
  { timestamps: true }
);

const Return = mongoose.model("Return", returnSchema);

module.exports = Return;