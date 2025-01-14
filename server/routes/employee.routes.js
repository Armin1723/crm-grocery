const { getEmployees, addEmployee, getEmployee, editEmployee, deleteEmployee } = require("../controllers/employee.controller");
const { isAdmin } = require("../middleware");
const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.use(isAdmin);

router.get("/", asyncHandler(getEmployees));

router.post("/", asyncHandler(addEmployee));

router.get("/:id", asyncHandler(getEmployee));

router.put("/:id", asyncHandler(editEmployee));

router.delete("/:id", asyncHandler(deleteEmployee));

module.exports = router;
