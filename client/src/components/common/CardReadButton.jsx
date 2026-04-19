import { useContext } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { AccessibilityContext } from "../../context/AccessibilityContext";
import { cn } from "../../utils/cn";

/**
 * CardReadButton
 *
 * Props:
 *   text      — string — the text to speak
 *   cardId    — string — must be the service.id, unique per card
 *   className — string — optional
 *
 * Usage:
 *   <CardReadButton text={cardReadText} cardId={service.id} />
 *
 * Each button checks speakingId === `card-${cardId}` so only the
 * card that is actually speaking shows the Stop/active state.
 * All other cards remain in their normal idle state.
 */
export function CardReadButton({ text, cardId, className }) {
  const { isSpeaking, speakingId, readText, stopSpeaking } =
    useContext(AccessibilityContext);

  // Only THIS card is active if its own id matches the speaking id
  const myId = `card-${cardId}`;
  const isThisActive = isSpeaking && speakingId === myId;

  const handleClick = () => {
    if (isThisActive) {
      stopSpeaking();
    } else {
      readText(text, cardId);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isThisActive ? "Stop reading" : "Read this service aloud"}
      aria-pressed={isThisActive}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold",
        "min-h-[36px] min-w-[36px]",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
        "focus-visible:ring-focus dark:focus-visible:ring-focus-dark",

        isThisActive
          ? [
              "border border-red-400 dark:border-red-500",
              "bg-red-50 dark:bg-red-950",
              "text-red-600 dark:text-red-400",
              "hover:bg-red-100 dark:hover:bg-red-900",
            ]
          : [
              "border border-border dark:border-border-dark",
              "bg-(--color-bg) dark:bg-surface-dark",
              "text-text-primary dark:text-text-primary-dark",
              "hover:bg-surface dark:hover:bg-[#2d3f5a]",
            ],

        className,
      )}
    >
      <span aria-hidden="true" className="text-[14px] flex items-center">
        {isThisActive ? (
          <FaStop className="text-red-500 dark:text-red-400" />
        ) : (
          <FaMicrophone className="text-text-secondary dark:text-text-secondary-dark" />
        )}
      </span>
      <span aria-hidden="true">{isThisActive ? "Stop" : "Read"}</span>
    </button>
  );
}
