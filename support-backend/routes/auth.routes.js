const { login, register, forgotPassword, resetPassword, verifyOTP } = require("../controller/auth.controller");
const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.post("/login", asyncHandler(login));

router.post("/register", asyncHandler(register));

router.post('/verify-otp', asyncHandler(verifyOTP));

router.post("/forgot-password", asyncHandler(forgotPassword));

router.post("/reset-password", asyncHandler(resetPassword));

module.exports = router;
