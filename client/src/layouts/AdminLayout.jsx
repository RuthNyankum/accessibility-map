import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";
import {
  FaTachometerAlt,
  FaClipboardList,
  FaCheckCircle,
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaGlobe,
} from "react-icons/fa";

const NAV = [
  { to: "/admin", label: "Overview", icon: FaTachometerAlt, end: true },
  {
    to: "/admin/pending",
    label: "Pending Review",
    icon: FaClipboardList,
    badge: true,
  },
  { to: "/admin/services", label: "All Services", icon: FaCheckCircle },
  { to: "/admin/users", label: "Users", icon: FaUsers },
];

export default function AdminLayout({ pendingCount = 0 }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("abilitymap-token");
    localStorage.removeItem("abilitymap-user");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold min-h-[44px]",
      "transition-colors duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]",
      isActive
        ? [
            "bg-[var(--color-primary)] text-[var(--color-primary-fg)]",
            "dark:bg-[var(--color-primary-dark)] dark:text-[var(--color-primary-dark-fg)]",
          ]
        : [
            "text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]",
            "hover:bg-[var(--color-surface-2)] dark:hover:bg-[#2d3f5a]",
            "hover:text-[var(--color-text-primary)] dark:hover:text-[var(--color-text-primary-dark)]",
          ],
    );

  const SidebarContent = () => (
    <div
      className={cn(
        "flex flex-col h-full",
        "bg-surface dark:bg-surface-dark",
        "border-r border-border dark:border-border-dark",
        "transition-colors duration-300",
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          "flex items-center gap-3 px-5 py-5 border-b",
          "border-border dark:border-border-dark",
        )}
      >
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
            "bg-primary dark:bg-primary-dark",
          )}
        >
          <FaGlobe
            className="text-white dark:text-(--color-primary-dark-fg) text-sm"
            aria-hidden="true"
          />
        </div>
        <div>
          <p className="text-sm font-black text-text-primary dark:text-text-primary-dark leading-none">
            AbilityMap
          </p>
          <p className="text-[10px] font-bold tracking-widest uppercase text-text-muted dark:text-text-muted-dark mt-0.5">
            Admin
          </p>
        </div>
      </div>

      {/* Nav links */}
      <nav aria-label="Admin menu" className="flex-1 px-3 py-4 overflow-y-auto">
        <ul role="list" className="flex flex-col gap-1 list-none p-0">
          {NAV.map(({ to, label, icon: Icon, end, badge }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={linkClass}
                aria-label={label}
              >
                <Icon aria-hidden="true" className="text-base shrink-0" />
                <span className="flex-1">{label}</span>
                {badge && pendingCount > 0 && (
                  <span
                    aria-label={`${pendingCount} pending`}
                    className="text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                  >
                    {pendingCount}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div
        className={cn(
          "px-3 py-4 border-t flex flex-col gap-1",
          "border-border dark:border-border-dark",
        )}
      >
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View the public site in a new tab"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold min-h-[44px]",
            "text-text-secondary dark:text-text-secondary-dark",
            "hover:bg-surface-2 dark:hover:bg-[#2d3f5a]",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
          )}
        >
          <FaGlobe aria-hidden="true" className="text-base shrink-0" />
          View Site
        </a>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Sign out of admin"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold min-h-[44px] w-full",
            "text-danger dark:text-danger-dark",
            "hover:bg-red-50 dark:hover:bg-red-950",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
          )}
        >
          <FaSignOutAlt aria-hidden="true" className="text-base shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "flex h-screen overflow-hidden",
        "bg-(--color-bg) dark:bg-bg-dark",
        "transition-colors duration-300",
      )}
    >
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-56 md:shrink-0 md:flex-col">
        <SidebarContent />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 md:hidden transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className={cn(
            "flex items-center justify-between h-14 px-6 shrink-0",
            "bg-(--color-bg) dark:bg-bg-dark",
            "border-b border-border dark:border-border-dark",
          )}
        >
          <button
            type="button"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((o) => !o)}
            className={cn(
              "md:hidden p-2 rounded-lg min-h-0",
              "text-text-primary dark:text-text-primary-dark",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
            )}
          >
            {sidebarOpen ? (
              <FaTimes aria-hidden="true" />
            ) : (
              <FaBars aria-hidden="true" />
            )}
          </button>

          <p className="text-sm font-bold hidden md:block text-text-muted dark:text-text-muted-dark">
            Admin Dashboard
          </p>

          {pendingCount > 0 && (
            <NavLink
              to="/admin/pending"
              aria-label={`${pendingCount} services waiting for review`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold min-h-0 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 hover:opacity-80 transition-opacity"
            >
              ⚠️ {pendingCount} pending review
            </NavLink>
          )}
        </header>

        {/* Page content */}
        <main
          id="admin-main"
          tabIndex={-1}
          className="flex-1 overflow-y-auto px-6 py-6 outline-none"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
