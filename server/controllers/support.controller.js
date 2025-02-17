const Company = require("../models/company.model");
const User = require("../models/user.model");
const { loadSubscriptionsToCache } = require("../helpers/subscriptionCache");

const getClients = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const clients = await User.find({ role: "admin" })
    .populate("company", "subscription name phone")
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({
      [sort]: sortType,
    });

  const totalResults = await User.countDocuments({ role: "admin" });

  const totalPages = Math.ceil(totalResults / limit);

  res.status(200).json({
    success: true,
    clients,
    totalResults,
    totalPages,
  });
};

const getClientById = async (req, res) => {
  const { id } = req.params;

  const client = await User.findById(id).populate("company");

  if (!client) {
    return res.status(404).json({
      success: false,
      message: "Client not found",
    });
  }

  res.status(200).json({
    success: true,
    client,
  });
};

const getLeadsCompany = async (req, res) => {
  const { phone } = req.params;

  const company = await Company.findOne({ phone });

  if (!company) {
    return res.status(404).json({
      success: false,
      message: "Company not found",
      company: {},
    });
  }

  res.status(200).json({
    success: true,
    company,
  });
};

const activateClient = async (req, res) => {
  const { id } = req.params;

  const { subscriptionEndDate, subscription } = req.body;

  const clientCompany = await Company.findOne({
    admin: id,
  });

  if (!clientCompany) {
    return res.status(404).json({
      success: false,
      message: "Client not found",
    });
  }

  // Activate client
  clientCompany.subscription = subscription;
  clientCompany.subscriptionStartDate = new Date();
  clientCompany.subscriptionEndDate = new Date(subscriptionEndDate);
  await clientCompany.save();

  // Reload subscriptions cache
  loadSubscriptionsToCache();

  res.status(200).json({
    success: true,
    message: "Client activated",
  });
};

const deactivateClient = async (req, res) => {
  const { id } = req.params;

  const clientCompany = await Company.findOne({
    admin: id,
  });

  if (!clientCompany) {
    return res.status(404).json({
      success: false,
      message: "Client not found",
    });
  }

  // Deactivate client
  clientCompany.subscription = null;
  clientCompany.subscriptionStartDate = null;
  clientCompany.subscriptionEndDate = null;
  await clientCompany.save();

  res.status(200).json({
    success: true,
    message: "Client deactivated",
  });
};

module.exports = {
  getClients,
  getClientById,
  getLeadsCompany,
  activateClient,
  deactivateClient,
};
