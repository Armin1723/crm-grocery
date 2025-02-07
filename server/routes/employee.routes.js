const {
  getEmployees,
  addEmployee,
  getEmployee,
  editEmployee,
  deleteEmployee,
  getEmployeeSales,
} = require("../controllers/employee.controller");
const { isAdmin, isSubscriptionActive } = require("../middleware");
const { asyncHandler } = require("../middleware/errorHandler");
const multer = require("multer");

const upload = multer({ dest: "/tmp" });

const router = require("express").Router();

router.use(isAdmin);

router.get("/", asyncHandler(getEmployees));

router.use(isSubscriptionActive);

router.post(
  "/",
  upload.fields([{ name: "avatar" }, { name: "identityProof" }]),
  asyncHandler(addEmployee)
);

router.put(
  "/",
  upload.fields([{ name: "avatar" }, { name: "identityProof" }]),
  asyncHandler(editEmployee)
);

router.get("/:uuid", asyncHandler(getEmployee));

router.get("/:uuid/sales", asyncHandler(getEmployeeSales));

router.delete("/:uuid", asyncHandler(deleteEmployee));

module.exports = router;
