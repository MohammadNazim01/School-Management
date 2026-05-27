import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

export function RoleRedirect() {
  const { user } = useAuthStore();
  if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === "teacher") return <Navigate to="/teacher/dashboard" replace />;
  if (user?.role === "student") return <Navigate to="/student/dashboard" replace />;
  return <Navigate to="/login" replace />;
}
