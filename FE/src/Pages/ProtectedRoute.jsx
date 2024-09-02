import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const token = localStorage.getItem("user-token");
  if (token) {
    return <Outlet />;
  }
  return <Navigate to="/login" />;
};
