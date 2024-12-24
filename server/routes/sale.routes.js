const {
  getSales,
  getSale,
  addSale,
  getEmployeeSales,
  getRecentSale,
} = require("../controllers/sale.controller");
const { isLoggedIn } = require("../middleware");
const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.use(isLoggedIn);

router.get("/", asyncHandler(getSales));

router.get("/recent", asyncHandler(getRecentSale));

router.get("/:id", asyncHandler(getSale));

router.get("/employee/:employeeId", asyncHandler(getEmployeeSales));

router.post("/", asyncHandler(addSale));

module.exports = router;
