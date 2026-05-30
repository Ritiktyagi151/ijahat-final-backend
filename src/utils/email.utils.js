const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html, attachments }) => {
  await resend.emails.send({
    from: "Journal Submission <onboarding@resend.dev>",
    to: to || process.env.ADMIN_EMAIL,
    subject,
    html,
  });
};

exports.sendEmail = sendEmail;

exports.sendMailToAdmin = async ({ subject, html, attachments }) => {
  return sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
  });
};
