const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/email.utils");
const { createPasswordResetEmail } = require("../utils/emailTemplates");

const ADMIN_RESET_EXPIRY_MINUTES = 15;

const hashResetToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const getAdminResetUrl = (token) => {
  const baseUrl = (process.env.ADMIN_RESET_URL || "https://ijaht.com/admin/reset-password").replace(/[/?#]+$/, "");
  return `${baseUrl}?token=${encodeURIComponent(token)}`;
};

exports.adminLogin = async(req,res)=>{

try{

const {email,password} = req.body;

const admin = await Admin.findOne({email});

if(!admin){

return res.status(401).json({message:"Invalid email"});

}

const isMatch = await bcrypt.compare(password,admin.password);

if(!isMatch){

return res.status(401).json({message:"Invalid password"});

}

const token = jwt.sign(
{ id: admin._id },
process.env.JWT_SECRET,
{ expiresIn:"1d" }
);

res.json({
token,
admin:{
id:admin._id,
email:admin.email
}
});

}catch(err){

console.log(err);
res.status(500).json({message:"Server error"});

}

};

exports.forgotAdminPassword = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const admin = await Admin.findOne({ email });
    console.log("Admin forgot password: admin found", Boolean(admin));

    if (!admin) {
      return res.json({
        message: "If this admin email exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = hashResetToken(resetToken);
    console.log("Admin forgot password: token generated", Boolean(resetToken));

    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpire = Date.now() + ADMIN_RESET_EXPIRY_MINUTES * 60 * 1000;
    await admin.save();

    const resetUrl = getAdminResetUrl(resetToken);
    const emailResult = await sendEmail({
      to: admin.email,
      subject: "IJAHT Admin Password Reset",
      html: createPasswordResetEmail({
        resetUrl,
        recipientLabel: "IJAHT admin dashboard account",
        expiry: `${ADMIN_RESET_EXPIRY_MINUTES} minutes`,
      }),
    });
    console.log("Admin forgot password: email sent", Boolean(emailResult));
    console.log("Admin forgot password: Resend response", emailResult);

    res.json({
      message: "If this admin email exists, a reset link has been sent.",
    });
  } catch (err) {
    console.error("Admin forgot password: email error", {
      message: err.message,
      name: err.name,
      statusCode: err.statusCode,
      response: err.response,
    });
    res.status(500).json({ message: "Password reset request failed" });
  }
};

exports.validateAdminResetToken = async (req, res) => {
  try {
    const token = req.body.token || req.query.token || req.params.token;

    if (!token) {
      return res.status(400).json({ message: "Reset token is required" });
    }

    const admin = await Admin.findOne({
      resetPasswordToken: hashResetToken(token),
      resetPasswordExpire: { $gt: Date.now() },
    });

    return res.json({ valid: Boolean(admin) });
  } catch (err) {
    console.error("Admin validate reset token failed:", {
      message: err.message,
      name: err.name,
    });
    res.status(500).json({ message: "Token validation failed" });
  }
};

exports.resetAdminPassword = async (req, res) => {
  try {
    const token = req.params.token || req.body.token || req.query.token;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Reset token is required" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const hashedToken = hashResetToken(token);

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({
        message: "Reset link is invalid or expired",
      });
    }

    admin.password = await bcrypt.hash(password, 10);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Password reset failed" });
  }
};
