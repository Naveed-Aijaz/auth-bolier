import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../components/auth/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { loginSchema } from "../../features/auth/auth.validation";
import { useAuth } from "../../features/auth/auth.hooks";

export default function Login() {
  const [submitError, setSubmitError] = useState("");
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    setSubmitError("");

    try {
      await login(values);

      const destination = location.state?.from;
      const pathname = destination?.pathname;

      // Avoid redirecting back to the login page.
      const safePath =
        pathname && pathname !== "/login"
          ? pathname
          : "/dashboard";

      navigate(safePath, { replace: true });
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
        "Unable to log in. Check your credentials."
      );
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          {...register("password")}
          error={errors.password?.message}
        />

        <div className="form-links">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        {submitError && (
          <p className="form-error" role="alert">
            {submitError}
          </p>
        )}

        <Button type="submit" loading={isSubmitting}>
          Sign in
        </Button>
      </form>

      <p className="auth-footer">
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </AuthLayout>
  );
}