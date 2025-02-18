const router = require('express').Router();

const { getStats, getLeadsChart } = require('../controller/stat.controller');

router.get('/', getStats);

router.get('/leads-chart', getLeadsChart);

module.exports = router;