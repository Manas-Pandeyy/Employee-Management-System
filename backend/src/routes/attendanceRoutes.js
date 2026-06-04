const express = require("express");
const validate = require("../middleware/validate");
const audit = require("../middleware/auditMiddleware");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  markAttendance,
  checkOut,
  getHistory,
  monthlyReport,
  statistics
} = require("../controllers/attendanceController");
const { markAttendanceValidator, reportValidator } = require("../validators/attendanceValidators");

const router = express.Router();

router.use(protect);
router.post("/mark", markAttendanceValidator, validate, audit("MARK", "Attendance"), markAttendance);
router.put("/checkout", audit("CHECKOUT", "Attendance"), checkOut);
router.get("/history", getHistory);
router.get("/monthly-report", reportValidator, validate, monthlyReport);
router.get("/statistics", statistics);
router.post("/admin-mark", authorize("Admin", "HR"), markAttendanceValidator, validate, audit("ADMIN_MARK", "Attendance"), markAttendance);

module.exports = router;
