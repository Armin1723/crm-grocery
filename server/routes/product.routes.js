const {
  getProducts,
  getProduct,
  deleteProduct,
  editProduct,
  addProduct,
  searchProduct,
  setStockPreference,
} = require("../controllers/product.controller");

const router = require("express").Router();

router.get("/", getProducts);

router.post("/", addProduct);

router.get("/search", searchProduct);

router.get("/:id", getProduct);

router.put("/:id", editProduct);

router.post("/:id/stock", setStockPreference);

router.delete("/:id", deleteProduct);

module.exports = router;
