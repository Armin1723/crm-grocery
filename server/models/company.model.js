const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');
const validator = require('validator');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        set: (value) => sanitizeHtml(value),
    },
    address: {
        type: String,
        required: true,
        set: (value) => sanitizeHtml(value),
    },
    branch: {
        type: String,
        required: true,
        set: (value) => sanitizeHtml(value),
    },
    phone: {
        type: String,
        required: true,
        validate: [validator.isMobilePhone, "Please provide a valid phone"],
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please provide a valid email"],  
    },
    gstin: {
        type: String,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    initials: {
        type: String,
        unique: true,
        required: true
    },
    logo: {
        type: String,
    },
    tnc: {
        type: String,
    },
    licenseKey: {
        type: String,
        unique: true,
        select: false
    },
    subscription: {
        type: String,
    },
    subscriptionStartDate: {
        type: Date,
        required: true
    },
    subscriptionEndDate: {
        type: Date,
        required: true
    },
}, {
    timestamps: true
});

companySchema.index({ licenseKey: 1 }, { unique: true });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;

