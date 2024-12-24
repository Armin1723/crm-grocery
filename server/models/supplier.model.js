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
    },
    phone: {
        type: String,
        required: true,
        unique: true,
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
    
}, { timestamps: true });

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;