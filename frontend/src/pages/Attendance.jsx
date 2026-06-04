import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";
import { EmptyState, ErrorMessage, StatCard } from "../components/Ui.jsx";

const Attendance = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [report, setReport] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState("");
  const [status, setStatus] = useState("Present");
  const [error, setError] = useState("");
  const canManage = ["Admin", "HR"].includes(user.role);

  const load = async () => {
    try {
      const [history, monthly] = await Promise.all([
        api.get("/attendance/history", { params: { employee } }),
        api.get("/attendance/monthly-report", { params: { employee } })
      ]);
      setRecords(history.data.records);
      setReport(monthly.data.report);
      if (canManage) {
        const empRes = await api.get("/employees", { params: { limit: 100 } });
        setEmployees(empRes.data.employees);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load attendance");
    }
  };

  useEffect(() => { load(); }, [employee]);

  const mark = async () => {
    await api.post(canManage ? "/attendance/admin-mark" : "/attendance/mark", canManage ? { employee, status } : {});
    load();
  };

  const checkout = async () => {
    await api.put("/attendance/checkout");
    load();
  };

  const count = (status) => report.find((item) => item.status === status)?.count || 0;

  return (
    <section>
      <ErrorMessage message={error} />
      <div className="stats-grid">
        <StatCard label="Present" value={count("Present")} tone="green" />
        <StatCard label="Absent" value={count("Absent")} tone="red" />
        <StatCard label="Half Day" value={count("Half Day")} tone="blue" />
        <StatCard label="On Leave" value={count("On Leave")} />
      </div>
      <div className="panel">
        <div className="section-head">
          <h2>Attendance</h2>
          <div className="actions">
            {canManage && <select value={employee} onChange={(e) => setEmployee(e.target.value)}><option value="">Self / All</option>{employees.map((emp) => <option key={emp._id} value={emp._id}>{emp.name}</option>)}</select>}
            {canManage && <select value={status} onChange={(e) => setStatus(e.target.value)}><option>Present</option><option>Absent</option><option>Half Day</option><option>On Leave</option></select>}
            <button onClick={mark}>Mark Attendance</button>
            <button className="secondary" onClick={checkout}>Check Out</button>
          </div>
        </div>
        {records.length === 0 ? <EmptyState /> : (
          <table>
            <thead><tr><th>Employee</th><th>Date</th><th>Check In</th><th>Check Out</th><th>Status</th></tr></thead>
            <tbody>{records.map((rec) => <tr key={rec._id}><td>{rec.employee?.name}</td><td>{rec.date?.slice(0, 10)}</td><td>{rec.checkInTime ? new Date(rec.checkInTime).toLocaleTimeString() : "-"}</td><td>{rec.checkOutTime ? new Date(rec.checkOutTime).toLocaleTimeString() : "-"}</td><td><span className={`status ${rec.status}`}>{rec.status}</span></td></tr>)}</tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default Attendance;
