const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

exports.getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user.id).select("-password");

    res.json(user);

  } catch (error) {

    res.status(500).json({ message: "Profile fetch failed" });

  }

};


exports.updateProfile = async (req, res) => {

  try {
    const updates = { ...req.body };

    delete updates.email;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    } else {
      delete updates.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select("-password");

    res.json(updatedUser);

  } catch (error) {

    res.status(500).json({ message: "Profile update failed" });

  }

};


exports.uploadAvatar = async (req, res) => {
  try {
    // 1. Safety check: Did Multer actually save a file?
    if (!req.file) {
      return res.status(400).json({ message: "No valid image file provided." });
    }

    const user = await User.findById(req.user.id);

    // 2. Fix Windows path issue: Convert backslashes to forward slashes
    const normalizedPath = req.file.path.replace(/\\/g, "/");
    user.avatar = normalizedPath;

    await user.save();

    res.json({ avatar: user.avatar });

  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({ message: "Avatar upload failed" });
  }
};
