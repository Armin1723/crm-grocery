const {
  getProductsFromInventory,
  getProductsGroupedByCategory,
} = require("../controllers/inventory.controller");
const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.get("/", asyncHandler(getProductsGroupedByCategory));

router.get("/products", asyncHandler(getProductsFromInventory));

module.exports = router;
