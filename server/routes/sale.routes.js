const { getSales, getSale, addSale, getEmployeeSales } = require('../controllers/sale.controller');

const router = require('express').Router();

router.get('/', getSales);

router.get('/:id', getSale);

router.get('/employee/:employeeId', getEmployeeSales);

router.post('/', addSale);

module.exports = router;

