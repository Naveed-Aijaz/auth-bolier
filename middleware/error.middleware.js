 import { ApiError } from "../utils/ApiError.js";

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.path}`));
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.code === 11000) {
    statusCode = 409;
    message = "An account with this email already exists";
  }

  if (err.name === "ValidationError") {
    statusCode = 422;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production" && statusCode >= 500
        ? "Internal server error"
        : message,
  });
};