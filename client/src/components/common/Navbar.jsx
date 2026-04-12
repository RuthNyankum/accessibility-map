import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/map", label: "Map" },
  { to: "/about", label: "About" },
];

/**
 * Navbar accessibility notes:
 *
 * - <header> with role="banner" is the ARIA landmark for the page header (WCAG 1.3.6)
 * - <nav aria-label="Main navigation"> is a distinct ARIA landmark so screen
 *   reader users can jump straight to it (WCAG 2.4.1)
 * - NavLink sets aria-current="page" automatically when the route matches —
 *   this tells screen readers which page is active (WCAG 2.4.8)
 * - Mobile menu button uses aria-expanded and aria-controls (WCAG 4.1.2)
 * - Mobile menu closes on Escape key and on outside click (keyboard trap prevention)
 * - Logo link has descriptive aria-label — "Home" alone is ambiguous (WCAG 2.4.6)
 * - The "+ Add a Service" CTA uses a descriptive aria-label since the "+"
 *   symbol is not meaningful on its own to screen readers
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuBtnRef.current?.focus(); // Return focus to trigger (WCAG 2.1.2)
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  // Close on outside click
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
        {/* Logo — descriptive aria-label, not just "AbilityMap Ghana" */}
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

        {/* Desktop nav — hidden on mobile */}
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-1 list-none m-0 p-0" role="list">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                {/* React Router NavLink auto-sets aria-current="page" */}
                <NavLink to={to} end={to === "/"} className={navLinkClass}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {/* CTA — visible on desktop, hidden on mobile (mobile nav has it) */}
          <NavLink
            to="/add-service"
            aria-label="Add a new disability support service to the directory"
            className={cn(
              "hidden md:inline-flex items-center gap-1.5",
              "px-5 rounded-lg text-[15px] font-bold no-underline min-h-[44px]",
              "bg-primary text-(--color-primary-fg)",
              "dark:bg-primary-dark dark:text-(--color-primary-dark-fg)",
              "hover:bg-primary-hover dark:hover:opacity-90",
              "transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "focus-visible:ring-focus dark:focus-visible:ring-focus-dark",
            )}
          >
            {/* Hide "+" from screen readers — aria-label is the complete description */}
            <span aria-hidden="true">+</span>
            <span>Add a Service</span>
          </NavLink>

          {/* Mobile menu button */}
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
            {/* Hamburger / X icon — purely visual */}
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

      {/* Mobile menu
          id matches aria-controls on the button above (WCAG 4.1.2)
          role="dialog" not used here — this is a disclosure pattern, not a modal */}
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
            <li>
              <NavLink
                to="/add-service"
                aria-label="Add a new disability support service to the directory"
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex items-center justify-center gap-1.5 mt-2",
                  "px-5 rounded-lg text-[15px] font-bold no-underline min-h-[44px]",
                  "bg-primary text-(--color-primary-fg)",
                  "dark:bg-primary-dark dark:text-(--color-primary-dark-fg)",
                  "hover:bg-primary-hover",
                  "transition-colors duration-200",
                )}
              >
                <span aria-hidden="true">+</span>
                <span>Add a Service</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
