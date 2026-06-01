const { sendEmail, sendMailToAdmin } = require("../utils/email.utils");
const {
  getAdminNotificationTemplate,
  getUserThankYouTemplate,
} = require("../utils/emailTemplates");

exports.submitContact = async (req, res) => {
  try {
    const {
      firstName,
      lastName = "",
      email,
      phone = "",
      country = "",
      institution = "",
      subject,
      message,
    } = req.body;

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
    const formData = {
      ...req.body,
      fullName,
      email,
      phone,
      country,
      institution,
      subject,
      message,
      submissionDate,
      ipAddress,
    };

    if (process.env.SEND_USER_CONFIRMATION !== "false") {
      await sendEmail({
        to: email,
        subject: "Thank You For Your Submission",
        html: getUserThankYouTemplate(formData),
      });
    }

    await sendMailToAdmin({
      subject: "New Submission Received",
      html: getAdminNotificationTemplate(formData),
    });

    res.status(200).json({ message: "Contact query submitted successfully" });
  } catch (error) {
    console.error("Contact submit error:", error);
    res.status(500).json({ message: "Contact query failed" });
  }
};
