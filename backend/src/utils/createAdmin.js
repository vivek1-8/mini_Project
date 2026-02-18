const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createSuperAdmin = async () => {
  try {
    const adminEmail = "superadmin@hospital.com";
    const adminPassword = "Admin@123";

    // ✅ CHECK IF ADMIN EXISTS
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("ℹ️ Super Admin already exists");
      return;
    }

    // ✅ HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // ✅ CREATE ADMIN
    await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Super Admin Created Successfully");
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password:", adminPassword);

  } catch (error) {
    console.log("❌ Admin creation error:", error.message);
  }
};

module.exports = createSuperAdmin;
