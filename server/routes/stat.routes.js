const { getBasicStats, getPurchaseStats, getSaleStats, getProductStats, getInventoryGroupedByCategory, salesPurchaseChart, getProductsGroupedByCategory, getSellerStats, getSellerSalesChart } = require('../controllers/stat.controller');
const { asyncHandler } = require('../middleware/errorHandler');
const { isLoggedIn } = require('../middleware');

const router = require('express').Router();

router.use(isLoggedIn);

router.get('/', asyncHandler(getBasicStats));

router.get('/sales-chart', asyncHandler(salesPurchaseChart));

router.get('/seller/sales-chart', asyncHandler(getSellerSalesChart));

router.get('/products-chart', asyncHandler(getProductsGroupedByCategory));

router.get('/purchases', asyncHandler(getPurchaseStats));

router.get('/sales', asyncHandler(getSaleStats));

router.get('/seller', asyncHandler(getSellerStats));

router.get('/products', asyncHandler(getProductStats));

router.get('/inventory/category', asyncHandler(getInventoryGroupedByCategory));

module.exports = router;