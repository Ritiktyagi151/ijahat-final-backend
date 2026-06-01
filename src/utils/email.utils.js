const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const getFromAddress = () => {
  const emailFrom = process.env.EMAIL_FROM;

  if (!emailFrom) {
    throw new Error("EMAIL_FROM environment variable is required for sending email.");
  }

  return `IJAHT Journal <${emailFrom}>`;
};

const sendEmail = async ({ to, subject, html, attachments }) => {
  try {
    const result = await resend.emails.send({
      from: getFromAddress(),
      to: to,
      subject,
      html,
      attachments,
    });
    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Email sending failed:", {
      to,
      subject,
      message: error.message,
      name: error.name,
      statusCode: error.statusCode,
      response: error.response,
    });
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
