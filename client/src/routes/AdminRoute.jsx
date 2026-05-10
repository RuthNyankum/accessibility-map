import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { cn } from "../utils/cn";
import API from "../services/api";

export default function AdminRoute() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("abilitymap-token");

      if (!token) {
        setStatus("none");
        return;
      }

      try {
        const res = await API.get("/api/auth/me");

        const user = res.data.user;

        setStatus(user?.role === "admin" ? "admin" : "user");
      } catch {
        setStatus("none");
      }
    };

    verify();
  }, []);

  if (status === "checking") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className={cn(
            "w-8 h-8 rounded-full border-4 animate-spin",
            "border-border border-t-primary",
          )}
        />
        <span className="sr-only">Checking permissions...</span>
      </div>
    );
  }

  if (status === "none") return <Navigate to="/login" replace />;
  if (status === "user") return <Navigate to="/" replace />;

  return <Outlet />;
}
