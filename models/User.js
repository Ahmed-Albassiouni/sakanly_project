const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  nationalNumber: { type: String },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["User", "Renter", "Guest", "Admin"],
    required: true
  },
  blocked: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", userSchema);
