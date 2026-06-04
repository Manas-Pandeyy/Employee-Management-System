const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const validate = require("../middleware/validate");
const audit = require("../middleware/auditMiddleware");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  exportEmployees
} = require("../controllers/employeeController");
const {
  createEmployeeValidator,
  updateEmployeeValidator,
  employeeIdValidator
} = require("../validators/employeeValidators");

const router = express.Router();

router.use(protect);
router.get("/", authorize("Admin", "HR"), getEmployees);
router.get("/export", authorize("Admin", "HR"), exportEmployees);
router.get("/:id", employeeIdValidator, validate, authorize("Admin", "HR"), getEmployee);
router.post(
  "/",
  authorize("Admin", "HR"),
  upload.single("profilePicture"),
  createEmployeeValidator,
  validate,
  audit("CREATE", "Employee"),
  createEmployee
);
router.put(
  "/:id",
  authorize("Admin", "HR"),
  upload.single("profilePicture"),
  employeeIdValidator,
  updateEmployeeValidator,
  validate,
  audit("UPDATE", "Employee"),
  updateEmployee
);
router.delete("/:id", authorize("Admin"), employeeIdValidator, validate, audit("DELETE", "Employee"), deleteEmployee);

module.exports = router;
