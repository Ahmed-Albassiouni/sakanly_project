const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Admin Register Controller
const registerAdmin = async (req, res) => {
  const { fullName, email, password, phoneNumber, nationalNumber, adminKey } = req.body;

  if (adminKey !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: "Invalid admin key" });
  }

  try {
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      fullName,
      email,
      phoneNumber,
      nationalNumber,
      password: hashedPassword,
      role: "Admin",
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering admin", error: error.message });
  }
};

// ✅ Admin Login Controller
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email });
    if (!admin || admin.role !== "Admin") {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
        email: admin.email,
        isAdmin: true
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin
};
