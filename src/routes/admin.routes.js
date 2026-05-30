const express = require("express");
const router = express.Router();

const {
  adminLogin,
  forgotAdminPassword,
  resetAdminPassword,
} = require("../controllers/admin.controller");

router.post("/login",adminLogin);
router.post("/forgot-password", forgotAdminPassword);
router.post("/reset-password/:token", resetAdminPassword);

module.exports = router;
