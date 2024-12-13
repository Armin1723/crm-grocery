const { getBasicStats, getPurchaseStats, getSaleStats, getProductStats, getInventoryGroupedByCategory, salesPurchaseChart, getProductsGroupedByCategory } = require('../controllers/stat.controller');

const router = require('express').Router();

router.get('/', getBasicStats);

router.get('/sales-chart', salesPurchaseChart);

router.get('/products-chart', getProductsGroupedByCategory);

router.get('/purchases', getPurchaseStats);

router.get('/sales', getSaleStats);

router.get('/products', getProductStats);

router.get('/inventory/category', getInventoryGroupedByCategory);

module.exports = router;