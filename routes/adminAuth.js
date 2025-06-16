
const express = require("express");
const router = express.Router();
const { registerAdmin , loginAdmin} = require("../controllers/adminController");

// ✅ Route to register Admin
router.post("/register", registerAdmin); // POST /api/admin/register

// ✅ Route to Login Admin
router.post("/login", loginAdmin);

module.exports = router;
