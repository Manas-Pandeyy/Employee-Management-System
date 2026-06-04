const express = require("express");
const validate = require("../middleware/validate");
const audit = require("../middleware/auditMiddleware");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require("../controllers/departmentController");
const { departmentValidator, departmentIdValidator } = require("../validators/departmentValidators");

const router = express.Router();

router.use(protect);
router.get("/", getDepartments);
router.post("/", authorize("Admin", "HR"), departmentValidator, validate, audit("CREATE", "Department"), createDepartment);
router.put("/:id", authorize("Admin", "HR"), departmentIdValidator, departmentValidator, validate, audit("UPDATE", "Department"), updateDepartment);
router.delete("/:id", authorize("Admin"), departmentIdValidator, validate, audit("DELETE", "Department"), deleteDepartment);

module.exports = router;
