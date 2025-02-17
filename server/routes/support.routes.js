const {
  getClientById,
  activateClient,
  deactivateClient,
  getClients,
  getLeadsCompany,
} = require("../controllers/support.controller");
const { verifyApiKey } = require("../middleware");

const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.use(verifyApiKey);

router.get("/clients", asyncHandler(getClients));

router.get("/clients/:id", asyncHandler(getClientById));

router.post("/clients/:id/activate", asyncHandler(activateClient));

router.post("/clients/:id/deactivate", asyncHandler(deactivateClient));

router.get("/company/leads/:id", asyncHandler(getLeadsCompany)); 

module.exports = router;
