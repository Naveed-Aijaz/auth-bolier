import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../components/auth/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { authApi } from "../../api/auth.api";
import { resetPasswordSchema } from "../../features/auth/auth.validation";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async ({ password, confirmPassword }) => {
    setMessage("");
    setSubmitError("");

    try {
      await authApi.resetPassword({
        token,
        password,
        confirmPassword,
      });

      setMessage("Password reset successfully. Please sign in.");
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
        "The reset link may be invalid or expired."
      );
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Invalid reset link">
        <p>Request a new password reset link to continue.</p>
        <Link to="/forgot-password">Request new link</Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set new password">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          id="password"
          label="New password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          error={errors.password?.message}
        />

        <Input
          id="confirmPassword"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        {message && (
          <p role="status">
            {message} <Link to="/login">Sign in</Link>
          </p>
        )}

        {submitError && (
          <p role="alert" className="form-error">{submitError}</p>
        )}

        {!message && (
          <Button type="submit" loading={isSubmitting}>
            Reset password
          </Button>
        )}
      </form>
    </AuthLayout>
  );
}