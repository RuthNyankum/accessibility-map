import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { cn } from "../utils/cn";
import AccessibilityBar from "../components/common/AccessibilityBar";

/**
 * MainLayout accessibility notes:
 *
 * LANDMARK STRUCTURE (WCAG 1.3.6 — screen reader navigation):
 *   <div skip-link>        — not a landmark, just a utility
 *   <div role="toolbar">   — AccessibilityBar
 *   <header role="banner"> — Navbar
 *   <main>                 — page content (Outlet)
 *   <footer role="contentinfo"> — Footer
 *
 * ROUTE CHANGE ANNOUNCEMENTS (WCAG 4.1.3):
 *   When the route changes, screen readers do not automatically announce the
 *   new page. The live region below announces the new page title so users know
 *   navigation succeeded. This is the recommended SPA pattern.
 *
 * FOCUS MANAGEMENT (WCAG 2.4.3):
 *   On route change, focus moves to <main> so keyboard users start at the top
 *   of the new page content, not trapped at the last focused element.
 */
export default function MainLayout() {
  const location = useLocation();
  const mainRef = useRef(null);
  const announcerRef = useRef(null);

  useEffect(() => {
    // Announce page change to screen readers
    if (announcerRef.current) {
      // Small delay lets the new page render its <title> first
      setTimeout(() => {
        announcerRef.current.textContent = `Navigated to ${document.title}`;
      }, 100);
    }

    // Move focus to main content on route change
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Skip link (WCAG 2.4.1) ──────────────────────────────
          Visually hidden until focused. Lets keyboard users bypass
          the repeated AccessibilityBar + Navbar on every page.
      ─────────────────────────────────────────────────────────── */}
      <a
        href="#main-content"
        className={cn(
          "skip-link px-4 py-2 rounded-b-md text-sm font-bold no-underline",
          "bg-primary text-(--color-primary-fg)",
          "dark:bg-primary-dark dark:text-(--color-primary-dark-fg)",
          "focus-visible:ring-2 focus-visible:ring-offset-2",
          "focus-visible:ring-focus dark:focus-visible:ring-focus-dark",
        )}
      >
        Skip to main content
      </a>

      {/* ── Route change announcer (WCAG 4.1.3) ─────────────────
          aria-live="polite" + aria-atomic="true" announces the full
          message at once after the current speech finishes.
          Visually hidden (sr-only) — not shown on screen.
      ─────────────────────────────────────────────────────────── */}
      <div
        ref={announcerRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <AccessibilityBar />
      <Navbar />

      {/* ── Main content (WCAG 2.4.1, 2.4.3) ───────────────────
          id="main-content" is the skip link target.
          tabIndex={-1} allows focus() to be called programmatically
          without adding it to the natural tab order.
          outline-none removes the browser's default focus outline
          on programmatic focus (not keyboard focus — that's fine).
      ─────────────────────────────────────────────────────────── */}
      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className={cn(
          "flex-1 outline-none",
          "bg-(--color-bg) dark:bg-bg-dark",
          "transition-colors duration-300",
        )}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
