const {
  getClients,
  getClient,
  activateClient,
} = require("../controller/client.controller");

const router = require("express").Router();

const { asyncHandler } = require("../middleware/errorHandler");

router.get("/", asyncHandler(getClients));

router.get("/:id", asyncHandler(getClient));

router.put("/:id", asyncHandler(activateClient));

module.exports = router;
