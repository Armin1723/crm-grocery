const { login, register, forgotPassword, resetPassword, verifyOTP, logout } = require("../controller/auth.controller");
const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.post("/login", asyncHandler(login));

router.post("/register", asyncHandler(register));

router.get('/logout', asyncHandler(logout));

router.post('/verify-otp', asyncHandler(verifyOTP));

router.post("/forgot-password", asyncHandler(forgotPassword));

router.post("/reset-password", asyncHandler(resetPassword));

module.exports = router;
