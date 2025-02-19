const {
  getPurchases,
  addPurchase,
  getPurchase,
  getEmployeePurchases,
  getRecentPurchase,
  addPayment,
  getPurchaseReturns,
  addPurchaseReturn,
} = require("../controllers/purchase.controller");
const { isSubscriptionActive } = require("../middleware");
const authorize = require("../middleware/authorize");
const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.use(authorize(["purchases"]));

router.get("/", asyncHandler(getPurchases));

router.get("/recent", asyncHandler(getRecentPurchase));

router.get("/employee/:employeeId", asyncHandler(getEmployeePurchases));

router.get("/return", asyncHandler(getPurchaseReturns));

//Protected routes (For subscribers only)
router.use(isSubscriptionActive);

router.post("/", asyncHandler(addPurchase));

router.post("/return", asyncHandler(addPurchaseReturn));

router.get("/:id", asyncHandler(getPurchase));

router.post("/:id/payments", asyncHandler(addPayment));


module.exports = router;
