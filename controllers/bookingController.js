const Booking = require("../models/booking");
const Property = require("../models/propertyModel");



// ✅ Create Booking
const createBooking = async (req, res) => {
  try {
    const { propertyId, startDate, endDate } = req.body;
    const userId = req.userId; // تم استخلاصه من JWT middleware

     const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property not found" });

    // console.log("userId from token:", userId);
    // console.log("renter from property:", property.user);

    const newbooking = new Booking({
      property: propertyId,
      user: req.userId, //  جاي من التوكن، المستخدم اللي بيعمل الحجز
      renter: property.createdBy, // مالك العقار (اللي ضافه)
      startDate,
      endDate,

    });

    await newbooking.save();
    res.status(201).json({ message: "Booking created successfully", booking:newbooking });

  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
};

// ✅ Get all Bookings-->admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("property", "title location monthlyPrice")
      .populate("user", "name email"); // افترض إن الـ user فيه name وemail

    res.json({ message: "All bookings fetched", bookings });

  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

// ✅ Get Bookings by User -->My Bookings
const getUserBookings = async (req, res) => {
  try {
    const myBookings = await Booking.find({ user: req.userId })
      .populate("property", "title location monthlyPrice")
      .sort({ createdAt: -1 });

    res.json({ bookings: myBookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

// ✅ Get Bookings by renter -->My Bookings
const getRenterBookings = async (req, res) => {
  try {
    const renterId = req.userId;
    const bookings = await Booking.find({ renter: renterId }).populate("property").populate("user");
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};
// ✅ تحديث حالة الحجز (قبول، رفض، إلغاء)
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body; // القيم: Accepted, Rejected, Cancelled

    const updated = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    ).populate("user").populate("property");

    if (!updated) return res.status(404).json({ message: "Booking not found" });

    res.json({ message: `Booking status updated to ${status}`, booking: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error: error.message });
  }
};

module.exports = { 
    createBooking ,
    getAllBookings,
    getUserBookings,
    getRenterBookings,
    updateBookingStatus
};
