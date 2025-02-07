const {
  getSales,
  getSale,
  addSale,
  getEmployeeSales,
  getRecentSale,
  addSaleReturn,
  getSaleReturns,
  deleteSale,
  regenerateSaleInvoice,
} = require("../controllers/sale.controller");
const { isLoggedIn, isSubscriptionActive } = require("../middleware");
const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.use(isLoggedIn);

router.get("/", asyncHandler(getSales));

router.get("/recent", asyncHandler(getRecentSale));

router.get("/return", asyncHandler(getSaleReturns));

router.post("/return", asyncHandler(addSaleReturn));

// Protected routes (For subscribers only)
router.use(isSubscriptionActive);

router.get("/:id", asyncHandler(getSale));

router.post("/:id/invoice", asyncHandler(regenerateSaleInvoice));

router.delete("/:id", asyncHandler(deleteSale));

router.get("/employee/:id", asyncHandler(getEmployeeSales));

router.post("/", asyncHandler(addSale));


module.exports = router;
