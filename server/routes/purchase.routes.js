const {
  getPurchases,
  addPurchase,
  getPurchase,
  getEmployeePurchases,
  getRecentPurchase,
} = require("../controllers/purchase.controller");
const { isLoggedIn } = require("../middleware");

const router = require("express").Router();

router.use(isLoggedIn);

router.get("/", getPurchases);

router.get("/recent", getRecentPurchase);

router.get("/employee/:employeeId", getEmployeePurchases);

router.post("/", addPurchase);

router.get("/:id", getPurchase);

module.exports = router;
