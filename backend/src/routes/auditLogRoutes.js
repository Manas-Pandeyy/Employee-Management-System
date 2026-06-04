const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { getAuditLogs } = require("../controllers/auditLogController");

const router = express.Router();

router.get("/", protect, authorize("Admin"), getAuditLogs);

module.exports = router;
