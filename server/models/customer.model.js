const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
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
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    
}, { timestamps: true });

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;