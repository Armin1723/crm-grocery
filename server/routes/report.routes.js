const router = require("express").Router();

const {
  getExpenseReport,
  getSalesReport,
  getProfitLossReport,
  getTaxReport,
} = require("../controllers/report.controller.js");
const authorize = require("../middleware/authorize.js");
const { asyncHandler } = require("../middleware/errorHandler.js");
const { isSubscriptionActive } = require("../middleware/index.js");

router.use(authorize(["reports"]));

router.use(isSubscriptionActive);

router.get("/expense", asyncHandler(getExpenseReport));

router.get("/sales", asyncHandler(getSalesReport));

router.get("/profit-loss", asyncHandler(getProfitLossReport));

router.get("/tax", asyncHandler(getTaxReport));

module.exports = router;
