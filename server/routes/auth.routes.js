const {
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
} = require("../controllers/auth.controller");

const { isLoggedIn } = require("../middleware");
const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.post("/login", asyncHandler(loginUser));

router.post("/forgot-password", asyncHandler(forgotPassword));

router.post("/reset-password", asyncHandler(resetPassword));

router.get("/logout", isLoggedIn, asyncHandler(logoutUser));

module.exports = router;
