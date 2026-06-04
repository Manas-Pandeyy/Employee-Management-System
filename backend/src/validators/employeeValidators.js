const { body, param } = require("express-validator");

exports.employeeIdValidator = [param("id").isMongoId().withMessage("Invalid employee id")];

exports.createEmployeeValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("department").isMongoId().withMessage("Valid department is required"),
  body("designation").trim().notEmpty().withMessage("Designation is required"),
  body("salary").isFloat({ min: 0 }).withMessage("Salary must be non-negative"),
  body("joiningDate").isISO8601().withMessage("Joining date is required"),
  body("role").optional().isIn(["Admin", "HR", "Employee"]),
  body("status").optional().isIn(["Active", "Inactive"])
];

exports.updateEmployeeValidator = [
  body("email").optional().isEmail().normalizeEmail(),
  body("department").optional().isMongoId(),
  body("salary").optional().isFloat({ min: 0 }),
  body("role").optional().isIn(["Admin", "HR", "Employee"]),
  body("status").optional().isIn(["Active", "Inactive"])
];
