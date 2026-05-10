import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

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
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStatus(res.ok ? "ok" : "none");
        if (!res.ok) {
          localStorage.removeItem("abilitymap-token");
          localStorage.removeItem("abilitymap-user");
        }
      } catch {
        setStatus("none");
      }
    };
    verify();
  }, []);

  if (status === "checking") return null;
  if (status === "none")
    return <Navigate to={`/login?from=${location.pathname}`} replace />;
  return <Outlet />;
}
