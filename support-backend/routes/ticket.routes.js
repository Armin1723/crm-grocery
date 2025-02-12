const router = require("express").Router();
const { asyncHandler } = require("../middleware/errorHandler");

const { isLoggedIn } = require("../middleware");
const {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  sendResponse,
} = require("../controller/ticket.controller");

router.use(isLoggedIn);

router.get("/", asyncHandler(getTickets));

router.get("/:id", asyncHandler(getTicket));

router.post("/", asyncHandler(createTicket));

router.put("/:id", asyncHandler(updateTicket));

router.post("/:id/response", asyncHandler(sendResponse));

module.exports = router;
