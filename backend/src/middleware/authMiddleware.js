const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const Employee = require("../models/Employee");

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Not authorized, token missing");
  }

  const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
  const user = await Employee.findById(decoded.id).select("+password");
  if (!user || user.status !== "Active") {
    res.status(401);
    throw new Error("Not authorized");
  }

  req.user = user;
  next();
});

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403);
    throw new Error("Forbidden: insufficient permissions");
  }
  next();
};

module.exports = { protect, authorize };
