import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import AppLayout from "./components/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Employees from "./pages/Employees.jsx";
import EmployeeForm from "./pages/EmployeeForm.jsx";
import EmployeeDetails from "./pages/EmployeeDetails.jsx";
import Departments from "./pages/Departments.jsx";
import Attendance from "./pages/Attendance.jsx";
import Profile from "./pages/Profile.jsx";
import AuditLogs from "./pages/AuditLogs.jsx";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<ProtectedRoute roles={["Admin", "HR"]} />}>
                <Route index element={<Dashboard />} />
              </Route>
              <Route path="/employees" element={<ProtectedRoute roles={["Admin", "HR"]} />} >
                <Route index element={<Employees />} />
                <Route path="new" element={<EmployeeForm />} />
                <Route path=":id" element={<EmployeeDetails />} />
                <Route path=":id/edit" element={<EmployeeForm />} />
              </Route>
              <Route path="/departments" element={<Departments />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/audit-logs" element={<ProtectedRoute roles={["Admin"]} />} >
                <Route index element={<AuditLogs />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
