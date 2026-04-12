import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";
import {
  FaHome,
  FaClipboardList,
  FaMapMarkedAlt,
  FaPlusSquare,
  FaInfoCircle,
  FaUniversalAccess,
  FaMicrophone,
  FaKeyboard,
  FaPhoneAlt,
  FaBug,
} from "react-icons/fa";
import { GhanaFlag } from "../../assets/icons/GhanaFlag";

/**
 * Footer accessibility notes:
 *
 * - <footer role="contentinfo"> is the ARIA landmark for page-level footer (WCAG 1.3.6)
 * - Column headings use <h2> — correct heading hierarchy under the page <h1>
 *   (screen readers use headings to navigate, WCAG 1.3.1)
 * - All links have visible, descriptive text — no "click here" or icon-only links
 * - role="list" on <ul> restores list semantics that Tailwind's list-none removes
 *   (VoiceOver on Safari strips list role when list-style is none)
 * - The WCAG compliance note uses role="note" — an ARIA landmark for supplementary info
 * - Footer nav links use <nav aria-label="Legal links"> to distinguish from main nav
 * - "Browse by type" links pass the service type as a URL query param — these are
 *   functional links, not just decorative text
 */

const NAV_LINKS = [
  { to: "/", icon: FaHome, label: "Home" },
  { to: "/services", icon: FaClipboardList, label: "All Services" },
  { to: "/map", icon: FaMapMarkedAlt, label: "Map View" },
  { to: "/add-service", icon: FaPlusSquare, label: "Add a Service" },
  { to: "/about", icon: FaInfoCircle, label: "About Us" },
];

const SUPPORT_LINKS = [
  {
    to: "/accessibility",
    icon: FaUniversalAccess,
    label: "Accessibility Help",
  },
  {
    to: "/screen-reader-guide",
    icon: FaMicrophone,
    label: "Screen Reader Guide",
  },
  { to: "/keyboard-nav", icon: FaKeyboard, label: "Keyboard Navigation" },
  { to: "/contact", icon: FaPhoneAlt, label: "Contact Us" },
  { to: "/report", icon: FaBug, label: "Report an Issue" },
];

const SERVICE_TYPES = [
  { label: "Physical Disability", slug: "Physical Disability" },
  { label: "Visual Impairment", slug: "Visual Impairment" },
  { label: "Hearing Impairment", slug: "Hearing Impairment" },
  { label: "Mental Health", slug: "Mental Health" },
  { label: "Speech & Language", slug: "Speech & Language" },
  { label: "Intellectual Disability", slug: "Intellectual Disability" },
];

const LEGAL_LINKS = [
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Use" },
  { to: "/contact", label: "Contact" },
  { to: "/accessibility-statement", label: "Accessibility Statement" },
];

// Shared link class for nav + support columns
const colLinkClass = cn(
  "flex items-center gap-2 px-1 py-1 rounded min-h-[44px] text-sm no-underline",
  "text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]",
  "hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-dark)]",
  "transition-colors duration-200",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
  "focus-visible:ring-[var(--color-focus)] dark:focus-visible:ring-[var(--color-focus-dark)]",
);

