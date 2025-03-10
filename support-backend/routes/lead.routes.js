
const {
  getLeads,
  getLead,
  addLead,
  editLead,
  deleteLead,
  changeStatus,
} = require("../controller/lead.controller");
const { isLoggedIn } = require("../middleware");
const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();


const leadRoutes = (io) => {
  
  router.post(
    "/",
    asyncHandler((req, res, next) => addLead(req, res, next, io))
  );

  router.use(isLoggedIn);

  router.get("/", asyncHandler(getLeads));

  router.get("/:id", asyncHandler(getLead));

  router.put("/:id", asyncHandler(editLead));

  router.post(
    "/:id/status",
    asyncHandler((req, res, next) => changeStatus(req, res, next, io))
  );

  router.delete("/:id", asyncHandler(deleteLead));

  return router;
};

module.exports = leadRoutes;
