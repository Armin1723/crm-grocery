const {
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  validateUser,
  registerUser,
  verifyOtp,
  updatePrefences,
} = require("../controllers/auth.controller");

const { isLoggedIn, validateSchema } = require("../middleware/index");

const { asyncHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

const multer = require("multer");
const upload = multer({ dest: "/tmp" });
const rateLimit = require("express-rate-limit");
const {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validations/auth.validation");

// Rate Limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 requests per windowMs
  message: { message: "Too many login attempts, please try again later." },
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 registration attempts per windowMs
  message: {
    message: "Too many registration attempts, please try again later.",
  },
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 forgot-password attempts per windowMs
  message: {
    message: "Too many password reset requests, please try again later.",
  },
});

router.post(
  "/login",
  loginLimiter,
  validateSchema(loginSchema),
  asyncHandler(loginUser)
);

router.post("/verify-otp", loginLimiter, asyncHandler(verifyOtp));

router.post(
  "/register",
  registerLimiter,
  upload.fields([{ name: "avatar" }]),
  validateSchema(registerSchema),
  asyncHandler(registerUser)
);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validateSchema(forgotPasswordSchema),
  asyncHandler(forgotPassword)
);

router.post(
  "/reset-password",
  validateSchema(resetPasswordSchema),
  asyncHandler(resetPassword)
);

router.get("/logout", asyncHandler(logoutUser));

router.put("/update-preferences", asyncHandler(updatePrefences));

router.get("/validate", isLoggedIn, asyncHandler(validateUser));

module.exports = router;
