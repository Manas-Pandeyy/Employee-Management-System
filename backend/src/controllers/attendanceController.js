const asyncHandler = require("../utils/asyncHandler");
const Attendance = require("../models/Attendance");

const dateOnly = (value = new Date()) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

exports.markAttendance = asyncHandler(async (req, res) => {
  const employeeId = req.user.role === "Employee" ? req.user._id : req.body.employee || req.user._id;
  const date = dateOnly(req.body.date);
  const status = req.user.role === "Employee" ? "Present" : req.body.status || "Present";
  const shouldSetCheckIn = ["Present", "Half Day"].includes(status);
  const attendance = await Attendance.findOneAndUpdate(
    { employee: employeeId, date },
    {
      employee: employeeId,
      date,
      checkInTime: shouldSetCheckIn ? req.body.checkInTime ? new Date(req.body.checkInTime) : new Date() : null,
      checkOutTime: shouldSetCheckIn ? undefined : null,
      status
    },
    { upsert: true, new: true, runValidators: true }
  ).populate("employee", "name email designation");

  res.status(201).json({ success: true, attendance });
});

exports.checkOut = asyncHandler(async (req, res) => {
  const date = dateOnly();
  const attendance = await Attendance.findOneAndUpdate(
    { employee: req.user._id, date },
    { checkOutTime: new Date() },
    { new: true }
  );
  if (!attendance) {
    res.status(404);
    throw new Error("Check-in record not found for today");
  }
  res.json({ success: true, attendance });
});

exports.getHistory = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 100);
  const filter = {};
  if (req.user.role === "Employee") filter.employee = req.user._id;
  else if (req.query.employee) filter.employee = req.query.employee;

  const [records, total] = await Promise.all([
    Attendance.find(filter).populate("employee", "name email department").sort({ date: -1 }).skip((page - 1) * limit).limit(limit),
    Attendance.countDocuments(filter)
  ]);

  res.json({ success: true, records, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

exports.monthlyReport = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = Number(req.query.month) || now.getMonth() + 1;
  const year = Number(req.query.year) || now.getFullYear();
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  const match = { date: { $gte: start, $lt: end } };
  if (req.user.role === "Employee") match.employee = req.user._id;
  else if (req.query.employee) match.employee = req.query.employee;

  const report = await Attendance.aggregate([
    { $match: match },
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $project: { status: "$_id", count: 1, _id: 0 } }
  ]);

  const records = await Attendance.find(match).populate("employee", "name email").sort({ date: 1 });
  res.json({ success: true, month, year, report, records });
});

exports.statistics = asyncHandler(async (req, res) => {
  const today = dateOnly();
  const match = req.user.role === "Employee" ? { employee: req.user._id } : {};
  const [todayStats, overallStats] = await Promise.all([
    Attendance.aggregate([{ $match: { ...match, date: today } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    Attendance.aggregate([{ $match: match }, { $group: { _id: "$status", count: { $sum: 1 } } }])
  ]);
  res.json({ success: true, today: todayStats, overall: overallStats });
});
