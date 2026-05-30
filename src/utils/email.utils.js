const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // ← 'service' hatao, yeh daalo
  port: 587, // ← 465 ki jagah 587
  secure: false, // ← 587 ke liye false hona chahiye
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
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
