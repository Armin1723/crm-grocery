const {
  getSales,
  getSale,
  addSale,
  getEmployeeSales,
  getRecentSale,
  addSaleReturn,
  getSaleReturns,
  deleteSale,
} = require("../controllers/sale.controller");
const { isLoggedIn } = require("../middleware");
const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.use(isLoggedIn);

router.get("/", asyncHandler(getSales));

router.get("/recent", asyncHandler(getRecentSale));

router.post("/return", asyncHandler(addSaleReturn));

router.get("/return", asyncHandler(getSaleReturns));

router.get("/:id", asyncHandler(getSale));

router.delete("/:id", asyncHandler(deleteSale));

router.get("/employee/:id", asyncHandler(getEmployeeSales));

router.post("/", asyncHandler(addSale));


module.exports = router;
