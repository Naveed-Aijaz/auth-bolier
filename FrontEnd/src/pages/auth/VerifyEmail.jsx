import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import { authApi } from "../../api/auth.api";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    async function verify() {
      if (!token) {
        setStatus("invalid");
        return;
      }

      try {
        await authApi.verifyEmail({ token });
        if (active) setStatus("success");
      } catch {
        if (active) setStatus("error");
      }
    }

    verify();

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <AuthLayout title="Email verification">
      {status === "loading" && <p>Verifying your email...</p>}

      {status === "success" && (
        <>
          <p>Your email has been verified.</p>
          <Link to="/login">Continue to sign in</Link>
        </>
      )}

      {status === "invalid" && (
        <>
          <p>The verification link is missing a token.</p>
          <Link to="/resend-verification">Request another link</Link>
        </>
      )}

      {status === "error" && (
        <>
          <p>The link is invalid, expired, or could not be verified.</p>
          <Link to="/resend-verification">Request another link</Link>
        </>
      )}
    </AuthLayout>
  );
}