import { create } from "zustand";
import { authApi } from "../../api/auth.api";

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: Boolean(user),
    }),

  clearError: () => set({ error: null }),

  initializeAuth: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await authApi.getMe();

      // Apne backend ke response shape ke mutabiq adjust karo.
      const user = response.data.user;

      set({
        user,
        isAuthenticated: Boolean(user),
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (payload) => {
    set({ error: null });

    try {
      await authApi.login(payload);

      // Login ke baad backend se verified user load karo.
      const response = await authApi.getMe();
      const user = response.data.user;

      set({
        user,
        isAuthenticated: Boolean(user),
      });

      return user;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Login failed. Please try again.",
      });

      throw error;
    }
  },

  register: async (payload) => {
    set({ error: null });

    try {
      const response = await authApi.register(payload);
      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });

      throw error;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },
}));