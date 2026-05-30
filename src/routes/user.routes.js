const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, uploadAvatar } = require("../controllers/user.controller");
const upload = require("../middlewares/upload.middleware");

// Import the function we just made
const { protect } = require("../middlewares/auth.middleware"); 

// Apply 'protect' to every route that needs a logged-in user
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/upload-avatar", protect, upload.single("avatar"), uploadAvatar);

module.exports = router;