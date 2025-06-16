const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const verifyToken = require("../middleware/verifyToken");
const {
      createBooking ,
      getAllBookings,
      getUserBookings,
      getRenterBookings,
      updateBookingStatus
} = require("../controllers/bookingController");


// ✅ Create Booking
router.post("/", verifyToken, createBooking);
// ✅ Get All My Bookings-->user
router.get("/user", verifyToken, getUserBookings);
// ✅ Get All My Bookings-->renter
router.get("/renter", verifyToken, getRenterBookings);
// ✅ المؤجر يعدل حالة الحجز (قبول - رفض - إلغاء)
router.patch("/status/:bookingId", verifyToken, updateBookingStatus);
// Endpoint للأدمين فقط
// router.get("/", verifyToken, getAllBookings);
router.get("/", verifyToken, (req, res, next) => {
  if (!req.isAdmin) return res.status(403).json({ message: "Access denied" });
  getAllBookings(req, res);
});


module.exports = router;
