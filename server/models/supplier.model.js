const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
    },
    gstin: {
        type: String,
    },
    pan: {
        type: String,
    },
    balance: {
        type: Number,
        default: 0,
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
}, { timestamps: true });

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;