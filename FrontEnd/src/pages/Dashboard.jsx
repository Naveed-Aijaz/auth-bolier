import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/auth.hooks";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <main className="app-page">
      <header className="app-header">
        <h1>Dashboard</h1>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="content-card">
        <h2>Welcome, {user?.name || user?.email || "User"}</h2>
        <p>You are signed in.</p>

        <nav className="dashboard-links">
          <Link to="/profile">View profile</Link>
          <Link to="/change-password">Change password</Link>
        </nav>
      </section>
    </main>
  );
}