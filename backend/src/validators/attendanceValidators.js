const { body, query } = require("express-validator");

exports.markAttendanceValidator = [
  body("employee").optional().isMongoId().withMessage("Invalid employee id"),
  body("date").optional().isISO8601().withMessage("Invalid date"),
  body("status").optional().isIn(["Present", "Absent", "Half Day", "On Leave"])
];

exports.reportValidator = [
  query("month").optional().isInt({ min: 1, max: 12 }),
  query("year").optional().isInt({ min: 2000, max: 2100 })
];
