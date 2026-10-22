import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import { useAuthStore } from "../../features/auth/auth.store";

export default function OAuthCallback() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    useAuthStore
      .getState()
      .initializeAuth()
      .then(() => {
        if (!active) return;

        const authenticated =
          useAuthStore.getState().isAuthenticated;

        setStatus(authenticated ? "success" : "error");
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthLayout title="Signing you in">
      {status === "loading" && <p>Completing sign in...</p>}

      {status === "success" && (
        <p>Authentication complete. <Link to="/dashboard">Continue</Link></p>
      )}

      {status === "error" && (
        <p>
          Sign in could not be completed. <Link to="/login">Try again</Link>
        </p>
      )}
    </AuthLayout>
  );
}