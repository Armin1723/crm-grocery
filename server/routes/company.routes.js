const router = require("express").Router();

const {
  addCompany,
  getCompanies,
  activateCompany,
  getCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/company.controller");

const multer = require("multer");

const upload = multer({ dest: "/tmp" });

const { asyncHandler } = require("../middleware/errorHandler");
const authorize = require("../middleware/authorize");

// Retrieve a single Company with id
router.get("/:id", asyncHandler(getCompany));

// Middleware (permission based access control)
router.use(authorize(["companies"]));

// Create a new Company
router.post("/", upload.fields([{name: "logo"}]), asyncHandler(addCompany));

// Update a Company with id
router.put("/:id", upload.fields([{name: "logo"}]), asyncHandler(updateCompany));

// Retrieve all Companies
router.get("/", asyncHandler(getCompanies));

// Activate a Company
router.put(":id/activate", asyncHandler(activateCompany));

// Delete a Company with id
router.delete("/:id", asyncHandler(deleteCompany));

module.exports = router;
