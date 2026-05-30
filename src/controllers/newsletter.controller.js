const path = require("path");
const NewsletterSubscriber = require("../models/newsletter.model");
const { sendEmail, sendMailToAdmin } = require("../utils/email.utils");
const {
  createNewsletterAdminEmail,
  createNewsletterSubscriberEmail,
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
    const logoPath = path.join(__dirname, "../../../frontend/src/assets/logo.png");
    const logoAttachment = {
      filename: "logo.png",
      path: logoPath,
      cid: "ijhat-logo",
    };

    await Promise.all([
      sendEmail({
        to: email,
        subject: "Newsletter Subscription Successful",
        html: createNewsletterSubscriberEmail({ email }),
        attachments: [logoAttachment],
      }),
      sendMailToAdmin({
        subject: "New Newsletter Subscriber",
        html: createNewsletterAdminEmail({ email, date, source }),
        attachments: [logoAttachment],
      }),
    ]);

    res.status(201).json({ message: "Newsletter subscription successful" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "This email is already subscribed" });
    }

    console.error("Newsletter subscription error:", error);
    res.status(500).json({ message: "Newsletter subscription failed" });
  }
};
