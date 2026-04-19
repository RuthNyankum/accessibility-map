import { cn } from "../../utils/cn";

const BADGE_STYLES = {
  physical:
    "bg-[var(--color-badge-physical-bg)] text-[var(--color-badge-physical-fg)] dark:bg-[var(--color-badge-physical-bg-dark)] dark:text-[var(--color-badge-physical-fg-dark)]",
  visual:
    "bg-[var(--color-badge-visual-bg)] text-[var(--color-badge-visual-fg)] dark:bg-[var(--color-badge-visual-bg-dark)] dark:text-[var(--color-badge-visual-fg-dark)]",
  hearing:
    "bg-[var(--color-badge-hearing-bg)] text-[var(--color-badge-hearing-fg)] dark:bg-[var(--color-badge-hearing-bg-dark)] dark:text-[var(--color-badge-hearing-fg-dark)]",
  mental:
    "bg-[var(--color-badge-mental-bg)] text-[var(--color-badge-mental-fg)] dark:bg-[var(--color-badge-mental-bg-dark)] dark:text-[var(--color-badge-mental-fg-dark)]",
  speech:
    "bg-[var(--color-badge-speech-bg)] text-[var(--color-badge-speech-fg)] dark:bg-[var(--color-badge-speech-bg-dark)] dark:text-[var(--color-badge-speech-fg-dark)]",
  intellectual:
    "bg-[var(--color-badge-intellectual-bg)] text-[var(--color-badge-intellectual-fg)] dark:bg-[var(--color-badge-intellectual-bg-dark)] dark:text-[var(--color-badge-intellectual-fg-dark)]",
};

export function Badge({ type, label }) {
  return (
    <span
      className={cn(
        "inline-block px-3 py-1 rounded-full text-xs font-bold w-full max-w-[160px] text-center",
        BADGE_STYLES[type] ?? BADGE_STYLES.physical,
      )}
      aria-label={`Service type: ${label}`}
    >
      {label}
    </span>
  );
}
