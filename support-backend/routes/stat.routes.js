const router = require('express').Router();

const { isLoggedIn } = require('../../server/middleware');
const { getStats, getLeadsChart } = require('../controller/stat.controller');

router.use(isLoggedIn);

router.get('/', getStats);

router.get('/leads-chart', getLeadsChart);

module.exports = router;