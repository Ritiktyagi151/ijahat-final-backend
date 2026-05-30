const bcrypt = require("bcryptjs");
const Admin = require("../src/models/Admin");

const seedAdmin = async () => {

  try {
    const adminEmail = process.env.ADMIN_EMAIL_DASH || process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD_DASH || process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log("Admin seed skipped: admin email/password missing");
      return;
    }

    const existingAdmin = await Admin.findOne({
      email: adminEmail
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      adminPassword,
      10
    );

    const admin = new Admin({
      email: adminEmail,
      password: hashedPassword
    });

    await admin.save();

    console.log("Default admin seeded successfully");

  } catch (error) {
    console.error("Admin seed error:", error);
  }

};

module.exports = seedAdmin;
