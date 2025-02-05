const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");
const validator = require("validator");

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        set: (value) => sanitizeHtml(value),
    },
    address: {
        type: String,
        set: (value) => sanitizeHtml(value),
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: {
        type: String,
        required: true,
        validate: [validator.isMobilePhone, "Please provide a valid phone"],
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
        trim: true,
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