const { sendEmail, sendMailToAdmin } = require("../utils/email.utils");
const {
  createAdminNotificationEmail,
  createUserThankYouEmail,
} = require("../utils/emailTemplates");
const path = require("path");

exports.submitContact = async (req, res) => {
  try {
    const { firstName, lastName = "", email, phone = "", subject, message } = req.body;

    if (!firstName || !email || !subject || !message) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const fullName = `${firstName} ${lastName}`.trim();
    const submissionDate = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "";
    const logoPath = path.join(__dirname, "../../../frontend/src/assets/logo.png");
    const logoAttachment = {
      filename: "logo.png",
      path: logoPath,
      cid: "ijhat-logo",
    };

    await Promise.all([
      sendEmail({
        to: email,
        subject: "Thank You for Contacting IJHAT",
        html: createUserThankYouEmail({
          firstName,
          fullName,
          email,
          subject,
        }),
        attachments: [logoAttachment],
      }),
      sendMailToAdmin({
        subject: "New Form Submission Received",
        html: createAdminNotificationEmail({
          fullName,
          email,
          phone,
          subject,
          message,
          date: submissionDate,
          ipAddress,
          viewUrl: process.env.ADMIN_SUBMISSIONS_URL || "http://localhost:5174",
        }),
        attachments: [logoAttachment],
      }),
    ]);

    res.status(200).json({ message: "Contact query submitted successfully" });
  } catch (error) {
    console.error("Contact submit error:", error);
    res.status(500).json({ message: "Contact query failed" });
  }
};
