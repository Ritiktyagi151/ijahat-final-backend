const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const path = require("path");
const { sendEmail } = require("../utils/email.utils");
const { createPasswordResetEmail } = require("../utils/emailTemplates");

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
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.json({
        message: "If this admin email exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await admin.save();

    const resetUrl = `${
      process.env.ADMIN_RESET_URL || "http://localhost:5174/reset-password"
    }/${resetToken}`;
    const logoAttachment = {
      filename: "logo.png",
      path: path.join(__dirname, "../../../frontend/src/assets/logo.png"),
      cid: "ijhat-logo",
    };

    await sendEmail({
      to: admin.email,
      subject: "IJHAT Admin Password Reset",
      html: createPasswordResetEmail({
        resetUrl,
        recipientLabel: "IJHAT admin dashboard account",
        expiry: "15 minutes",
      }),
      attachments: [logoAttachment],
    });

    res.json({
      message: "If this admin email exists, a reset link has been sent.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Password reset request failed" });
  }
};

exports.resetAdminPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

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
