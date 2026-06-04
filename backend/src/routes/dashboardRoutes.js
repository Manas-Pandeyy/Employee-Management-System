const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { analytics } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/", protect, authorize("Admin", "HR"), analytics);

module.exports = router;
