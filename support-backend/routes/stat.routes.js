const router = require('express').Router();

const { getStats, getLeadsChart } = require('../controller/stat.controller');
const { isLoggedIn } = require('../middleware');

router.use(isLoggedIn);

router.get('/', getStats);

router.get('/leads-chart', getLeadsChart);

module.exports = router;