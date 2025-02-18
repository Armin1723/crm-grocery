const Lead = require("../models/lead.model");
const Ticket = require("../models/ticket.model");

const getStats = async (req, res) => {
  try {
    // Pipeline for monthly aggregation
    const matchStage = {
      createdAt: {
        $gte: new Date(new Date().getFullYear(), 0, 1),
      },
    };

    const groupStage = {
      _id: null,
      total: { $sum: 1 },
    };

    const pipeline = [
      { $match: matchStage },
      { $group: groupStage },
    ];

    // Pipeline for counting statuses
    const statusPipeline = [
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ];

    // Execute aggregations concurrently
    const [tickets, leads, ticketStatusCounts, leadStatusCounts] =
      await Promise.all([
        Ticket.aggregate(pipeline),
        Lead.aggregate(pipeline),
        Ticket.aggregate(statusPipeline),
        Lead.aggregate(statusPipeline),
      ]);

    // Default status objects to ensure all statuses are included
    const defaultTicketStatuses = {
      new: 0,
      open: 0,
      "in progress": 0,
      closed: 0,
    };

    const defaultLeadStatuses = {
      new: 0,
      contacted: 0,
      converted: 0,
      lost: 0,
    };

    // Function to merge results with default statuses
    const formatStatusCounts = (statusCounts, defaultStatuses) => {
      const result = { ...defaultStatuses };
      statusCounts.forEach(({ status, count }) => {
        result[status] = count;
      });
      return result;
    };

    res.status(200).json({
      success: true,
      tickets,
      leads,
      ticketStatus: formatStatusCounts(
        ticketStatusCounts,
        defaultTicketStatuses
      ),
      leadStatus: formatStatusCounts(leadStatusCounts, defaultLeadStatuses),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const getLeadsChart = async (req, res) => {
  try {
    const groupBy = req.query.groupBy || "daily"; // Default grouping: daily
    let dateFormat = "%Y-%m-%d"; // Default format for daily

    if (groupBy === "weekly") {
      dateFormat = "%Y-%U"; // Week of the year
    } else if (groupBy === "monthly") {
      dateFormat = "%Y-%m"; // Year-Month format
    }

    const stats = await Lead.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          leads: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date
    ]);

    res.json({ stats });
  } catch (error) {
    console.error("Error fetching leads chart data:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getStats,
  getLeadsChart,
};
