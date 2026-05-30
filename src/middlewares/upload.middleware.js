const multer = require("multer");
const fs = require("fs");

fs.mkdirSync("uploads", { recursive: true });

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    // Replace spaces with dashes to prevent URL issues
    const safeName = file.originalname.replace(/\s+/g, '-');
    cb(null, Date.now() + "-" + safeName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    // Documents (Keep these if you use this middleware for manuscript uploads too)
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    // ADDED IMAGES: Allow profile pictures
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp"
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, PDF, and DOC are allowed."), false);
  }
};

module.exports = multer({ storage, fileFilter });
