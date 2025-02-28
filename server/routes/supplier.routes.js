const {
  getSuppliers,
  addSupplier,
  getSupplier,
  editSupplier,
  deleteSupplier,
  getSupplierPurchases,
  getSupplierProducts,
  addSupplierRepayments,
} = require("../controllers/supplier.controller");
const { asyncHandler } = require("../middleware/errorHandler");

const { isSubscriptionActive } = require("../middleware");
const authorize = require("../middleware/authorize");

const router = require("express").Router();

router.use(authorize(["suppliers"]));

router.get("/", asyncHandler(getSuppliers));

//Protected routes (for subscribed users)
router.use(isSubscriptionActive);

router.post("/", asyncHandler(addSupplier));

router.get("/:id", asyncHandler(getSupplier));

router.get("/:id/purchases", asyncHandler(getSupplierPurchases));

router.post("/:id/payment", asyncHandler(addSupplierRepayments));

router.get("/:id/products", asyncHandler(getSupplierProducts));

router.put("/:id", asyncHandler(editSupplier));

router.delete("/:id", asyncHandler(deleteSupplier));

module.exports = router;
