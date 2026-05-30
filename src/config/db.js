const mongoose = require("mongoose");
const seedAdmin = require("../../seeds/admin.seed");
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await seedAdmin();
  console.log("MongoDB Connected");
};

module.exports = connectDB;
