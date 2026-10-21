import { body, query } from "express-validator";

const email = body("email")
  .isEmail()
  .withMessage("Enter a valid email address")
  .bail()
  .normalizeEmail();

const password = body("password")
  .isString()
  .withMessage("Password must be a string")
  .bail()
  .isLength({ min: 8, max: 72 })
  .withMessage("Password must be 8–72 characters");

export const registerRules = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .bail()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2–50 characters"),
  email,
  password,
];

export const loginRules = [
  email,
  body("password")
    .isString()
    .withMessage("Password is required")
    .bail()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ max: 72 })
    .withMessage("Password is too long"),
];

export const forgotPasswordRules = [email];

export const resetPasswordRules = [
  body("token")
    .isString()
    .withMessage("Reset token is required")
    .notEmpty(),
  password,
];

export const verifyEmailRules = [
  query("token")
    .isString()
    .withMessage("Verification token is required")
    .notEmpty(),
];