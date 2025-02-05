const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");
const validator = require("validator");

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        set: (value) => sanitizeHtml(value),
    },
    address: {
        type: String,
        trim: true,
        set: (value) => sanitizeHtml(value),
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: {
        type: String,
        required: true,
        validate: [validator.isMobilePhone, "Please provide a valid phone"],
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true,
    },
    
}, { timestamps: true });

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;