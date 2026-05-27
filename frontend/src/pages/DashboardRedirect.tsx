import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

export function DashboardRedirect() {
  const { user } = useAuthStore();
  return <Navigate to="/dashboard" replace />;
}
