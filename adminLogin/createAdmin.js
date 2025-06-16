const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

dotenv.config(); // تحميل المتغيرات من .env

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔗 Connected to MongoDB");

    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      return process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = new User({
      fullName: "Super Admin",
      email: "admin@example.com",
      password: hashedPassword,
      phoneNumber: "0123456789",
      nationalNumber: "12345678901234",
      role: "Admin"
    });

    await adminUser.save();
    console.log("✅ Admin created successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
};

createAdmin();
