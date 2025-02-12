const Ticket = require("../../models/ticket.model");

const cloudinary = require("../../config/cloudinary");

const getTickets = async (req, res) => {
  const {
    sort = "createdAt",
    sortType = "desc",
    status,
    page = 1,
    limit = 10,
    createdBy,
  } = req.query;

  const query = {};

  if (createdBy) {
    query.createdBy = createdBy;
  }

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
    tickets,
    totalResults,
    totalPages,
  });
};

const getTicket = async (req, res) => {
  const { id } = req.params;
  const ticket = await Ticket.findById(id).populate("assignedTo createdBy");

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

const createTicket = async (req, res) => {
  const { description, createdBy } = req.body;

  if (!description || !createdBy) {
    return res.status(400).json({
      success: false,
      message: "Please provide description",
    });
  }

  //TODO: Implement round robin in the future
  const assignedTo = await User.findOne({ role: "support" })
    .select("_id")
    .lean();

  const ticket = new Ticket({
    ...req.body,
    assignedTo: assignedTo._id,
  });

  // Upload screenshot if exists
  if (req.files) {
    const { screenshot } = req.files;
    if (screenshot) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          screenshot[0].path,
          { folder: `tickets` }
        );
        if (!cloudinaryResponse || cloudinaryResponse.error) {
          return res.status(500).json({
            success: false,
            message: "Failed to upload screenshot to cloud.",
            error: cloudinaryResponse.error,
          });
        }
        ticket.screenshot = cloudinaryResponse.secure_url;
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload employee image to cloud.",
          error: error.message,
        });
      }
    }
  }

  await ticket.save();

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
