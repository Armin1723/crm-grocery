const router = require("express").Router();
const { isAdmin } = require("../middleware");

const { addExpense, getExpenses } = require("../controllers/expense.controller");

router.use(isAdmin);

router.get("/", getExpenses);

router.post("/", addExpense);

module.exports = router;