// Shared column heading class
const colHeadingClass = cn(
  "text-[11px] font-bold tracking-widest uppercase mb-4",
  "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
  "transition-colors duration-300",
);

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className={cn(
        "bg-surface dark:bg-surface-dark",
        "border-t border-border dark:border-border-dark",
        "transition-colors duration-300",
      )}
    >
      {/* Main grid */}
      <div
        className={cn(
          "grid gap-8 px-8 pt-12 pb-8",
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]",
        )}
      >
        {/* ── Brand column ──────────────────────────────────────── */}
        <div>
          <NavLink
            to="/"
            aria-label="AbilityMap Ghana — return to home page"
            className={cn(
              "block text-xl font-bold mb-3 no-underline min-h-0",
              "text-primary dark:text-primary-dark",
              "transition-colors duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
              "dark:focus-visible:ring-focus-dark rounded-sm",
            )}
          >
            AbilityMap Ghana
          </NavLink>

          <p
            className={cn(
              "text-sm leading-relaxed mb-4",
              "text-text-secondary dark:text-text-secondary-dark",
              "transition-colors duration-300",
            )}
          >
            Connecting people with disabilities, caregivers, and professionals
            to support services across every region of Ghana.
          </p>

          {/* Ghana flag — emoji hidden from screen readers, text visible */}
          <p
            className={cn(
              "flex items-center gap-1.5 text-sm mb-5",
              "text-text-muted dark:text-text-muted-dark",
              "transition-colors duration-300",
            )}
          >
            <p className="flex items-center gap-2 text-sm mb-5 text-text-muted dark:text-text-muted-dark">
              <GhanaFlag className="w-6 h-auto rounded-sm shadow-sm" />
              <span>Made in Ghana, for Ghana</span>
            </p>
          </p>

          <NavLink
            to="/accessibility-statement"
            aria-label="Read the AbilityMap Ghana accessibility statement"
            className={cn(
              "inline-flex items-center gap-2 px-4 rounded-lg text-sm font-bold no-underline",
              "min-h-[44px] border-2",
              "border-primary text-primary",
              "dark:border-primary-dark dark:text-primary-dark",
              "hover:bg-primary-light dark:hover:bg-[#052e16]",
              "transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "focus-visible:ring-focus dark:focus-visible:ring-focus-dark",
            )}
          >
            <FaUniversalAccess className="text-lg" aria-hidden="true" />
            <span>Accessibility Statement</span>
          </NavLink>
        </div>

        {/* ── Navigate column ───────────────────────────────────── */}
        <div>
          {/* h2 — correct hierarchy under page h1 (WCAG 1.3.1) */}
          <h2 className={colHeadingClass}>Navigate</h2>
          <ul className="flex flex-col gap-0 list-none p-0" role="list">
            {NAV_LINKS.map(
              (
                { to, icon: Icon, label }, // We rename 'icon' to 'Icon' here
              ) => (
                <li key={to}>
                  <NavLink to={to} className={colLinkClass}>
                    <span aria-hidden="true" className="text-sm w-4 shrink-0">
                      <Icon /> {/* Render the component here */}
                    </span>
                    {label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* ── Support column ────────────────────────────────────── */}
        <div>
          <h2 className={colHeadingClass}>Support</h2>
          <ul className="flex flex-col gap-0 list-none p-0" role="list">
            <ul className="flex flex-col gap-0 list-none p-0" role="list">
              {SUPPORT_LINKS.map(({ to, icon: Icon, label }) => (
                <li key={to}>
                  <NavLink to={to} className={colLinkClass}>
                    <span aria-hidden="true" className="text-lg w-5 shrink-0">
                      <Icon />
                    </span>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </ul>
        </div>

        {/* ── Browse by type column ─────────────────────────────── */}
        <div>
          <h2 className={colHeadingClass}>Browse by Type</h2>
          <ul className="flex flex-col gap-0 list-none p-0" role="list">
            {SERVICE_TYPES.map(({ label, slug }) => (
              <li key={slug}>
                <NavLink
                  to={`/services?type=${encodeURIComponent(slug)}`}
                  className={colLinkClass}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* WCAG compliance note */}
      <div
        role="note"
        aria-label="Accessibility compliance statement"
        className={cn(
          "px-8 py-4 text-[13px]",
          "border-t border-border dark:border-border-dark",
          "text-text-muted dark:text-text-muted-dark",
          "transition-colors duration-300",
        )}
      >
        AbilityMap Ghana is built to WCAG 2.1 Level AA standards. We support
        screen readers, keyboard navigation, and high contrast mode.
      </div>

      {/* Bottom bar */}
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-4 px-8 py-4",
          "border-t border-border dark:border-border-dark",
          "transition-colors duration-300",
        )}
      >
        <p
          className={cn(
            "text-[13px]",
            "text-text-muted dark:text-text-muted-dark",
            "transition-colors duration-300",
          )}
        >
          © 2025 AbilityMap Ghana. All rights reserved.
        </p>

        {/* Distinct aria-label differentiates from "Main navigation" landmark */}
        <nav aria-label="Legal links" className="flex flex-wrap gap-6">
          {LEGAL_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={cn(
                "text-[13px] no-underline min-h-0",
                "text-text-muted dark:text-text-muted-dark",
                "hover:text-text-primary dark:hover:text-text-primary-dark",
                "transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-1",
                "focus-visible:ring-focus dark:focus-visible:ring-focus-dark",
                "rounded-sm",
              )}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </footer>
  );
}
