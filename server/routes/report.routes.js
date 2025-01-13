const router = require('express').Router();

const { getExpenseReport, getSalesReport, getProfitLossReport } = require('../controllers/report.controller.js');
const { asyncHandler } = require('../middleware/errorHandler.js');
const { isLoggedIn } = require('../middleware/index.js');

router.use(isLoggedIn);

router.get('/expense', asyncHandler(getExpenseReport));

router.get('/sales', asyncHandler(getSalesReport));

router.get('/profit-loss', asyncHandler(getProfitLossReport));

module.exports = router;