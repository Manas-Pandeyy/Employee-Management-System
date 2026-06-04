const asyncHandler = require("../utils/asyncHandler");
const AuditLog = require("../models/AuditLog");

exports.getAuditLogs = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const [logs, total] = await Promise.all([
    AuditLog.find().populate("actor", "name email role").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    AuditLog.countDocuments()
  ]);
  res.json({ success: true, logs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});
