import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../components/auth/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { authApi } from "../../api/auth.api";
import { forgotPasswordSchema } from "../../features/auth/auth.validation";

export default function ResendVerification() {
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
      await authApi.resendVerification(values);
      setMessage(
        "If verification is available for this account, instructions will be sent."
      );
    } catch {
      setError("Unable to send instructions. Please try again.");
    }
  };

  return (
    <AuthLayout title="Verify your email">
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
          Resend verification
        </Button>
      </form>
    </AuthLayout>
  );
}