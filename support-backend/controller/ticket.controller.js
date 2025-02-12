const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");

const getTickets = async (req, res) => {
  const {
    sort = "createdAt",
    sortType = "desc",
    status,
    page = 1,
    limit = 10,
  } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  const tickets = await Ticket.find(query)
    .sort({ [sort]: sortType })
    .limit(limit)
    .skip((page - 1) * limit);

  const totalResults = await Ticket.countDocuments(query);

  const totalPages = Math.ceil(totalResults / limit);

  res.status(200).json({
    success: true,
    data: {
      tickets,
      totalResults,
      totalPages,
    },
  });
};

const getTicket = async (req, res) => {
  const { id } = req.params;

  const ticket = await Ticket.findById(id).populate("assignedTo");

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: "Ticket not found",
    });
  }

  const response = await fetch(
    `${process.env.CRM_BACKEND_URL}/api/v1/employees/${ticket.createdBy._id}`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  ticket.createdBy = data.data;

  res.status(200).json({
    success: true,
    data: ticket,
  });
};

const createTicket = async (req, res) => {
  const { description, createdBy } = req.body;

  if (!description || !createdBy) {
    return res.status(400).json({
      success: false,
      message: "Please provide description",
    });
  }

  //TODO: Implement round robin in the future
  const assignedTo = await User.findOne().select("_id").lean();

  const ticket = await Ticket.create({
    ...req.body,
    assignedTo: assignedTo._id,
  });

  res.status(201).json({
    success: true,
    data: ticket,
  });
};

const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { status = "new" } = req.body;

  const ticket = await Ticket.findByIdAndUpdate(id, req.body, {
    status,
    new: true,
    runValidators: true,
  });

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: "Ticket not found",
    });
  }

  res.status(200).json({
    success: true,
    data: ticket,
  });
};

const sendResponse = async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;

  const ticket = await Ticket.findByIdAndUpdate(
    id,
    { response, status: "closed" },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: "Ticket not found",
    });
  }

  res.status(200).json({
    success: true,
    data: ticket,
  });
};

module.exports = {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  sendResponse,
};
