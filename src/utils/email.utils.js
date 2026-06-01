const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html, attachments }) => {
  try {
    const result = await resend.emails.send({
      from: "Journal Submission <onboarding@resend.dev>",
      to: to,
      subject,
      html,
      attachments,
    });
    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

// Admin ko email
exports.sendMailToAdmin = async ({ subject, html }) => {
  return sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
  });
};

// User ko email
exports.sendMailToUser = async ({ userEmail, subject, html }) => {
  return sendEmail({
    to: userEmail,
    subject,
    html,
  });
};

exports.sendEmail = sendEmail;
