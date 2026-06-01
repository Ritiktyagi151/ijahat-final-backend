const NewsletterSubscriber = require("../models/newsletter.model");
const { sendEmail, sendMailToAdmin } = require("../utils/email.utils");
const {
  getAdminNotificationTemplate,
  getUserThankYouTemplate,
} = require("../utils/emailTemplates");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.subscribeNewsletter = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const source = req.body.source || "IJHAT Website";

    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    const existingSubscriber = await NewsletterSubscriber.findOne({ email });

    if (existingSubscriber) {
      return res.status(409).json({ message: "This email is already subscribed" });
    }

    const subscriber = await NewsletterSubscriber.create({ email, source });
    const date = new Date(subscriber.createdAt).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });
    const formData = {
      email,
      source,
      subject: "Newsletter Subscription",
      submissionDate: date,
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

    res.status(201).json({ message: "Newsletter subscription successful" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "This email is already subscribed" });
    }

    console.error("Newsletter subscription error:", error);
    res.status(500).json({ message: "Newsletter subscription failed" });
  }
};
