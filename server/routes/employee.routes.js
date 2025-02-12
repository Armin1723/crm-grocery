const {
  getEmployees,
  addEmployee,
  getEmployee,
  editEmployee,
  deleteEmployee,
  getEmployeeSales,
  updatePrefences,
  getEmployeeById,
} = require("../controllers/employee.controller");
const { isAdmin, isSubscriptionActive } = require("../middleware");
const { asyncHandler } = require("../middleware/errorHandler");
const multer = require("multer");

const upload = multer({ dest: "/tmp" });

const router = require("express").Router();

//Support Panel Routes
router.get("/:id", asyncHandler(getEmployeeById));

router.use(isAdmin);

router.get("/", asyncHandler(getEmployees));

router.put("/update-preferences", asyncHandler(updatePrefences));

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
