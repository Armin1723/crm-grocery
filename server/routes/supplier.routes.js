const {
  getSuppliers,
  addSupplier,
  getSupplier,
  editSupplier,
  deleteSupplier,
} = require("../controllers/supplier.controller");

const router = require("express").Router();

router.get("/", getSuppliers);

router.post("/", addSupplier);

router.get("/:id", getSupplier);

router.put("/:id", editSupplier);

router.delete("/:id", deleteSupplier);

module.exports = router;
