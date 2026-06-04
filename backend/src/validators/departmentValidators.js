const { body, param } = require("express-validator");

exports.departmentIdValidator = [param("id").isMongoId().withMessage("Invalid department id")];
exports.departmentValidator = [
  body("name").trim().notEmpty().withMessage("Department name is required"),
  body("description").optional().trim().isLength({ max: 500 })
];
