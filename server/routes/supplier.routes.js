const {
  getSuppliers,
  addSupplier,
  getSupplier,
  editSupplier,
  deleteSupplier,
} = require("../controllers/supplier.controller");
const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.get("/", asyncHandler(getSuppliers));

router.post("/", asyncHandler(addSupplier));

router.get("/:id", asyncHandler(getSupplier));

router.put("/:id", asyncHandler(editSupplier));

router.delete("/:id", asyncHandler(deleteSupplier));

module.exports = router;
