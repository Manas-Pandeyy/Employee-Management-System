const asyncHandler = require("../utils/asyncHandler");
const Employee = require("../models/Employee");
const Department = require("../models/Department");
const Attendance = require("../models/Attendance");

exports.analytics = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalEmployees, activeEmployees, departments, todayPresent, salaryByDepartment, recentEmployees] = await Promise.all([
    Employee.countDocuments(),
    Employee.countDocuments({ status: "Active" }),
    Department.countDocuments(),
    Attendance.countDocuments({ date: today, status: "Present" }),
    Employee.aggregate([
      { $group: { _id: "$department", totalSalary: { $sum: "$salary" }, employees: { $sum: 1 } } },
      { $lookup: { from: "departments", localField: "_id", foreignField: "_id", as: "department" } },
      { $unwind: "$department" },
      { $project: { department: "$department.name", totalSalary: 1, employees: 1, _id: 0 } }
    ]),
    Employee.find().populate("department").sort({ createdAt: -1 }).limit(5)
  ]);

  res.json({
    success: true,
    cards: {
      totalEmployees,
      activeEmployees,
      inactiveEmployees: totalEmployees - activeEmployees,
      departments,
      todayPresent
    },
    salaryByDepartment,
    recentEmployees
  });
});
