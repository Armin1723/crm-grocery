const router = require("express").Router();
const {
  getCustomer,
  addEditCustomer,
} = require("../controllers/customer.controller");

const { isLoggedIn } = require("../middleware");

router.use(isLoggedIn);

router.get("/:phone", getCustomer);
router.post("/", addEditCustomer);

module.exports = router;
