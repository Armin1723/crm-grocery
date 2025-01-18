const {
  getProductsFromInventory,
  getProductsGroupedByCategory,
  getProductFromInventory,
  getRates,
  editBatch,
  mergeBatches,
  hardMergeBatches,
  getExpiringInventory,
} = require("../controllers/inventory.controller");
const { isAdmin } = require("../middleware");
const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.use(isAdmin);

router.get("/", asyncHandler(getProductsGroupedByCategory));

router.get("/expiring", asyncHandler(getExpiringInventory));

router.get("/products", asyncHandler(getProductsFromInventory));

router.get("/:upid", asyncHandler(getProductFromInventory));

router.get("/:upid/rates", asyncHandler(getRates));

router.patch("/:upid/batches", asyncHandler(editBatch));

router.put("/:upid/batches/merge", asyncHandler(mergeBatches));

router.put("/:upid/batches/merge/hard", asyncHandler(hardMergeBatches));

module.exports = router;
