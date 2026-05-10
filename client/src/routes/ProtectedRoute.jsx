import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import API from "../services/api";

export default function ProtectedRoute() {
  const [status, setStatus] = useState("checking");
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("abilitymap-token");

      if (!token) {
        setStatus("none");
        return;
      }

      try {
        await API.get("/api/auth/me");

        setStatus("ok");
      } catch {
        localStorage.removeItem("abilitymap-token");
        localStorage.removeItem("abilitymap-user");

        setStatus("none");
      }
    };

    verify();
  }, []);

  if (status === "checking") return null;

  if (status === "none") {
    return <Navigate to={`/login?from=${location.pathname}`} replace />;
  }

  return <Outlet />;
}
