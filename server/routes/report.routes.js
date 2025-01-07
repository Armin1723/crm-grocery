const router = require('express').Router();

const { getExpenseReport } = require('../controllers/report.controller.js');
const { asyncHandler } = require('../middleware/errorHandler.js');
const { isLoggedIn } = require('../middleware/index.js');

router.use(isLoggedIn);

router.get('/expense', asyncHandler(getExpenseReport));

module.exports = router;