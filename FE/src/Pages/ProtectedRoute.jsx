import { Navigate, Outlet } from "react-router-dom";
export const ProtectedRoute = () => {
  if (true) {
    return <Outlet />;
  }
  return <Navigate to="/login" />;
};
