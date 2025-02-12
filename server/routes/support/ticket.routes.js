const router = require("express").Router();
const { asyncHandler } = require("../../middleware/errorHandler");
const multer = require("multer");

const upload = multer({ dest: "/tmp" });

const { isLoggedIn } = require("../../middleware");
const { getTickets, getTicket, createTicket, updateTicket, sendResponse } = require("../../controllers/support/ticket.controller");


router.get("/", asyncHandler(getTickets));

router.use(isLoggedIn);

router.get("/:id", asyncHandler(getTicket));

router.post("/", upload.fields([{name: "screenshot"}]), asyncHandler(createTicket));

router.put("/:id", asyncHandler(updateTicket));

router.post("/:id/response", asyncHandler(sendResponse));

module.exports = router;
