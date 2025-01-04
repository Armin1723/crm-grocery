const {
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  validateUser,
} = require("../controllers/auth.controller");

const {isLoggedIn} = require("../middleware/index")

const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.post("/login", asyncHandler(loginUser));

router.post("/forgot-password", asyncHandler(forgotPassword));

router.post("/reset-password", asyncHandler(resetPassword));

router.get("/logout", asyncHandler(logoutUser));

router.get("/validate", isLoggedIn, asyncHandler(validateUser))

module.exports = router;
