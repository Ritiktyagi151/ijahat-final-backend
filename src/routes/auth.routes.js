const express = require("express");
const {
  register,
  login,
  forgotPassword,
  verifyOTP,
  validateResetToken,
  resetPassword,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/validate-reset-token", validateResetToken);
router.post("/reset-password", resetPassword);

module.exports = router;
