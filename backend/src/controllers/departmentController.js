const asyncHandler = require("../utils/asyncHandler");
const Department = require("../models/Department");
const Employee = require("../models/Employee");

exports.getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.aggregate([
    { $lookup: { from: "employees", localField: "_id", foreignField: "department", as: "employees" } },
    { $addFields: { employeeCount: { $size: "$employees" } } },
    { $project: { employees: 0 } },
    { $sort: { name: 1 } }
  ]);
  res.json({ success: true, departments });
});

exports.createDepartment = asyncHandler(async (req, res) => {
  const department = await Department.create(req.body);
  res.status(201).json({ success: true, department });
});

exports.updateDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!department) {
    res.status(404);
    throw new Error("Department not found");
  }
  res.json({ success: true, department });
});

exports.deleteDepartment = asyncHandler(async (req, res) => {
  const used = await Employee.exists({ department: req.params.id });
  if (used) {
    res.status(400);
    throw new Error("Cannot delete a department assigned to employees");
  }
  const department = await Department.findByIdAndDelete(req.params.id);
  if (!department) {
    res.status(404);
    throw new Error("Department not found");
  }
  res.json({ success: true, message: "Department deleted successfully" });
});
