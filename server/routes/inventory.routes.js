const {
  getProductsFromInventory,
  getProductsGroupedByCategory,
  getProductFromInventory,
  getRates,
  editBatch,
  mergeBatches,
  hardMergeBatches,
  getExpiringInventory,
  getInventoryListGroupedByCategory,
} = require("../controllers/inventory.controller");
const { isAdmin, isLoggedIn } = require("../middleware");
const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.use(isLoggedIn);

router.get("/products", asyncHandler(getProductsFromInventory));

router.get("/", asyncHandler(getProductsGroupedByCategory));

router.get("/list", asyncHandler(getInventoryListGroupedByCategory));

router.get("/expiring", asyncHandler(getExpiringInventory));

router.get("/:upid", asyncHandler(getProductFromInventory));

router.get("/:upid/rates", asyncHandler(getRates));

router.patch("/:upid/batches", isAdmin, asyncHandler(editBatch));

router.put("/:upid/batches/merge", isAdmin, asyncHandler(mergeBatches));

router.put("/:upid/batches/merge/hard", asyncHandler(hardMergeBatches));

module.exports = router;
