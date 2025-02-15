const {
  getClientById,
  activateClient,
  deactivateClient,
  getClients,
  getLeadsCompany,
} = require("../controllers/support.controller");
const { verifyApiKey } = require("../middleware");

const router = require("express").Router();

router.use(verifyApiKey);

router.get("/clients", getClients);

router.get("/clients/:id", getClientById);

router.post("/clients/:id/activate", activateClient);

router.post("/clients/:id/deactivate", deactivateClient);

router.get("/company/leads/:id", getLeadsCompany);  

module.exports = router;
