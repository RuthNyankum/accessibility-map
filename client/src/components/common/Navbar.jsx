import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";
import { FaPlus, FaArrowRight } from "react-icons/fa";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/map", label: "Map" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("abilitymap-user");
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("abilitymap-user");
    localStorage.removeItem("abilitymap-token");
    setUser(null);
    window.dispatchEvent(new Event("abilitymap-auth"));
    navigate("/");
    if (menuOpen) setMenuOpen(false);
  };

  // Keyboard and click-outside handlers (unchanged)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem("abilitymap-user");
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener("abilitymap-auth", sync);
    return () => window.removeEventListener("abilitymap-auth", sync);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !menuBtnRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const navLinkClass = ({ isActive }) =>
    cn(
      "flex items-center px-4 py-1.5 rounded-md text-[15px] no-underline",
      "min-h-[44px] transition-colors duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
      "focus-visible:ring-[var(--color-focus)] dark:focus-visible:ring-[var(--color-focus-dark)]",
      isActive
        ? [
            "font-bold",
            "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
            "dark:bg-[#052e16] dark:text-[var(--color-primary-dark)]",
          ]
        : [
            "font-normal",
            "text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]",
            "hover:text-[var(--color-text-primary)] dark:hover:text-[var(--color-text-primary-dark)]",
            "hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-surface-dark)]",
          ],
    );

  // "Add a Service" link – redirects to login if not authenticated
  const handleAddServiceClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate("/login");
    }
  };

  // Desktop right side: always show "Add a Service", plus "Logout" if logged in
  const renderDesktopAuthButtons = () => (
    <div className="flex items-center gap-3">
      <NavLink
        to="/add-service"
        onClick={handleAddServiceClick}
        aria-label="Add a new disability support service"
        className={cn(
          "inline-flex items-center gap-1.5 px-5 rounded-lg text-[15px] font-bold no-underline min-h-[44px]",
          "bg-primary text-(--color-primary-fg)",
          "dark:bg-primary-dark dark:text-(--color-primary-dark-fg)",
          "hover:bg-primary-hover dark:hover:opacity-90",
          "transition-colors duration-200",
        )}
      >
        <FaPlus aria-hidden="true" />
        <span>Add a Service</span>
      </NavLink>
      {user && (
        <button
          onClick={handleLogout}
          className={cn(
            "inline-flex items-center gap-1.5 px-5 rounded-lg text-[15px] font-bold min-h-[44px]",
            "bg-danger text-white",
            "hover:opacity-90 transition-colors duration-200",
          )}
        >
          <FaArrowRight aria-hidden="true" />
          <span>Logout</span>
        </button>
      )}
    </div>
  );

  // Mobile menu items: always show "Add a Service", plus "Logout" if logged in
  const renderMobileAuthItems = () => (
    <>
      <li>
        <NavLink
          to="/add-service"
          onClick={(e) => {
            if (!user) {
              e.preventDefault();
              navigate("/login");
            }
            setMenuOpen(false);
          }}
          className={cn(
            "flex items-center justify-center gap-1.5 mt-2",
            "px-5 rounded-lg text-[15px] font-bold min-h-[44px]",
            "bg-primary text-(--color-primary-fg)",
            "dark:bg-primary-dark dark:text-(--color-primary-dark-fg)",
          )}
        >
          <FaPlus aria-hidden="true" />
          <span>Add a Service</span>
        </NavLink>
      </li>
      {user && (
        <li>
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center justify-center gap-1.5 mt-2",
              "px-5 rounded-lg text-[15px] font-bold min-h-[44px]",
              "bg-danger text-white",
              "hover:opacity-90",
            )}
          >
            <FaArrowRight aria-hidden="true" />
            <span>Logout</span>
          </button>
        </li>
      )}
    </>
  );

  return (
    <header
      role="banner"
      className={cn(
        "sticky top-0 z-50",
        "bg-(--color-bg) dark:bg-bg-dark",
        "border-b border-border dark:border-border-dark",
        "transition-colors duration-300",
      )}
    >
      <div className="flex items-center justify-between h-16 px-8">
        {/* Logo */}
        <NavLink
          to="/"
          aria-label="AbilityMap Ghana — return to home page"
          className={cn(
            "text-xl font-bold tracking-tight no-underline min-h-0",
            "text-primary dark:text-primary-dark",
            "transition-colors duration-300",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            "focus-visible:ring-focus dark:focus-visible:ring-focus-dark",
            "rounded-sm",
          )}
        >
          AbilityMap Ghana
        </NavLink>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-1 list-none m-0 p-0" role="list">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} end={to === "/"} className={navLinkClass}>
                  {label}
                </NavLink>
              </li>
            ))}
            {user?.role === "admin" && (
              <li>
                <NavLink to="/admin" className={navLinkClass}>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* Desktop right side: Add a Service + conditional Logout */}
        <div className="flex items-center gap-3">
          {renderDesktopAuthButtons()}

          {/* Mobile hamburger */}
          <button
            ref={menuBtnRef}
            type="button"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
            className={cn(
              "md:hidden flex flex-col justify-center items-center gap-1.5",
              "w-11 h-11 rounded-md",
              "text-text-primary dark:text-text-primary-dark",
              "hover:bg-surface dark:hover:bg-surface-dark",
              "transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "block w-5 h-0.5 rounded transition-transform duration-200",
                "bg-text-primary dark:bg-text-primary-dark",
                menuOpen && "translate-y-2 rotate-45",
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                "block w-5 h-0.5 rounded transition-opacity duration-200",
                "bg-text-primary dark:bg-text-primary-dark",
                menuOpen && "opacity-0",
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                "block w-5 h-0.5 rounded transition-transform duration-200",
                "bg-text-primary dark:bg-text-primary-dark",
                menuOpen && "-translate-y-2 -rotate-45",
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          ref={menuRef}
          aria-label="Mobile navigation"
          className={cn(
            "md:hidden px-4 pb-4 pt-2",
            "bg-(--color-bg) dark:bg-bg-dark",
            "border-t border-border dark:border-border-dark",
          )}
        >
          <ul className="flex flex-col gap-1 list-none p-0" role="list">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            {user?.role === "admin" && (
              <li>
                <NavLink
                  to="/admin"
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </NavLink>
              </li>
            )}
            {renderMobileAuthItems()}
          </ul>
        </nav>
      )}
    </header>
  );
}
