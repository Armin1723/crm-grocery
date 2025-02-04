const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minLength: {
            value: 3,
            message: "Name must be at least 3 characters long",
        },
        maxLength: {
            value: 50,
            message: "Name must be at most 50 characters long",
        },
    },
    address: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    
}, { timestamps: true });

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;