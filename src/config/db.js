const mongoose = require("mongoose");
const seedAdmin = require("../../seeds/admin.seed");

const getMongoUri = () => {
  const mongoUri = (process.env.MONGO_URI || "")
    .trim()
    .replace(/^MONGO_URI=/, "")
    .replace(/^["']|["']$/g, "");

  if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
    throw new Error('Invalid MONGO_URI. It must start with "mongodb://" or "mongodb+srv://".');
  }

  return mongoUri;
};

const connectDB = async () => {
  await mongoose.connect(getMongoUri());
  await seedAdmin();
  console.log("MongoDB Connected");
};

module.exports = connectDB;
