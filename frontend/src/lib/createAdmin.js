const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createSuperAdmin = async () => {
  try {
    const adminEmail = "superadmin@hospital.com";
    const adminPassword = "Admin@123";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      await User.create({
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      console.log("✅ Super Admin Created");
      console.log("📧 Email:", adminEmail);
      console.log("🔑 Password:", adminPassword);
    }
  } catch (error) {
    console.log("Admin creation error:", error.message);
  }
};

module.exports = createSuperAdmin;
