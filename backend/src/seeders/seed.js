const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Department = require("../models/Department");
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const AuditLog = require("../models/AuditLog");

dotenv.config();

const run = async () => {
  await connectDB();
  await Promise.all([Department.deleteMany(), Employee.deleteMany(), Attendance.deleteMany(), AuditLog.deleteMany()]);

  const departments = await Department.insertMany([
    { name: "Engineering", description: "Product engineering and platform delivery" },
    { name: "Human Resources", description: "Hiring, employee relations, and policy" },
    { name: "Finance", description: "Payroll, accounting, and compliance" },
    { name: "Sales", description: "Revenue operations and account management" }
  ]);

  const [engineering, hr, finance, sales] = departments;
  const employees = await Employee.create([
    {
      name: "Admin User",
      email: "admin@example.com",
      password: "Admin@12345",
      phone: "9876543210",
      address: "Mumbai, India",
      department: hr._id,
      designation: "System Administrator",
      salary: 120000,
      joiningDate: "2022-01-10",
      role: "Admin"
    },
    {
      name: "HR Manager",
      email: "hr@example.com",
      password: "Hr@12345",
      phone: "9876543211",
      address: "Pune, India",
      department: hr._id,
      designation: "HR Manager",
      salary: 90000,
      joiningDate: "2022-04-15",
      role: "HR"
    },
    {
      name: "Aarav Sharma",
      email: "employee@example.com",
      password: "Employee@12345",
      phone: "9876543212",
      address: "Bengaluru, India",
      department: engineering._id,
      designation: "Software Engineer",
      salary: 75000,
      joiningDate: "2023-07-01",
      role: "Employee"
    },
    {
      name: "Neha Verma",
      email: "neha@example.com",
      password: "Employee@12345",
      phone: "9876543213",
      address: "Delhi, India",
      department: finance._id,
      designation: "Accountant",
      salary: 65000,
      joiningDate: "2023-09-12",
      role: "Employee"
    },
    {
      name: "Rohan Patel",
      email: "rohan@example.com",
      password: "Employee@12345",
      phone: "9876543214",
      address: "Ahmedabad, India",
      department: sales._id,
      designation: "Sales Executive",
      salary: 62000,
      joiningDate: "2024-02-19",
      role: "Employee"
    }
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await Attendance.insertMany(
    employees.map((employee, index) => ({
      employee: employee._id,
      date: today,
      checkInTime: new Date(today.getTime() + (9 + index * 0.1) * 60 * 60 * 1000),
      status: index === 4 ? "Half Day" : "Present"
    }))
  );

  console.log("Seed complete");
  console.log("Admin: admin@example.com / Admin@12345");
  console.log("HR: hr@example.com / Hr@12345");
  console.log("Employee: employee@example.com / Employee@12345");
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
