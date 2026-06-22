import { useContext, useRef, useEffect, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { AccessibilityContext } from "../../context/AccessibilityContext";
import { cn } from "../../utils/cn";
import {
  FaSun,
  FaMoon,
  FaMicrophone,
  FaStop,
  FaTimes,
  FaUniversalAccess,
} from "react-icons/fa";

/**
 * ControlBtn — button inside the accessibility panel.
 *
 * Accessibility notes:
 * - type="button" prevents accidental form submission
 * - aria-label required (passed by caller) for dynamic labels
 * - aria-pressed marks toggle state (WCAG 4.1.2)
 * - min 44×44px touch target (WCAG 2.5.5)
 * - focus-visible ring distinct from brand green (WCAG 1.4.1)
 * - disabled state via attribute + opacity (WCAG 1.4.3)
 */
function ControlBtn({
  onClick,
  disabled = false,
  "aria-label": ariaLabel,
  "aria-pressed": ariaPressed,
  active = false,
  className,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "min-h-[44px] px-4 rounded-lg w-full",
        "border border-border dark:border-border-dark",
        "bg-(--color-bg) dark:bg-surface-dark",
        "text-text-primary dark:text-text-primary-dark",
        "font-semibold text-sm",
        "transition-colors duration-200",
        "hover:bg-surface-2 dark:hover:bg-[#2d3f5a]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
        "focus-visible:ring-focus dark:focus-visible:ring-focus-dark",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
        active &&
          "ring-2 ring-primary dark:ring-primary-dark bg-primary/10 dark:bg-primary-dark/10",
        className,
      )}
    >
      {children}
    </button>
  );
}

/**
 * AccessibilityWidget
 *
 * Floating action button (FAB) in the bottom-right corner that toggles
 * a popup panel with accessibility controls.
 *
 * Accessibility notes:
 * - FAB: aria-haspopup="dialog" + aria-expanded signals popup presence (WCAG 4.1.2)
 * - Panel: role="dialog" + aria-modal="true" + aria-labelledby (WCAG 4.1.2)
 * - Focus trap: Tab / Shift+Tab cycle within the open panel (WCAG 2.1.2)
 * - Escape closes the panel and returns focus to the FAB (WCAG 2.1.2)
 * - Click-outside closes the panel
 * - Live region announces font-size changes (WCAG 4.1.3)
 * - All interactive elements have visible focus rings
 * - Widget wrapper (.a11y-widget-root) is pinned to 16px so it never
 *   scales when the user adjusts the page font size
 */
