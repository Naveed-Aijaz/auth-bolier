import { randomBytes, createHash } from "node:crypto";
import jwt from "jsonwebtoken";

export const createRandomToken = () =>
  randomBytes(32).toString("hex");

export const hashToken = (token) =>
  createHash("sha256").update(token).digest("hex");

export const createAccessToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      ver: user.tokenVersion,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      algorithm: "HS256",
    }
  );