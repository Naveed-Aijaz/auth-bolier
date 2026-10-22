import api from "./axios";

export const authApi = {
  login: (payload) =>
    api.post("/YOUR_LOGIN_ENDPOINT", payload),

  register: (payload) =>
    api.post("/register", payload),

  logout: () =>
    api.post("/YOUR_LOGOUT_ENDPOINT"),

  getMe: () =>
    api.get("/YOUR_CURRENT_USER_ENDPOINT"),

  forgotPassword: (payload) =>
    api.post("/YOUR_FORGOT_PASSWORD_ENDPOINT", payload),

  resetPassword: (payload) =>
    api.post("/YOUR_RESET_PASSWORD_ENDPOINT", payload),

  verifyEmail: (payload) =>
    api.post("/YOUR_VERIFY_EMAIL_ENDPOINT", payload),

  resendVerification: (payload) =>
    api.post("/YOUR_RESEND_VERIFICATION_ENDPOINT", payload),

  changePassword: (payload) =>
    api.patch("/YOUR_CHANGE_PASSWORD_ENDPOINT", payload),

  updateProfile: (payload) =>
    api.patch("/YOUR_UPDATE_PROFILE_ENDPOINT", payload),
};