import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { ErrorMessage } from "../components/Ui.jsx";

const blank = { name: "", email: "", password: "", phone: "", address: "", department: "", designation: "", salary: "", joiningDate: "", status: "Active", role: "Employee" };

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(blank);
  const [departments, setDepartments] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/departments").then((res) => setDepartments(res.data.departments));
    if (id) {
      api.get(`/employees/${id}`).then(({ data }) => {
        const emp = data.employee;
        setForm({ ...blank, ...emp, department: emp.department?._id, password: "", joiningDate: emp.joiningDate?.slice(0, 10) });
      });
    }
  }, [id]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== "password" || value) body.append(key, value ?? "");
    });
    if (profilePicture) body.append("profilePicture", profilePicture);
    try {
      if (id) await api.put(`/employees/${id}`, body);
      else await api.post("/employees", body);
      navigate("/employees");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save employee");
    }
  };

  return (
    <section className="panel">
      <h2>{id ? "Edit Employee" : "Add Employee"}</h2>
      <ErrorMessage message={error} />
      <form className="form-grid" onSubmit={submit}>
        {["name", "email", "phone", "designation", "salary", "joiningDate"].map((field) => (
          <label key={field}>{field.replace(/([A-Z])/g, " $1")}<input type={field === "joiningDate" ? "date" : field === "salary" ? "number" : "text"} value={form[field] || ""} onChange={(e) => setForm({ ...form, [field]: e.target.value })} required={["name", "email", "designation", "salary", "joiningDate"].includes(field)} /></label>
        ))}
        {!id && <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>}
        <label>Department<select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required><option value="">Select</option>{departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}</select></label>
        <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Active</option><option>Inactive</option></select></label>
        <label>Role<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option>Employee</option><option>HR</option><option>Admin</option></select></label>
        <label>Profile Picture<input type="file" accept="image/*" onChange={(e) => setProfilePicture(e.target.files[0])} /></label>
        <label className="full">Address<textarea value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
        <div className="full actions"><button>Save Employee</button><button type="button" className="secondary" onClick={() => navigate("/employees")}>Cancel</button></div>
      </form>
    </section>
  );
};

export default EmployeeForm;
