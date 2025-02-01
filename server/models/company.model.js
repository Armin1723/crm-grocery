const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
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
    licenseKey: {
        type: String,
        unique: true
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

