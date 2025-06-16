const Property = require("../models/propertyModel");

// ➕ إضافة عقار جديد
const addProperty = async (req, res) => {
  try {
    // جلب البيانات من الطلب
    const {
      title, type, status, location, monthlyPrice, specialOffer, features, description
    } = req.body;

    // ✅ تحقق إذا كان العقار مضاف قبل كده (بناءً على العنوان والموقع مثلًا)
    const existingProperty = await Property.findOne({ title, location });
    if (existingProperty) {
      return res.status(400).json({
        message: "Property already exists at this location"
      })}
    

    // استخراج أسماء الصور المرفوعة
    const images = req.files.map(file => file.filename);

    // إنشاء كائن جديد للعقار
    // const newProperty = new Property({
    //   title, type, status, location, monthlyPrice,
    //   specialOffer: specialOffer === "true", // تحويل من string إلى boolean
    //   features: JSON.parse(features),        // تحويل النص إلى array
    //   description,
    //   images
    // });
    const newProperty = new Property({
    title: req.body.title,
    type: req.body.type,
    status: req.body.status,
    location: req.body.location,
    monthlyPrice: req.body.monthlyPrice,
    specialOffer: req.body.specialOffer || false,
    features: Array.isArray(req.body.features) ? req.body.features : [],
    description: req.body.description || "",
    images: Array.isArray(req.files)
      ? req.files.map(file => file.filename)
      : (req.body.images || []),
     createdBy: req.userId // ⬅️ من التوكن
  });


    // حفظ العقار في قاعدة البيانات
    const saved = await newProperty.save();

    res.status(201).json({ message: "Property added", property: saved });
  } catch (error) {
    res.status(500).json({ message: "Failed to add property", error: error.message });
  }
};

// 📄 جلب جميع العقارات
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 }); // ترتيب الأحدث أولاً
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching properties", error });
  }
};

// 📄 جلب عقار واحد فقط
const getOneProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Not found" });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Error fetching property", error });
  }
};

// 📝 تحديث بيانات العقار
const updateProperty = async (req, res) => {
  try {
    const {
      title, type, status, location, monthlyPrice, specialOffer, features, description
    } = req.body;

    // الصور الجديدة (لو فيه)
    const images = req.files ? req.files.map(file => file.filename) : [];

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      {
        
        title, type, status, location, monthlyPrice,
        specialOffer: specialOffer === "true",
        features: features
          ? (Array.isArray(features) ? features : JSON.parse(features))
          : [],
        description,
        ...(images.length > 0 && { images }) // لو فيه صور جديدة هنضيفها
      },
      { new: true } // يرجع النسخة بعد التعديل
    );

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Property updated", property: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating property", error: error.message });
  }
};

// ❌ حذف عقار
const deleteProperty = async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Property deleted", property: deleted });
  } catch (error) {
    res.status(500).json({ message: "Error deleting property", error });
  }
};

module.exports={
    addProperty,
    getAllProperties,
    getOneProperty,
    updateProperty,
    deleteProperty

}