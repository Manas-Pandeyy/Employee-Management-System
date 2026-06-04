import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ErrorMessage } from "../components/Ui.jsx";

const Login = () => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Admin@12345");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const signedInUser = await login(email, password);
      navigate(["Admin", "HR"].includes(signedInUser.role) ? "/dashboard" : "/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <form className="login-panel" onSubmit={submit}>
        <h1>Employee Management System</h1>
        <ErrorMessage message={error} />
        <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required /></label>
        <label>Password<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required /></label>
        <button disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
        <p className="muted">New employee? <Link to="/register">Create account</Link></p>
        <p className="muted">Admin: admin@example.com / Admin@12345</p>
      </form>
    </main>
  );
};

export default Login;
