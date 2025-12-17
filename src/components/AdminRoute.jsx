import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const isAdmin = localStorage.getItem("admin_authed") === "true";

  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
