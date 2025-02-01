const router = require("express").Router();
const {
  getCustomer,
  addEditCustomer,
  getCustomersByName,
} = require("../controllers/customer.controller");

const { isLoggedIn } = require("../middleware");

router.use(isLoggedIn);

router.get("/:phone", getCustomer);
router.post("/", addEditCustomer);
router.get("/", getCustomersByName);

module.exports = router;