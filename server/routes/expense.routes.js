const router = require("express").Router();
const { isSubscriptionActive } = require("../middleware");

const { addExpense, getExpenses } = require("../controllers/expense.controller");
const authorize = require("../middleware/authorize");

router.use(authorize(["expenses"]));

router.get("/", getExpenses);

router.post("/", isSubscriptionActive, addExpense);

module.exports = router;