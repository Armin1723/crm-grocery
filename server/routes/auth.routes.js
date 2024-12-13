const {
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
} = require("../controllers/auth.controller");

const { isLoggedIn } = require("../middleware");

const router = require("express").Router();

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.get("/logout", isLoggedIn, logoutUser);

module.exports = router;
