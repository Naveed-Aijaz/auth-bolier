import { useAuth } from "../features/auth/auth.hooks";

export default function Profile() {
  const { user } = useAuth();

  return (
    <main className="app-page">
      <section className="content-card">
        <h1>Your profile</h1>

        <p>
          <strong>Name:</strong> {user?.name || "Not provided"}
        </p>

        <p>
          <strong>Email:</strong> {user?.email || "Not provided"}
        </p>

        <p>
          <strong>Email verified:</strong>{" "}
          {user?.isEmailVerified ? "Yes" : "Not verified"}
        </p>
      </section>
    </main>
  );
}