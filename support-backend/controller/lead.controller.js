const Lead = require("../models/lead.model");
const User = require("../models/user.model");

const getLeads = async (req, res) => {

    const { page = 1, limit = 10, status } = req.query;

    const query = {};

    if (status) {
        query.status = status;
    }

    const leads = await Lead.find(query)
        .limit(limit)
        .skip((page - 1) * limit);

    const totalResults = await Lead.countDocuments(query);

    const totalPages = Math.ceil(totalResults / limit);

    res.status(200).json({
        success: true,
        leads,
        totalResults,
        totalPages,
    });
};

const getLead = async (req, res) => {
    const { id } = req.params;
    const lead = await Lead.findById(id).populate("assignedTo");

    if (!lead) {
        return res.status(404).json({
            success: false,
            message: "Lead not found",
        });
    }

    res.status(200).json({
        success: true,
        lead,
    });
};

const addLead = async (req, res) => {

    const {phone, email, assignedTo } = req.body;

    if (!phone || !email) {
        return res.status(400).json({
            success: false,
            message: "Phone or email is required",
        });
    }

    let lead;

    if(assignedTo) {
        lead = new Lead({...req.body, assignedTo});
    } else {
        // Implement round robin assignment in future
        const assigned = await User.findOne();
        lead = new Lead({...req.body, assignedTo: assigned._id});
    }

    await lead.save();

    res.status(201).json({
        success: true,
        lead,
    });
};

const editLead = async (req, res) => {
    const { id } = req.params;
    const lead = await Lead.findByIdAndUpdate(id, req.body, { new: true });

    if (!lead) {
        return res.status(404).json({
            success: false,
            message: "Lead not found",
        });
    }

    res.status(200).json({
        success: true,
        lead,
    });

};

const deleteLead = async (req, res) => {
    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
        return res.status(404).json({
            success: false,
            message: "Lead not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Lead deleted successfully",
    });
};

module.exports = {
    getLeads,
    getLead,
    addLead,
    editLead,
    deleteLead,
};