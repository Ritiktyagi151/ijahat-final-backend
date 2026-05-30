const Manuscript = require("../models/manuscript.model");
const { sendEmail, sendMailToAdmin } = require("../utils/email.utils");
const {
  createAdminNotificationEmail,
  createManuscriptAcceptedEmail,
  createManuscriptRejectedEmail,
  createUserThankYouEmail,
} = require("../utils/emailTemplates");
const path = require("path");

exports.submitManuscript = async (req, res) => {
  console.log("Submit Api call");

  try {
    const { articleTitle, authorName, email, address, abstract } = req.body;
    const file = req.file;
    const submissionDate = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "";

    if (!file) {
      return res.status(400).json({ message: "Manuscript file required" });
    }

    const manuscript = await Manuscript.create({
      articleTitle,
      authorName,
      email,
      address,
      abstract,
      status: "pending",
      manuscriptFile: {
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
      },
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
        subject: "Thank You for Contacting IJHAT",
        html: createUserThankYouEmail({
          firstName: authorName?.split(" ")[0] || authorName,
          fullName: authorName,
          email,
          subject: articleTitle,
        }),
        attachments: [logoAttachment],
      }),
      sendMailToAdmin({
        subject: "New Form Submission Received",
        html: createAdminNotificationEmail({
          fullName: authorName,
          email,
          subject: articleTitle,
          message: abstract,
          date: submissionDate,
          ipAddress,
          viewUrl: process.env.ADMIN_SUBMISSIONS_URL || "http://localhost:5174",
        }),
        attachments: [
          logoAttachment,
          {
            filename: file.originalname,
            path: file.path,
          },
        ],
      }),
    ]);

    manuscript.emailSent = true;
    await manuscript.save();

    res.status(201).json({
      message: "Manuscript submitted successfully",
      submissionId: manuscript._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Submission failed" });
  }
};

exports.getAllManuscripts = async (req, res) => {
  try {
    const data = await Manuscript.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Data fetch failed" });
  }
};

exports.approveManuscript = async (req, res) => {
  try {
    const manuscript = await Manuscript.findById(req.params.id);

    if (!manuscript) {
      return res.status(404).json({ message: "Manuscript not found" });
    }

    manuscript.status = "approved";
    manuscript.publicationDate = manuscript.publicationDate || new Date();
    manuscript.issueDate = manuscript.issueDate || new Date();
    manuscript.volume = manuscript.volume || `Volume ${new Date().getFullYear()}`;
    manuscript.issueNumber = manuscript.issueNumber || "Issue 1";
    manuscript.doi =
      manuscript.doi ||
      `10.555/ijhat.${new Date().getFullYear()}.${manuscript._id
        .toString()
        .slice(-6)}`;
    await manuscript.save();

    const logoPath = path.join(__dirname, "../../../frontend/src/assets/logo.png");
    const logoAttachment = {
      filename: "logo.png",
      path: logoPath,
      cid: "ijhat-logo",
    };

    await sendEmail({
      to: manuscript.email,
      subject: "IJHAT Manuscript Accepted",
      html: createManuscriptAcceptedEmail({
        authorName: manuscript.authorName,
        articleTitle: manuscript.articleTitle,
        doi: manuscript.doi,
        volume: manuscript.volume,
        issueNumber: manuscript.issueNumber,
        archiveUrl: process.env.PUBLIC_ARCHIVE_URL || "http://localhost:5173/archives",
      }),
      attachments: [logoAttachment],
    });

    res.json({ message: "Manuscript approved and author notified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Approval failed" });
  }
};

exports.rejectManuscript = async (req, res) => {
  try {
    const manuscript = await Manuscript.findById(req.params.id);

    if (!manuscript) {
      return res.status(404).json({ message: "Manuscript not found" });
    }

    manuscript.status = "rejected";
    manuscript.rejectionReason = req.body.reason || "";
    await manuscript.save();

    const logoPath = path.join(__dirname, "../../../frontend/src/assets/logo.png");
    const logoAttachment = {
      filename: "logo.png",
      path: logoPath,
      cid: "ijhat-logo",
    };

    await sendEmail({
      to: manuscript.email,
      subject: "IJHAT Manuscript Decision",
      html: createManuscriptRejectedEmail({
        authorName: manuscript.authorName,
        articleTitle: manuscript.articleTitle,
        reason: manuscript.rejectionReason,
      }),
      attachments: [logoAttachment],
    });

    res.json({ message: "Rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Reject failed" });
  }
};
exports.getApprovedManuscripts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 0;
    const query = Manuscript.find({ status: "approved" }).sort({
      publicationDate: -1,
      createdAt: -1,
    });

    if (limit > 0) {
      query.limit(limit);
    }

    const data = await query;

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Archive fetch failed" });
  }
};
exports.deleteManuscript = async (req, res) => {
  try {
    const manuscript = await Manuscript.findByIdAndDelete(req.params.id);

    if (!manuscript) {
      return res.status(404).json({ message: "Manuscript not found" });
    }

    res.json({ message: "Manuscript deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};
