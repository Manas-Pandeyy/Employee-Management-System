import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { ErrorMessage, Loading } from "../components/Ui.jsx";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/employees/${id}`).then((res) => setEmployee(res.data.employee)).catch((err) => setError(err.response?.data?.message || "Unable to load employee"));
  }, [id]);

  if (!employee && !error) return <Loading />;

  return (
    <section className="panel">
      <ErrorMessage message={error} />
      {employee && (
        <>
          <div className="section-head">
            <h2>{employee.name}</h2>
            <Link className="button" to={`/employees/${employee._id}/edit`}>Edit</Link>
          </div>
          <div className="profile-row">
            <img src={employee.profilePicture ? `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "")}${employee.profilePicture}` : "https://placehold.co/120x120?text=EMP"} alt={employee.name} />
            <div className="details-grid">
              <p><strong>Email</strong>{employee.email}</p>
              <p><strong>Phone</strong>{employee.phone || "-"}</p>
              <p><strong>Department</strong>{employee.department?.name}</p>
              <p><strong>Designation</strong>{employee.designation}</p>
              <p><strong>Salary</strong>{employee.salary}</p>
              <p><strong>Status</strong>{employee.status}</p>
              <p><strong>Role</strong>{employee.role}</p>
              <p><strong>Joining Date</strong>{employee.joiningDate?.slice(0, 10)}</p>
              <p className="full"><strong>Address</strong>{employee.address || "-"}</p>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default EmployeeDetails;
