import { Download, Edit, Eye, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { EmptyState, ErrorMessage, Loading } from "../components/Ui.jsx";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [filters, setFilters] = useState({ search: "", department: "", status: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const [empRes, deptRes] = await Promise.all([
        api.get("/employees", { params: { ...filters, page } }),
        api.get("/departments")
      ]);
      setEmployees(empRes.data.employees);
      setPagination(empRes.data.pagination);
      setDepartments(deptRes.data.departments);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, []);

  const remove = async (id) => {
    if (!confirm("Delete this employee?")) return;
    await api.delete(`/employees/${id}`);
    load(pagination.page);
  };

  const exportExcel = () => {
    api.get("/employees/export", { params: filters, responseType: "blob" }).then((response) => {
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "employees.csv";
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <section className="panel">
      <div className="section-head">
        <h2>Employees</h2>
        <div className="actions">
          <button className="secondary" onClick={exportExcel}><Download size={16} />Export</button>
          <Link className="button" to="/employees/new"><Plus size={16} />Add Employee</Link>
        </div>
      </div>
      <ErrorMessage message={error} />
      <div className="filters">
        <label><Search size={16} /><input placeholder="Search name, email, designation" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} /></label>
        <select value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
          <option value="">All Departments</option>
          {departments.map((dept) => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
        </select>
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option><option>Active</option><option>Inactive</option>
        </select>
        <button onClick={() => load(1)}>Apply</button>
      </div>
      {loading ? <Loading /> : employees.length === 0 ? <EmptyState /> : (
        <>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Designation</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.name}</td><td>{emp.email}</td><td>{emp.department?.name}</td><td>{emp.designation}</td><td><span className={`status ${emp.status}`}>{emp.status}</span></td>
                    <td className="row-actions">
                      <Link title="View" to={`/employees/${emp._id}`}><Eye size={16} /></Link>
                      <Link title="Edit" to={`/employees/${emp._id}/edit`}><Edit size={16} /></Link>
                      <button title="Delete" onClick={() => remove(emp._id)}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button disabled={pagination.page <= 1} onClick={() => load(pagination.page - 1)}>Previous</button>
            <span>Page {pagination.page} of {pagination.pages || 1}</span>
            <button disabled={pagination.page >= pagination.pages} onClick={() => load(pagination.page + 1)}>Next</button>
          </div>
        </>
      )}
    </section>
  );
};

export default Employees;
