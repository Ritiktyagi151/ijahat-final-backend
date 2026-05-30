const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // ← sirf yeh line add karo
  },
});

const sendEmail = async ({ to, subject, html, attachments }) => {
  await transporter.sendMail({
    from: `"Journal Submission" <${process.env.ADMIN_EMAIL}>`,
    to: to || process.env.ADMIN_EMAIL,
    subject,
    html,
    attachments,
  });
};

exports.sendEmail = sendEmail;

exports.sendMailToAdmin = async ({ subject, html, attachments }) => {
  return sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
    attachments,
  });
};
