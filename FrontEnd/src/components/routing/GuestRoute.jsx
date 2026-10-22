import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/auth/auth.store";
import Loader from "../common/Loader";

export default function GuestRoute() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) return <Loader />;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}