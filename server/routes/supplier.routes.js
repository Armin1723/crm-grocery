const {
  getSuppliers,
  addSupplier,
  getSupplier,
  editSupplier,
  deleteSupplier,
  getSupplierPurchases,
  getSupplierProducts,
} = require("../controllers/supplier.controller");
const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.get("/", asyncHandler(getSuppliers));

router.post("/", asyncHandler(addSupplier));

router.get("/:id", asyncHandler(getSupplier));

router.get("/:id/purchases", asyncHandler(getSupplierPurchases));

router.get("/:id/products", asyncHandler(getSupplierProducts));

router.put("/:id", asyncHandler(editSupplier));

router.delete("/:id", asyncHandler(deleteSupplier));

module.exports = router;
