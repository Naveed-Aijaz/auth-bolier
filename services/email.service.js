import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, text }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
  });
};

export const sendVerificationEmail = async (user, token) => {
  const url = `${process.env.API_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    text: `Hi ${user.name},\n\nVerify your email using this link:\n${url}\n\nThis link expires in 15 minutes.`,
  });
};

export const sendPasswordResetEmail = async (user, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password?token=${encodeURIComponent(token)}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    text: `Hi ${user.name},\n\nUse this link to reset your password:\n${url}\n\nThis link expires in 15 minutes. If you did not request this, ignore this email.`,
  });
};