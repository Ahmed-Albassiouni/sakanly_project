const express = require("express");
const router = express.Router();
const multer = require("multer");
const propertyController = require("../controllers/propertyController");
const verifyToken = require("../middleware/verifyToken"); // ✅ ميدل وير التوكن
const {
  addProperty,
  getAllProperties,
  getOneProperty,
  updateProperty,
  deleteProperty
} = require("../controllers/propertyController");


// إعدادات رفع الصور
const storage = multer.diskStorage({
  destination: "./uploads",  // مكان حفظ الصور
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname); // إعادة تسمية الصور
  }
});
const upload = multer({ storage: storage });

// المسارات الخاصة بالعقارات
router.post("/",verifyToken, upload.array("images", 10), propertyController.addProperty); // إضافة
router.get("/", propertyController.getAllProperties);                        // جلب الكل
router.get("/:id", propertyController.getOneProperty);                       // جلب واحد
router.put("/:id",verifyToken, upload.array("images", 10), propertyController.updateProperty); // تعديل
router.delete("/:id",verifyToken, propertyController.deleteProperty);                    // حذف

module.exports = router;
