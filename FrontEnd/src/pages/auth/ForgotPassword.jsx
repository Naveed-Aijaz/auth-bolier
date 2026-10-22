import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../components/auth/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { forgotPasswordSchema } from "../../features/auth/auth.validation";
import { authApi } from "../../api/auth.api";

export default function ForgotPassword() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values) => {
    setMessage("");
    setError("");

    try {
      await authApi.forgotPassword(values);
      setMessage(
        "If the account exists, password reset instructions will be sent."
      );
    } catch {
      setError("Unable to process your request. Please try again.");
    }
  };

  return (
    <AuthLayout title="Forgot password" subtitle="Reset your password securely.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
        />

        {message && <p role="status">{message}</p>}
        {error && <p role="alert" className="form-error">{error}</p>}

        <Button type="submit" loading={isSubmitting}>
          Send reset instructions
        </Button>
      </form>

      <p className="auth-footer">
        <Link to="/login">Back to sign in</Link>
      </p>
    </AuthLayout>
  );
}