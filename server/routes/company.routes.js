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
const { validateSchema, verifyApiKey } = require("../middleware");
const { updateCompanySchema, addCompanySchema } = require("../validations/company.validation");

// Middleware (permission based access control)
router.use(authorize(["companies"]));

// Retrieve a single Company with id
router.get("/:id", asyncHandler(getCompany));


// Create a new Company
router.post(
  "/",
  upload.fields([{ name: "logo" }]),
  validateSchema(addCompanySchema),
  asyncHandler(addCompany)
);

// Update a Company with id
router.put(
  "/:id",
  upload.fields([{ name: "logo" }]),
  validateSchema(updateCompanySchema),
  asyncHandler(updateCompany)
);

// Retrieve all Companies
router.get("/", asyncHandler(getCompanies));

// Activate a Company
router.put(":id/activate", verifyApiKey, asyncHandler(activateCompany));

// Delete a Company with id
router.delete("/:id", asyncHandler(deleteCompany));

module.exports = router;
