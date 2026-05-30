const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/auth.routes");
const adminRoutes = require("./src/routes/admin.routes");
const userRoutes = require("./src/routes/user.routes");
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:8000", // ← Admin ke liye add karo
  "http://127.0.0.1:8000",
  "https://ijaht.com",
  "https://www.ijaht.com", // ← yeh bhi
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);

// Admin Login API
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contact", require("./src/routes/contact.routes"));
app.use("/api/newsletter", require("./src/routes/newsletter.routes"));
// Manuscript APIs
app.use("/api/manuscript", require("./src/routes/manuscript.routes"));

// Uploaded files
app.use("/uploads", express.static("uploads"));

module.exports = app;
