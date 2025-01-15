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
const { isLoggedIn } = require("../middleware");
const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.use(isLoggedIn);

router.get("/", asyncHandler(getPurchases));

router.get("/recent", asyncHandler(getRecentPurchase));

router.get("/employee/:employeeId", asyncHandler(getEmployeePurchases));

router.post("/", asyncHandler(addPurchase));

router.get("/return", asyncHandler(getPurchaseReturns));

router.post("/return", asyncHandler(addPurchaseReturn));

router.get("/:id", asyncHandler(getPurchase));

router.post("/:id/payments", asyncHandler(addPayment));


module.exports = router;
