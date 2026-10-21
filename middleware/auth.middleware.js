import jwt from "jsonwebtoken";
import User from "../models/users.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const bearer = req.headers.authorization;

  const token =
    req.cookies?.token ||
    (bearer?.startsWith("Bearer ") ? bearer.slice(7) : null);

  if (!token) {
    throw new ApiError(401, "Please log in to continue");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await User.findById(decoded.sub);

  if (!user || user.tokenVersion !== decoded.ver) {
    throw new ApiError(401, "Session is no longer valid");
  }

  req.user = user;
  next();
});