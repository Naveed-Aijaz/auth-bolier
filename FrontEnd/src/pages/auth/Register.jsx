import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../components/auth/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { registerSchema } from "../../features/auth/auth.validation";
import { useAuthStore } from "../../features/auth/auth.store";

export default function Register() {
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const registerUser = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async ({
    confirmPassword,
    ...payload
  }) => {
    setMessage("");
    setSubmitError("");

    try {
      const result = await registerUser(payload);

      // If email verification is required, direct the user there.
      if (result.requiresEmailVerification) {
        navigate("/resend-verification", { replace: true });
        return;
      }

      setMessage("Account created. You can now sign in.");
      navigate("/login", { replace: true });
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
        "Unable to create your account."
      );
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Get started in a few steps."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          id="name"
          label="Full name"
          autoComplete="name"
          {...register("name")}
          error={errors.name?.message}
        />

        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          error={errors.password?.message}
        />

        <Input
          id="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        {message && <p role="status">{message}</p>}
        {submitError && (
          <p className="form-error" role="alert">{submitError}</p>
        )}

        <Button type="submit" loading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="auth-footer">
        Already registered? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
}