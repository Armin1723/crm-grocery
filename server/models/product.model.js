const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    subCategory:{
        type: String,
    },
    tags: [
        {
            type: String,
        },
    ],
    rate:{
        type: Number,
    },
    tax:{
        type: Number,
    },
    discount:{
        type: Number,
    },
    unit:{
        type: String,
        required: true,
    },
    hsn:{
        type: String,
    },
    upid:{
        type: String,
    },
    stockAlert: {
        preference: { type: Boolean, default: false },
        quantity: { type: Number }
    },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;