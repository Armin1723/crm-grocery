const {
  getEmployees,
  addEmployee,
  getEmployee,
  editEmployee,
  deleteEmployee,
  getEmployeeSales,
} = require("../controllers/employee.controller");
const { isAdmin, isLoggedIn } = require("../middleware");
const { asyncHandler } = require("../middleware/errorHandler");
const multer = require("multer");

const upload = multer({ dest: "/tmp" });

const router = require("express").Router();


router.get("/",isAdmin, asyncHandler(getEmployees));

router.post(
  "/",
  isAdmin,
  upload.fields([{ name: "avatar" }, { name: "identityProof" }]),
  asyncHandler(addEmployee)
);

router.put(
  "/",
  isAdmin,
  upload.fields([{ name: "avatar" }, { name: "identityProof" }]),
  asyncHandler(editEmployee)
);

router.get("/:uuid", isLoggedIn, asyncHandler(getEmployee));

router.get("/:uuid/sales", isLoggedIn, asyncHandler(getEmployeeSales));

router.delete("/:uuid",  isAdmin, asyncHandler(deleteEmployee));

module.exports = router;