export default function AccessibilityWidget() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const {
    fontSize,
    isDefault,
    sliderPct,
    increase,
    decrease,
    highContrast,
    toggleHighContrast,
    isSpeaking,
    readPage,
  } = useContext(AccessibilityContext);

  const [open, setOpen] = useState(false);
  const fabRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  // Focus the close button when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => closeRef.current?.focus(), 50);
    }
  }, [open]);

  // Escape closes panel and returns focus to FAB
  useEffect(() => {
    const handleKey = (e) => {
      if (!open) return;

      if (e.key === "Escape") {
        setOpen(false);
        fabRef.current?.focus();
      }

      // Focus trap inside the panel
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // Click-outside closes panel
  useEffect(() => {
    const handleClick = (e) => {
      if (
        open &&
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !fabRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const fontSizeLabel = isDefault
    ? "Default font size"
    : fontSize < 17
      ? `Smaller font size, ${fontSize} pixels`
      : `Larger font size, ${fontSize} pixels`;

  return (
    // .a11y-widget-root pins this subtree to 16px so it never scales
    // when document.documentElement.style.fontSize changes (WCAG 1.4.4)
    <div className="a11y-widget-root">
      {/* ── Floating Action Button ───────────────────────────────── */}
      <button
        ref={fabRef}
        type="button"
        aria-label={
          open ? "Close accessibility options" : "Open accessibility options"
        }
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-6 right-6 z-[9999]",
          "w-16 h-16 rounded-full shadow-lg",
          "inline-flex items-center justify-center",
          "bg-primary dark:bg-primary-dark",
          "text-(--color-primary-fg) dark:text-(--color-primary-dark-fg)",
          "hover:opacity-90 active:scale-95",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "focus-visible:ring-focus dark:focus-visible:ring-focus-dark",
        )}
      >
        <FaUniversalAccess aria-hidden="true" className="text-3xl" />
      </button>

      {/* ── Popup Panel ─────────────────────────────────────────── */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="a11y-panel-title"
          className={cn(
            "fixed bottom-24 right-6 z-[9998]",
            "w-72 rounded-2xl shadow-2xl",
            "bg-(--color-bg) dark:bg-bg-dark",
            "border border-border dark:border-border-dark",
            "p-4",
            "transition-colors duration-300",
          )}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between mb-4">
            <h2
              id="a11y-panel-title"
              className="text-sm font-bold uppercase tracking-widest text-text-muted dark:text-text-muted-dark"
            >
              Accessibility
            </h2>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close accessibility options"
              onClick={() => {
                setOpen(false);
                fabRef.current?.focus();
              }}
              className={cn(
                "w-8 h-8 rounded-md inline-flex items-center justify-center",
                "text-text-muted dark:text-text-muted-dark",
                "hover:bg-surface dark:hover:bg-surface-dark",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                "transition-colors duration-200",
              )}
            >
              <FaTimes aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {/* ── FONT SIZE ───────────────────────────────────────── */}
            <div
              role="group"
              aria-label="Font size control"
              className={cn(
                "p-3 rounded-xl",
                "bg-surface dark:bg-surface-dark",
                "border border-border dark:border-border-dark",
              )}
            >
              <p className="text-xs font-semibold text-text-muted dark:text-text-muted-dark mb-2">
                Font Size
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Decrease font size"
                  onClick={decrease}
                  disabled={fontSize <= 14}
                  style={{ width: 40, height: 40, fontSize: 13, flexShrink: 0 }}
                  className={cn(
                    "rounded-lg",
                    "border border-border dark:border-border-dark",
                    "bg-(--color-bg) dark:bg-bg-dark",
                    "text-text-primary dark:text-text-primary-dark font-bold",
                    "inline-flex items-center justify-center",
                    "hover:bg-surface-2 dark:hover:bg-[#2d3f5a]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                    "disabled:opacity-40 disabled:cursor-not-allowed",
                    "transition-colors duration-200",
                  )}
                >
                  A-
                </button>

                <div
                  aria-hidden="true"
                  className="flex-1 rounded-full"
                  style={{
                    height: 6,
                    background: `linear-gradient(to right,
                      var(--color-primary) ${sliderPct}%,
                      #94a3b8 ${sliderPct}%)`,
                  }}
                />

                <button
                  type="button"
                  aria-label="Increase font size"
                  onClick={increase}
                  disabled={fontSize >= 24}
                  style={{ width: 40, height: 40, fontSize: 13, flexShrink: 0 }}
                  className={cn(
                    "rounded-lg",
                    "border border-border dark:border-border-dark",
                    "bg-(--color-bg) dark:bg-bg-dark",
                    "text-text-primary dark:text-text-primary-dark font-bold",
                    "inline-flex items-center justify-center",
                    "hover:bg-surface-2 dark:hover:bg-[#2d3f5a]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                    "disabled:opacity-40 disabled:cursor-not-allowed",
                    "transition-colors duration-200",
                  )}
                >
                  A+
                </button>
              </div>

              {/* Live region for screen readers */}
              <span
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
              >
                {fontSizeLabel}
              </span>
              <p
                aria-hidden="true"
                className="text-xs text-center text-text-muted dark:text-text-muted-dark mt-1.5"
              >
                {isDefault ? "Default" : fontSize < 17 ? "Smaller" : "Larger"}
              </p>
            </div>

            {/* ── HIGH CONTRAST ───────────────────────────────────── */}
            <ControlBtn
              aria-label={
                highContrast
                  ? "Turn off high contrast mode"
                  : "Turn on high contrast mode"
              }
              aria-pressed={highContrast}
              active={highContrast}
              onClick={toggleHighContrast}
            >
              <span aria-hidden="true" className="text-base font-bold">
                A+
              </span>
              <span>High Contrast</span>
            </ControlBtn>

            {/* ── DARK MODE ───────────────────────────────────────── */}
            <ControlBtn
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              aria-pressed={isDark}
              active={isDark}
              onClick={toggleTheme}
            >
              <span
                aria-hidden="true"
                className="text-[18px] flex items-center"
              >
                {isDark ? (
                  <FaSun className="text-yellow-400" />
                ) : (
                  <FaMoon className="text-slate-400" />
                )}
              </span>
              <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
            </ControlBtn>

            {/* ── READ PAGE ───────────────────────────────────────── */}
            <ControlBtn
              aria-label={isSpeaking ? "Stop reading page" : "Read page aloud"}
              aria-pressed={isSpeaking}
              active={isSpeaking}
              onClick={readPage}
              className={cn(
                isSpeaking && [
                  "border-red-400 dark:border-red-500",
                  "text-red-600 dark:text-red-400",
                  "ring-red-400 dark:ring-red-500",
                ],
              )}
            >
              <span
                aria-hidden="true"
                className="text-[16px] flex items-center"
              >
                {isSpeaking ? (
                  <FaStop className="text-red-500" />
                ) : (
                  <FaMicrophone className="text-primary dark:text-primary-dark" />
                )}
              </span>
              <span>{isSpeaking ? "Stop Reading" : "Read Page"}</span>
            </ControlBtn>
          </div>
        </div>
      )}
    </div>
  );
}
