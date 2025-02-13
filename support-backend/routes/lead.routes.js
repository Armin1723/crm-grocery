const {
  getLeads,
  getLead,
  addLead,
  editLead,
  deleteLead,
} = require("../controller/lead.controller");
const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.get("/", asyncHandler(getLeads));

router.get("/:id", asyncHandler(getLead));

router.post("/", asyncHandler(addLead));

router.put("/:id", asyncHandler(editLead));

router.delete("/:id", asyncHandler(deleteLead));

module.exports = router;
