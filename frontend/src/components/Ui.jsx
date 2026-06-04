export const Loading = () => <div className="state">Loading...</div>;

export const ErrorMessage = ({ message }) =>
  message ? <div className="alert error">{message}</div> : null;

export const EmptyState = ({ message = "No records found." }) => <div className="state">{message}</div>;

export const StatCard = ({ label, value, tone = "default" }) => (
  <div className={`stat ${tone}`}>
    <span>{label}</span>
    <strong>{value ?? 0}</strong>
  </div>
);
