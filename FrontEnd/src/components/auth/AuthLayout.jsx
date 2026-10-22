import { Link } from "react-router-dom";

export default function AuthLayout({
  title,
  subtitle,
  children,
}) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="brand">
          YourApp
        </Link>

        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}

        {children}
      </section>
    </main>
  );
}