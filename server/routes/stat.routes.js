const { getBasicStats, getPurchaseStats, getSaleStats, getProductStats, getInventoryGroupedByCategory, salesPurchaseChart, getProductsGroupedByCategory } = require('../controllers/stat.controller');
const { asyncHandler } = require('../middleware/errorHandler');

const router = require('express').Router();

router.get('/', asyncHandler(getBasicStats));

router.get('/sales-chart', asyncHandler(salesPurchaseChart));

router.get('/products-chart', asyncHandler(getProductsGroupedByCategory));

router.get('/purchases', asyncHandler(getPurchaseStats));

router.get('/sales', asyncHandler(getSaleStats));

router.get('/products', asyncHandler(getProductStats));

router.get('/inventory/category', asyncHandler(getInventoryGroupedByCategory));

module.exports = router;