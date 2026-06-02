const express = require("express");
const router = express.Router();

const {
  adminLogin,
  forgotAdminPassword,
  validateAdminResetToken,
  resetAdminPassword,
} = require("../controllers/admin.controller");

router.post("/login",adminLogin);
router.post("/forgot-password", forgotAdminPassword);
router.post("/validate-reset-token", validateAdminResetToken);
router.post("/reset-password", resetAdminPassword);
router.post("/reset-password/:token", resetAdminPassword);

module.exports = router;
