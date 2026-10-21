import User from "../models/users.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  createAccessToken,
  createRandomToken,
  hashToken,
} from "../services/token.service.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../services/email.service.js";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
});

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
});

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const exists = await User.exists({ email: normalizedEmail });

  if (exists) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const rawToken = createRandomToken();

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    emailVerificationTokenHash: hashToken(rawToken),
    emailVerificationExpires: new Date(Date.now() + 15 * 60 * 1000),
  });

  try {
    await sendVerificationEmail(user, rawToken);
  } catch (error) {
    await User.deleteOne({ _id: user._id });
    throw error;
  }

  res.status(201).json({
    success: true,
    message: "Account created. Check your email to verify it.",
  });
});

// GET /api/auth/verify-email?token=...
export const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.query.token;

  const user = await User.findOne({
    emailVerificationTokenHash: hashToken(token),
    emailVerificationExpires: { $gt: new Date() },
    isEmailVerified: false,
  }).select("+emailVerificationTokenHash +emailVerificationExpires");

  if (!user) {
    throw new ApiError(400, "Verification token is invalid or expired");
  }

  user.isEmailVerified = true;
  user.emailVerificationTokenHash = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully. You can now log in.",
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(403, "Please verify your email before logging in");
  }

  const token = createAccessToken(user);

  res.cookie("token", token, cookieOptions());

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: publicUser(user),
  });
});

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  await User.updateOne(
    { _id: req.user._id },
    { $inc: { tokenVersion: 1 } }
  );

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// GET /api/auth/profile
export const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: publicUser(req.user),
  });
});

// POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const genericMessage =
    "If an account exists for that email, a reset link will be sent.";

  const user = await User.findOne({
    email: req.body.email.trim().toLowerCase(),
  });

  if (!user) {
    return res.status(200).json({
      success: true,
      message: genericMessage,
    });
  }

  const rawToken = createRandomToken();

  user.passwordResetTokenHash = hashToken(rawToken);
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);

  await user.save();

  try {
    await sendPasswordResetEmail(user, rawToken);
  } catch {
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    throw new ApiError(503, "Unable to send reset email. Try again later.");
  }

  res.status(200).json({
    success: true,
    message: genericMessage,
  });
});

// POST /api/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    passwordResetTokenHash: hashToken(token),
    passwordResetExpires: { $gt: new Date() },
  }).select(
    "+passwordResetTokenHash +passwordResetExpires"
  );

  if (!user) {
    throw new ApiError(400, "Reset token is invalid or expired");
  }

  user.password = password;
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;
  user.tokenVersion += 1;

  await user.save();

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Password reset successfully. Please log in again.",
  });
});