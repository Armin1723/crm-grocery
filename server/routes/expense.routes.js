const router = require("express").Router();
const { isAdmin, isSubscriptionActive } = require("../middleware");

const { addExpense, getExpenses } = require("../controllers/expense.controller");

router.use(isAdmin);

router.get("/", getExpenses);

router.post("/", isSubscriptionActive, addExpense);

module.exports = router;