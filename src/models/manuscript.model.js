const mongoose = require("mongoose");

const manuscriptSchema = new mongoose.Schema(
  {
    articleTitle: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    abstract: {
      type: String,
      required: true,
    },
    manuscriptFile: {
      filename: String,
      path: String,
      mimetype: String,
    },
    doi: {
      type: String,
      default: "",
    },
    volume: {
      type: String,
      default: "",
    },
    issueNumber: {
      type: String,
      default: "",
    },
    issueDate: {
      type: Date,
    },
    publicationDate: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Manuscript", manuscriptSchema);
