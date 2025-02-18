const Lead = require("../models/lead.model");
const User = require("../models/user.model");

const getLeads = async (req, res) => {
  const { page = 1, limit = 10, status = { $ne: "converted" }, sort = "createdAt", sortType = "desc" } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  const leads = await Lead.find(query)
    .populate("assignedTo", "name email")
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ [sort]: sortType });

  const totalResults = await Lead.countDocuments(query);

  const totalPages = Math.ceil(totalResults / limit);

  res.status(200).json({
    success: true,
    leads,
    page,
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

const addLead = async (req, res, next, io) => {
  const { phone, email, assignedTo } = req.body;

  if (!phone || !email) {
    return res.status(400).json({
      success: false,
      message: "Phone or email is required",
    });
  }

  let lead;

  const timeline = [
    {
      description: "Lead Added",
      on: new Date(),
    },
  ];

  if (assignedTo) {
    lead = new Lead({ ...req.body, assignedTo, timeline });
  } else {
    // Implement round robin assignment in future
    const assigned = await User.findOne();
    lead = new Lead({ ...req.body, assignedTo: assigned._id, timeline });
  }

  await lead.save();
  io.emit("new-lead", lead);

  res.status(201).json({
    success: true,
    lead,
  });
};

const editLead = async (req, res) => {
  const { id } = req.params;
  const lead = await Lead.findByIdAndUpdate(id, req.body);

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

const changeStatus = async (req, res, next, io) => {
  const { id } = req.params;
  const { status } = req.body;

  const lead = await Lead.findById(id);

  if (!lead) {
    return res.status(404).json({
      success: false,
      message: "Lead not found",
    });
  }
  lead.status = status;
  lead.timeline.push({
    description: `Lead status changed to ${status}`,
    on: new Date(),
  });
  await lead.save();

  io.emit("status-change", lead);
  res.status(200).json({
    success: true,
    lead,
  });

};

module.exports = {
  getLeads,
  getLead,
  addLead,
  editLead,
  deleteLead,
  changeStatus,
};
