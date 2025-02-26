const router = require("express").Router();
const {
  getCustomer,
  addEditCustomer,
  getCustomers,
  getCustomerSales,
  getCustomerProducts,
  addCustomerRepayments,
} = require("../controllers/customer.controller");

const { isLoggedIn, isSubscriptionActive } = require("../middleware");

router.use(isLoggedIn);
router.use(isSubscriptionActive);

router.get("/:id", getCustomer);

router.post("/", addEditCustomer);

router.get("/", getCustomers);

router.get("/:id/sales", getCustomerSales);

router.get("/:id/products", getCustomerProducts);

router.post("/:id/payment", addCustomerRepayments);

module.exports = router;