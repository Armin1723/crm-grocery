const {
  getProductsFromInventory,
  getProductsGroupedByCategory,
  getProductFromInventory,
  getRates,
  editBatch,
} = require("../controllers/inventory.controller");
const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.get("/", asyncHandler(getProductsGroupedByCategory));

router.get("/:upid", asyncHandler(getProductFromInventory));

router.get("/:upid/rates", asyncHandler(getRates));

router.patch("/:upid/batches", asyncHandler(editBatch));

router.get("/products", asyncHandler(getProductsFromInventory));

module.exports = router;
