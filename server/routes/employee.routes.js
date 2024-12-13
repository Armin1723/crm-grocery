const { getEmployees, addEmployee, getEmployee, editEmployee, deleteEmployee } = require("../controllers/employee.controller");
const { isAdmin } = require("../middleware");

const router = require("express").Router();

router.use(isAdmin);

router.get("/", getEmployees);

router.post("/", addEmployee);

router.get("/:id", getEmployee);

router.put("/:id", editEmployee);

router.delete("/:id", deleteEmployee);

module.exports = router;
