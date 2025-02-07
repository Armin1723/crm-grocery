const router = require("express").Router();

const {
  getExpenseReport,
  getSalesReport,
  getProfitLossReport,
  getTaxReport,
} = require("../controllers/report.controller.js");
const { asyncHandler } = require("../middleware/errorHandler.js");
const { isLoggedIn, isSubscriptionActive } = require("../middleware/index.js");

router.use(isLoggedIn);

router.use(isSubscriptionActive);

router.get("/expense", asyncHandler(getExpenseReport));

router.get("/sales", asyncHandler(getSalesReport));

router.get("/profit-loss", asyncHandler(getProfitLossReport));

router.get("/tax", asyncHandler(getTaxReport));

module.exports = router;
