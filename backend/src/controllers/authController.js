const asyncHandler = require("../utils/asyncHandler");
const Employee = require("../models/Employee");
const Department = require("../models/Department");
const { signToken } = require("../utils/token");

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  department: user.department,
  designation: user.designation,
  salary: user.salary,
  joiningDate: user.joiningDate,
  status: user.status,
  role: user.role,
  profilePicture: user.profilePicture
});

exports.login = asyncHandler(async (req, res) => {
  const user = await Employee.findOne({ email: req.body.email }).select("+password").populate("department");
  if (!user || !(await user.matchPassword(req.body.password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  if (user.status !== "Active") {
    res.status(403);
    throw new Error("Your account is inactive");
  }

  res.json({ success: true, token: signToken(user), user: publicUser(user) });
});

exports.register = asyncHandler(async (req, res) => {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    address: req.body.address,
    department: req.body.department,
    designation: req.body.designation,
    salary: 0,
    joiningDate: new Date(),
    role: "Employee",
    status: "Active"
  };

  if (req.file) payload.profilePicture = `/uploads/${req.file.filename}`;

  const user = await Employee.create(payload);
  await user.populate("department");

  res.status(201).json({
    success: true,
    token: signToken(user),
    user: publicUser(user)
  });
});

exports.publicDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find().sort({ name: 1 });
  res.json({ success: true, departments });
});

exports.logout = (req, res) => {
  res.json({ success: true, message: "Logged out successfully. Remove the token on the client." });
};

exports.me = asyncHandler(async (req, res) => {
  const user = await Employee.findById(req.user._id).populate("department");
  res.json({ success: true, user: publicUser(user) });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "phone", "address"];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) req.user[key] = req.body[key];
  });
  if (req.file) req.user.profilePicture = `/uploads/${req.file.filename}`;
  const saved = await req.user.save();
  await saved.populate("department");
  res.json({ success: true, user: publicUser(saved) });
});

exports.changePassword = asyncHandler(async (req, res) => {
  if (!(await req.user.matchPassword(req.body.currentPassword))) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }
  req.user.password = req.body.newPassword;
  await req.user.save();
  res.json({ success: true, message: "Password changed successfully" });
});
