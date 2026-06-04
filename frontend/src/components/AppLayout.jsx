import { Building2, CalendarCheck, ClipboardList, LayoutDashboard, LogOut, User, Users } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const canManage = ["Admin", "HR"].includes(user?.role);

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span>EMS</span>
          <small>{user?.role}</small>
        </div>
        <nav>
          {canManage && <NavLink to="/dashboard"><LayoutDashboard size={18} />Dashboard</NavLink>}
          {canManage && <NavLink to="/employees"><Users size={18} />Employees</NavLink>}
          <NavLink to="/departments"><Building2 size={18} />Departments</NavLink>
          <NavLink to="/attendance"><CalendarCheck size={18} />Attendance</NavLink>
          <NavLink to="/profile"><User size={18} />Profile</NavLink>
          {user?.role === "Admin" && <NavLink to="/audit-logs"><ClipboardList size={18} />Audit Logs</NavLink>}
        </nav>
        <button className="ghost danger" onClick={onLogout}><LogOut size={18} />Logout</button>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <p>Welcome back</p>
            <h1>{user?.name}</h1>
          </div>
          <span className="pill">{user?.designation}</span>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
