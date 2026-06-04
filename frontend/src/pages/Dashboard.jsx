import { useEffect, useState } from "react";
import api from "../api/axios";
import { ErrorMessage, Loading, StatCard } from "../components/Ui.jsx";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard").then((res) => setData(res.data)).catch((err) => setError(err.response?.data?.message || "Unable to load dashboard"));
  }, []);

  if (!data && !error) return <Loading />;

  return (
    <section>
      <ErrorMessage message={error} />
      {data && (
        <>
          <div className="stats-grid">
            <StatCard label="Total Employees" value={data.cards.totalEmployees} />
            <StatCard label="Active" value={data.cards.activeEmployees} tone="green" />
            <StatCard label="Inactive" value={data.cards.inactiveEmployees} tone="red" />
            <StatCard label="Departments" value={data.cards.departments} />
            <StatCard label="Present Today" value={data.cards.todayPresent} tone="blue" />
          </div>
          <div className="grid two">
            <div className="panel">
              <h2>Salary by Department</h2>
              <table>
                <thead><tr><th>Department</th><th>Employees</th><th>Total Salary</th></tr></thead>
                <tbody>{data.salaryByDepartment.map((row) => <tr key={row.department}><td>{row.department}</td><td>{row.employees}</td><td>{row.totalSalary}</td></tr>)}</tbody>
              </table>
            </div>
            <div className="panel">
              <h2>Recent Employees</h2>
              <table>
                <thead><tr><th>Name</th><th>Department</th><th>Status</th></tr></thead>
                <tbody>{data.recentEmployees.map((emp) => <tr key={emp._id}><td>{emp.name}</td><td>{emp.department?.name}</td><td><span className={`status ${emp.status}`}>{emp.status}</span></td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Dashboard;
