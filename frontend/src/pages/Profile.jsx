import { useState } from "react";
import api from "../api/axios";
import { ErrorMessage } from "../components/Ui.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || "", address: user.address || "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const update = async (event) => {
    event.preventDefault();
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => body.append(key, value));
    if (file) body.append("profilePicture", file);
    const { data } = await api.put("/auth/profile", body);
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    setMessage("Profile updated");
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api.put("/auth/change-password", passwords);
      setPasswords({ currentPassword: "", newPassword: "" });
      setMessage("Password changed");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to change password");
    }
  };

  return (
    <section className="grid two">
      <form className="panel stack" onSubmit={update}>
        <h2>My Profile</h2>
        {message && <div className="alert success">{message}</div>}
        <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
        <label>Address<textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
        <label>Profile Picture<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} /></label>
        <p><strong>Department:</strong> {user.department?.name}</p>
        <p><strong>Designation:</strong> {user.designation}</p>
        <button>Update Profile</button>
      </form>
      <form className="panel stack" onSubmit={changePassword}>
        <h2>Change Password</h2>
        <ErrorMessage message={error} />
        <label>Current Password<input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required /></label>
        <label>New Password<input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required /></label>
        <button>Change Password</button>
      </form>
    </section>
  );
};

export default Profile;
