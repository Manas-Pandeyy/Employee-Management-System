import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";
import { EmptyState, ErrorMessage } from "../components/Ui.jsx";

const Departments = () => {
  const { user } = useAuth();
  const canManage = ["Admin", "HR"].includes(user.role);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = () => api.get("/departments").then((res) => setDepartments(res.data.departments)).catch((err) => setError(err.response?.data?.message || "Unable to load departments"));
  useEffect(() => { load(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (editingId) await api.put(`/departments/${editingId}`, form);
    else await api.post("/departments", form);
    setForm({ name: "", description: "" });
    setEditingId(null);
    load();
  };

  const edit = (dept) => {
    setEditingId(dept._id);
    setForm({ name: dept.name, description: dept.description || "" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this department?")) return;
    await api.delete(`/departments/${id}`);
    load();
  };

  return (
    <section className="grid two">
      <div className="panel">
        <h2>Departments</h2>
        <ErrorMessage message={error} />
        {departments.length === 0 ? <EmptyState /> : (
          <table>
            <thead><tr><th>Name</th><th>Employees</th><th>Actions</th></tr></thead>
            <tbody>{departments.map((dept) => <tr key={dept._id}><td><strong>{dept.name}</strong><br /><span>{dept.description}</span></td><td>{dept.employeeCount}</td><td className="row-actions">{canManage && <><button onClick={() => edit(dept)}><Edit size={16} /></button>{user.role === "Admin" && <button onClick={() => remove(dept._id)}><Trash2 size={16} /></button>}</>}</td></tr>)}</tbody>
          </table>
        )}
      </div>
      {canManage && (
        <form className="panel stack" onSubmit={submit}>
          <h2>{editingId ? "Edit Department" : "Add Department"}</h2>
          <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
          <label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <button>{editingId ? "Update" : "Create"}</button>
        </form>
      )}
    </section>
  );
};

export default Departments;
