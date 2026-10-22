import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../components/auth/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { authApi } from "../../api/auth.api";
import { changePasswordSchema } from "../../features/auth/auth.validation";

export default function ChangePassword() {
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async ({
    currentPassword,
    newPassword,
  }) => {
    setMessage("");
    setSubmitError("");

    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
      });

      reset();
      setMessage("Password updated successfully.");
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
        "Unable to change password."
      );
    }
  };

  return (
    <AuthLayout title="Change password">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          id="currentPassword"
          label="Current password"
          type="password"
          autoComplete="current-password"
          {...register("currentPassword")}
          error={errors.currentPassword?.message}
        />

        <Input
          id="newPassword"
          label="New password"
          type="password"
          autoComplete="new-password"
          {...register("newPassword")}
          error={errors.newPassword?.message}
        />

        <Input
          id="confirmPassword"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        {message && <p role="status">{message}</p>}
        {submitError && (
          <p role="alert" className="form-error">{submitError}</p>
        )}

        <Button type="submit" loading={isSubmitting}>
          Update password
        </Button>
      </form>
    </AuthLayout>
  );
}