const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/authMiddleware");
const { login, register, logout, me, updateProfile, changePassword, publicDepartments } = require("../controllers/authController");
const { loginValidator, registerValidator, changePasswordValidator } = require("../validators/authValidators");

const router = express.Router();

router.post("/login", loginValidator, validate, login);
router.post("/register", upload.single("profilePicture"), registerValidator, validate, register);
router.get("/public-departments", publicDepartments);
router.post("/logout", protect, logout);
router.get("/me", protect, me);
router.put("/profile", protect, upload.single("profilePicture"), updateProfile);
router.put("/change-password", protect, changePasswordValidator, validate, changePassword);

module.exports = router;
