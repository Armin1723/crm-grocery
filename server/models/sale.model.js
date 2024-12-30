const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
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
    otherCharges: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    totalAmount: {
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
    signedBy :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    transactionId: {
        type: String,
    },
    notes: {
        type: String,
    },
}, { timestamps: true });

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;