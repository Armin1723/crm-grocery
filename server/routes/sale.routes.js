const {
  getSales,
  getSale,
  addSale,
  getEmployeeSales,
  getRecentSale,
} = require("../controllers/sale.controller");
const { isLoggedIn } = require("../middleware");

const router = require("express").Router();

router.use(isLoggedIn);

router.get("/", getSales);

router.get("/recent", getRecentSale);

router.get("/:id", getSale);

router.get("/employee/:employeeId", getEmployeeSales);

router.post("/", addSale);

module.exports = router;
