const mongoose = require("mongoose");

// إنشاء مخطط (Schema) لتمثيل بيانات العقار
const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },          // عنوان العقار
  type: { type: String, required: true },           // نوع العقار (شقة، فيلا، ... إلخ)
  status: { type: String, required: true },         // حالة العقار (متاح - غير متاح)
  location: { type: String, required: true },       // الموقع
  monthlyPrice: { type: Number, required: true },   // السعر الشهري
  specialOffer: { type: Boolean, default: false },  // هل عليه عرض خاص
  features: { type: [String], default: [] },        // الخصائص (غرف - حمامات ... إلخ)
  description: { type: String },                    // وصف العقار
  images: { type: [String], default: [] },          // أسماء الصور المرفوعة
  // ✅ إضافة اليوزر (صاحب العقار)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",       // لازم يكون عندك موديل User
    required: true
  }
}, { timestamps: true });                           // تاريخ الإنشاء والتحديث تلقائيًا

// تصدير الموديل باسم "Property"
module.exports = mongoose.model("Property", propertySchema);
