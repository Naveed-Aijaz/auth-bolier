import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <main className="app-page">
      <section className="content-card">
        <h1>Access denied</h1>
        <p>You don't have permission to access this resource.</p>
        <Link to="/dashboard">Back to dashboard</Link>
      </section>
    </main>
  );
}