import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error("MONGO_URI and JWT_SECRET are required");
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters");
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER ||
      !process.env.SMTP_PASS || !process.env.EMAIL_FROM) {
    throw new Error("SMTP configuration is required");
  }

  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Startup failed:", error.message);
  process.exit(1);
});