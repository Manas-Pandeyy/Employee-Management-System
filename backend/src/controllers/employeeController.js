const asyncHandler = require("../utils/asyncHandler");
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const { sendEmail } = require("../utils/email");

const buildEmployeeFilter = (query) => {
  const filter = {};
  if (query.department) filter.department = query.department;
  if (query.status) filter.status = query.status;
  if (query.role) filter.role = query.role;
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
      { designation: { $regex: query.search, $options: "i" } }
    ];
  }
  return filter;
};

exports.getEmployees = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 100);
  const skip = (page - 1) * limit;
  const filter = buildEmployeeFilter(req.query);

  const [employees, total] = await Promise.all([
    Employee.find(filter).populate("department").sort({ createdAt: -1 }).skip(skip).limit(limit),
    Employee.countDocuments(filter)
  ]);

  res.json({ success: true, employees, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

exports.getEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate("department");
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  res.json({ success: true, employee });
});

exports.createEmployee = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) payload.profilePicture = `/uploads/${req.file.filename}`;
  const employee = await Employee.create(payload);
  await employee.populate("department");
  await sendEmail({
    to: employee.email,
    subject: "Welcome to the Employee Management System",
    html: `<p>Hello ${employee.name}, your employee account has been created.</p>`
  });
  res.status(201).json({ success: true, employee });
});

exports.updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  const allowed = ["name", "email", "phone", "address", "department", "designation", "salary", "joiningDate", "status", "role"];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) employee[key] = req.body[key];
  });
  if (req.file) employee.profilePicture = `/uploads/${req.file.filename}`;
  await employee.save();
  await employee.populate("department");
  res.json({ success: true, employee });
});

exports.deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  await Attendance.deleteMany({ employee: employee._id });
  await employee.deleteOne();
  res.json({ success: true, message: "Employee deleted successfully" });
});

exports.exportEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find(buildEmployeeFilter(req.query)).populate("department").sort({ name: 1 });
  const headers = ["Name", "Email", "Phone", "Department", "Designation", "Salary", "Joining Date", "Status", "Role"];
  const escapeCsv = (value = "") => `"${String(value).replace(/"/g, '""')}"`;
  const rows = employees.map((employee) => [
    employee.name,
    employee.email,
    employee.phone,
    employee.department?.name,
    employee.designation,
    employee.salary,
    employee.joiningDate?.toISOString().slice(0, 10),
    employee.status,
    employee.role
  ]);
  const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=employees.csv");
  res.send(`\uFEFF${csv}`);
});
