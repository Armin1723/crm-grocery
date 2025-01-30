const {
  getProducts,
  getProduct,
  deleteProduct,
  editProduct,
  addProduct,
  searchProduct,
  setStockPreference,
  getTrendingProducts,
  autoSetRate,
  productPurchases,
  productSales,
} = require("../controllers/product.controller");
const { asyncHandler } = require("../middleware/errorHandler");
const multer = require("multer");

const upload = multer({ dest: "/tmp" });

const router = require("express").Router();

router.get("/", asyncHandler(getProducts));

router.post("/", upload.fields([{ name: "image" }]), asyncHandler(addProduct));

router.get("/trending", asyncHandler(getTrendingProducts));

router.get("/search", asyncHandler(searchProduct));

router.get("/:id", asyncHandler(getProduct));

router.post(
  "/:id",
  upload.fields([{ name: "image" }]),
  asyncHandler(editProduct)
);

router.get("/:id/purchases", asyncHandler(productPurchases));

router.get("/:id/sales", asyncHandler(productSales));

router.post("/:id/auto-set-rate", asyncHandler(autoSetRate));

router.delete("/:id", asyncHandler(deleteProduct));

router.post("/:id/alert", asyncHandler(setStockPreference));

module.exports = router;
