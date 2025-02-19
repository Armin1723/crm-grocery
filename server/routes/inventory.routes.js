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
const { isSubscriptionActive } = require("../middleware");
const authorize = require("../middleware/authorize");
const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.use(authorize(["inventory"]));

router.get("/products", asyncHandler(getProductsFromInventory));

router.get("/", asyncHandler(getProductsGroupedByCategory));

router.get("/list", asyncHandler(getInventoryListGroupedByCategory));

router.get("/expiring", asyncHandler(getExpiringInventory));

router.get("/:upid", asyncHandler(getProductFromInventory));

//protected routes (for subscribed users)
router.use(isSubscriptionActive);

router.get("/:upid/rates", asyncHandler(getRates));

router.patch(
  "/:upid/batches",
  authorize("edit_inventory"),
  asyncHandler(editBatch)
);

router.put(
  "/:upid/batches/merge",
  authorize("edit_inventory"),
  asyncHandler(mergeBatches)
);

router.put("/:upid/batches/merge/hard", asyncHandler(hardMergeBatches));

module.exports = router;
