import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { AccessibilityContext } from "../../context/AccessibilityContext";
import { cn } from "../../utils/cn";
import { FaSun, FaMoon, FaMicrophone, FaStop } from "react-icons/fa";

/**
 * BarBtn — base button for the accessibility toolbar.
 *
 * Accessibility notes:
 * - type="button" prevents accidental form submission if ever nested in a form
 * - aria-label always required (passed by caller) — visible text alone is not
 *   enough when the label changes dynamically (e.g. "Dark Mode" / "Light Mode")
 * - aria-pressed marks toggle state for screen readers (WCAG 4.1.2)
 * - focus-visible ring is distinct from primary green to avoid confusion (WCAG 1.4.1)
 * - disabled state communicated via both attribute and reduced opacity (WCAG 1.4.3)
 */
function BarBtn({
  onClick,
  disabled = false,
  "aria-label": ariaLabel,
  "aria-pressed": ariaPressed,
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
        "inline-flex items-center justify-center gap-1.5",
        "min-h-[44px] min-w-[44px] px-3 rounded-md",
        "border border-border dark:border-border-dark",
        "bg-(--color-bg) dark:bg-surface-dark",
        "text-text-primary dark:text-text-primary-dark",
        "font-bold text-sm",
        "transition-colors duration-200",
        "hover:bg-surface-2 dark:hover:bg-[#2d3f5a]",
        // Focus ring uses blue — distinct from primary green (WCAG 1.4.1)
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
        "focus-visible:ring-focus dark:focus-visible:ring-focus-dark",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Purely visual separator — hidden from screen readers */
function Sep() {
  return (
    <div
      aria-hidden="true"
      className={cn("w-px h-6 mx-2 shrink-0", "bg-border dark:bg-border-dark")}
    />
  );
}

export default function AccessibilityBar() {
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

  // Human-readable font size label announced to screen readers
  const fontSizeLabel = isDefault
    ? "Default font size"
    : fontSize < 17
      ? `Smaller font size, ${fontSize} pixels`
      : `Larger font size, ${fontSize} pixels`;

  return (
    <div
      role="toolbar"
      aria-label="Accessibility tools"
      className={cn(
        "flex items-center h-[52px] px-8 overflow-x-auto gap-0",
        "bg-surface dark:bg-surface-dark",
        "border-b border-border dark:border-border-dark",
        "transition-colors duration-300",
      )}
    >
      {/* "ACCESSIBILITY" label — decorative, hidden from screen readers
          because the toolbar's aria-label already describes it */}
      <span
        aria-hidden="true"
        className={cn(
          "text-[11px] font-bold tracking-widest uppercase shrink-0",
          "text-text-muted dark:text-text-muted-dark",
          "pr-5 mr-4",
          "border-r border-border dark:border-border-dark",
        )}
      >
        Accessibility
      </span>

      {/* ── FONT SIZE GROUP ────────────────────────────────────────── */}
      <div
        role="group"
        aria-label="Font size control"
        className="flex items-center gap-2 shrink-0"
      >
        <BarBtn
          aria-label="Decrease font size"
          onClick={decrease}
          disabled={fontSize <= 14}
        >
          A-
        </BarBtn>

        {/* Visual track — aria-hidden */}
        <div
          aria-hidden="true"
          className="w-24 h-1 rounded-full shrink-0 transition-all duration-200"
          style={{
            background: `linear-gradient(to right,
              var(--color-primary) ${sliderPct}%,
              var(--color-border) ${sliderPct}%)`,
          }}
        />

        {/* Live region — screen readers announce size changes */}
        <span
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={cn(
            "text-xs w-14 shrink-0",
            "text-text-muted dark:text-text-muted-dark",
          )}
        >
          <span aria-hidden="true">
            {isDefault ? "Default" : fontSize < 17 ? "Smaller" : "Larger"}
          </span>
          <span className="sr-only">{fontSizeLabel}</span>
        </span>

        <BarBtn
          aria-label="Increase font size"
          onClick={increase}
          disabled={fontSize >= 24}
          className="text-base"
        >
          A+
        </BarBtn>
      </div>

      <Sep />

      {/* ── HIGH CONTRAST ─────────────────────────────────────────── */}
      <BarBtn
        aria-label={
          highContrast
            ? "Turn off high contrast mode"
            : "Turn on high contrast mode"
        }
        aria-pressed={highContrast}
        onClick={toggleHighContrast}
        className={cn(
          "text-base",
          highContrast && "ring-2 ring-primary dark:ring-primary-dark",
        )}
      >
        <span aria-hidden="true">A+</span>
      </BarBtn>

      <Sep />

      {/* ── DARK MODE ─────────────────────────────────────────────── */}
      <BarBtn
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={isDark}
        onClick={toggleTheme}
      >
        <span
          aria-hidden="true"
          className="text-[18px] flex items-center justify-center"
        >
          {isDark ? (
            <FaSun className="text-yellow-400" />
          ) : (
            <FaMoon className="text-slate-400" />
          )}
        </span>
        <span aria-hidden="true" className="ml-2">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      </BarBtn>

      <Sep />

      {/* ── READ PAGE ─────────────────────────────────────────────── */}
      <BarBtn
        aria-label={isSpeaking ? "Stop reading page" : "Read page aloud"}
        aria-pressed={isSpeaking}
        onClick={readPage}
        className={cn(
          isSpeaking && [
            "border-red-400 dark:border-red-500",
            "text-red-600 dark:text-red-400",
          ],
        )}
      >
        <span
          aria-hidden="true"
          className="text-[16px] flex items-center justify-center"
        >
          {isSpeaking ? (
            <FaStop className="text-red-500" />
          ) : (
            <FaMicrophone className="text-primary dark:text-primary-dark" />
          )}
        </span>
        <span aria-hidden="true" className="ml-2">
          {isSpeaking ? "Stop Reading" : "Read Page"}
        </span>
      </BarBtn>
    </div>
  );
}
