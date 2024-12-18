const {
  getProductsFromInventory,
  getProductsGroupedByCategory,
} = require("../controllers/inventory.controller");

const router = require("express").Router();

router.get("/", getProductsGroupedByCategory);

router.get("/products", getProductsFromInventory);

module.exports = router;
