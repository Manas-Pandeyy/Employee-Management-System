import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ErrorMessage } from "../components/Ui.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    department: "",
    designation: ""
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/auth/public-departments")
      .then((res) => setDepartments(res.data.departments))
      .catch(() => setError("Departments load nahi ho paaye. Pehle admin se department create karwao."));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => body.append(key, value));
    if (profilePicture) body.append("profilePicture", profilePicture);

    try {
      const { data } = await api.post("/auth/register", body);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <form className="login-panel wide" onSubmit={submit}>
        <h1>Create Employee Account</h1>
        <ErrorMessage message={error} />
        <div className="form-grid">
          <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
          <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} /></label>
          <label>Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
          <label>Department<select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required><option value="">Select Department</option>{departments.map((dept) => <option key={dept._id} value={dept._id}>{dept.name}</option>)}</select></label>
          <label>Designation<input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} required /></label>
          <label className="full">Address<textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
          <label className="full">Profile Picture<input type="file" accept="image/*" onChange={(e) => setProfilePicture(e.target.files[0])} /></label>
        </div>
        <button disabled={loading}>{loading ? "Creating account..." : "Register"}</button>
        <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </main>
  );
};

export default Register;
