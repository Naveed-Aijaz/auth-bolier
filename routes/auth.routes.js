import { Router } from "express";

import {
  register,
  verifyEmail,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  verifyEmailRules,
} from "../validators/auth.validator.js";

const router = Router();

router.post("/register", registerRules, validate, register);

router.get(
  "/verify-email",
  verifyEmailRules,
  validate,
  verifyEmail
);

router.post("/login", loginRules, validate, login);

router.post("/logout", protect, logout);

router.get("/profile", protect, getProfile);

router.post(
  "/forgot-password",
  forgotPasswordRules,
  validate,
  forgotPassword
);

router.post(
  "/reset-password",
  resetPasswordRules,
  validate,
  resetPassword
);

export default router;