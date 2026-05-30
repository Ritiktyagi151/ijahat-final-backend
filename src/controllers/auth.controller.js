const bcrypt = require("bcryptjs");
const path = require("path");
const User = require("../models/user.model");
const { generateToken } = require("../utils/token.utils");
const { sendEmail } = require("../utils/email.utils");
const { createPasswordResetEmail } = require("../utils/emailTemplates");

exports.register = async (req, res) => {
  try {
    const { name = "", email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const [firstName = "", ...lastNameParts] = name.trim().split(/\s+/);

    const user = await User.create({
      name,
      firstName,
      lastName: lastNameParts.join(" "),
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.forgotPasswordOTP = otp;
  user.forgotPasswordOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
  await user.save();
  const logoAttachment = {
    filename: "logo.png",
    path: path.join(__dirname, "../../../frontend/src/assets/logo.png"),
    cid: "ijhat-logo",
  };

  await sendEmail({
    to: email,
    subject: "Password Reset OTP",
    html: createPasswordResetEmail({
      otp,
      recipientLabel: "IJHAT user account",
      expiry: "10 minutes",
    }),
    attachments: [logoAttachment],
  });

  res.json({ message: "OTP sent to email" });
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    forgotPasswordOTP: otp,
    forgotPasswordOTPExpiry: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

  res.json({ message: "OTP verified" });
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = await bcrypt.hash(newPassword, 12);
  user.forgotPasswordOTP = undefined;
  user.forgotPasswordOTPExpiry = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
};
