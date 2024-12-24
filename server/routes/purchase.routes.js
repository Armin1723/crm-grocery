const {
  getPurchases,
  addPurchase,
  getPurchase,
  getEmployeePurchases,
  getRecentPurchase,
} = require("../controllers/purchase.controller");
const { isLoggedIn } = require("../middleware");
const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.use(isLoggedIn);

router.get("/", asyncHandler(getPurchases));

router.get("/recent", asyncHandler(getRecentPurchase));

router.get("/employee/:employeeId", asyncHandler(getEmployeePurchases));

router.post("/", asyncHandler(addPurchase));

router.get("/:id", asyncHandler(getPurchase));

module.exports = router;
