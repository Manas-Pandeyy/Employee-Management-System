import { useEffect, useState } from "react";
import api from "../api/axios";
import { EmptyState, ErrorMessage } from "../components/Ui.jsx";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/audit-logs").then((res) => setLogs(res.data.logs)).catch((err) => setError(err.response?.data?.message || "Unable to load audit logs"));
  }, []);

  return (
    <section className="panel">
      <h2>Audit Logs</h2>
      <ErrorMessage message={error} />
      {logs.length === 0 ? <EmptyState /> : (
        <table>
          <thead><tr><th>Actor</th><th>Action</th><th>Entity</th><th>IP</th><th>Time</th></tr></thead>
          <tbody>{logs.map((log) => <tr key={log._id}><td>{log.actor?.name || "System"}</td><td>{log.action}</td><td>{log.entity}</td><td>{log.ipAddress}</td><td>{new Date(log.createdAt).toLocaleString()}</td></tr>)}</tbody>
        </table>
      )}
    </section>
  );
};

export default AuditLogs;
