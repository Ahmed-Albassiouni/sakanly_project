
const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const User = require("../models/User");
const Property = require("../models/propertyModel");

// 1️⃣ - Get all users
router.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

// 2️⃣ - Block or unblock user
router.patch("/users/:id/block", isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.blocked = !user.blocked;
    await user.save();

    res.json({ message: user.blocked ? "User blocked" : "User unblocked" });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
});

// 3️⃣ - Delete user
router.delete("/users/:id", isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
});

// 4️⃣ - Delete property
router.delete("/properties/:id", isAdmin, async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting property", error: err.message });
  }
});

module.exports = router;
