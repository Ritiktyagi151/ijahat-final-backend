const fs = require("fs/promises");
const Manuscript = require("../models/manuscript.model");
const { sendEmail, sendMailToAdmin } = require("../utils/email.utils");
const {
  createManuscriptAcceptedEmail,
  createManuscriptRejectedEmail,
  getAdminNotificationTemplate,
  getUserThankYouTemplate,
} = require("../utils/emailTemplates");

const manuscriptMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const createManuscriptAttachment = async (file) => {
  if (!file || !manuscriptMimeTypes.has(file.mimetype)) {
    throw new Error("Invalid manuscript file type. Only PDF, DOC, and DOCX files are allowed.");
  }

  const fileBuffer = file.buffer || (await fs.readFile(file.path));
  const filename = file.originalname || file.filename;

  console.log("Admin manuscript attachment:", {
    filename,
    sizeBytes: fileBuffer.length,
    mimetype: file.mimetype,
  });

  return {
    filename,
    content: fileBuffer.toString("base64"),
  };
};

exports.submitManuscript = async (req, res) => {
  console.log("Submit Api call");

  try {
    const {
      articleTitle,
      authorName,
      email,
      address,
      abstract,
      phone = "",
      country = "",
      institution = "",
    } = req.body;
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

    if (!manuscriptMimeTypes.has(file.mimetype)) {
      return res.status(400).json({ message: "Only PDF, DOC, and DOCX manuscript files are allowed" });
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

    const formData = {
      ...req.body,
      fullName: authorName,
      email,
      phone,
      country,
      institution,
      subject: articleTitle,
      articleTitle,
      address,
      abstract,
      manuscriptFile: file.originalname,
      submissionId: manuscript._id.toString(),
      submissionDate,
      currentStatus: "Received",
      ipAddress,
    };

    if (process.env.SEND_USER_CONFIRMATION !== "false") {
      await sendEmail({
        to: email,
        subject: "Thank You For Your Submission",
        html: getUserThankYouTemplate(formData),
      });
    }

    const manuscriptAttachment = await createManuscriptAttachment(file);

    await sendMailToAdmin({
      subject: "New Submission Received",
      html: getAdminNotificationTemplate(formData),
      attachments: [manuscriptAttachment],
    });

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

    await sendEmail({
      to: manuscript.email,
      subject: "IJHAT Manuscript Decision",
      html: createManuscriptRejectedEmail({
        authorName: manuscript.authorName,
        articleTitle: manuscript.articleTitle,
        reason: manuscript.rejectionReason,
      }),
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
