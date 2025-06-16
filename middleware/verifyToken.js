const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // التوكين بيكون في الهيدر تحت اسم "token"
  const token = req.header("token");

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // هنا بنستخرج الـ id من//  التوكن
    req.isAdmin = decoded.isAdmin || false; // لازم تضيف isAdmin في وقت إنشاء التوكن
    next();                 // كمل على الـ endpoint اللي بعد الميدل وير
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = verifyToken;
