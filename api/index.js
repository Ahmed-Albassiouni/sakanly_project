const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
require("dotenv").config();
const bodyParser = require("body-parser");
const path = require("path");
const propertyRoutes = require("./routes/propertyRoutes");
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookingRoutes");
const adminAuthRoutes = require("./routes/adminAuth");
const adminRoutes = require("./routes/adminRoutes");
const index=require("./api/index");

// api/index.js
export default function handler(req, res) {
  res.status(200).json({ message: "Hello from API!" });
}

//test
// إعدادات عامة
const app = express();
app.use(express.json());      // قراءة body بصيغة JSON
app.use(cors());  // لتفعيل الوصول من أي دومين
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // إتاحة الصور علنًا

// الاتصال بـ MongoDB
const url = process.env.MONGO_URI;
mongoose.connect(url)
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:",err));

// Routes

//الروتر الخاص ب تسجيل الدخول
app.use("/api/auth", authRoutes);
// ربط الروتر الخاص بالعقارات
app.use("/api/properties", propertyRoutes);
//الروتر الخاص ب الحجوزات
app.use("/api/bookings", bookingRoutes);
// ربط الراوتر الخاص بتسجيل الأدمين
app.use("/api/admin", adminAuthRoutes); 
//ربط الروتر الخاص ب التحكم في اليوزر
app.use("/api/admin", adminRoutes);



