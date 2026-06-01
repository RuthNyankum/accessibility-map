import { useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";
import { Badge } from "../common/Badge";

/**
 * MapMarkerPopup
 * Shown when a user clicks a map pin.
 *
 * Props:
 *   service  — the service object
 *   onClose  — fn to dismiss the popup
 *   style    — optional inline style for positioning
 */
export function MapMarkerPopup({ service, onClose, style, flipDown = false }) {
  const navigate = useNavigate();

  if (!service) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={`${service.name} service details`}
      style={style}
      className={cn(
        "absolute z-[1100] w-56 p-4 rounded-2xl border shadow-xl",
        "bg-(--color-bg) dark:bg-surface-dark",
        "border-border dark:border-border-dark",
        "-translate-x-1/2",
        flipDown ? "mt-3" : "-translate-y-full -mt-3",
      )}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close popup"
        className={cn(
          "absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full text-xs min-h-0",
          "text-text-muted dark:text-text-muted-dark",
          "hover:bg-surface-2 dark:hover:bg-[#2d3f5a]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
          "transition-colors duration-150",
        )}
      >
        ✕
      </button>

      {/* Badge */}
      <div className="mb-2 pr-6">
        <Badge type={service.badgeColor} label={service.badge} />
      </div>

      {/* Name */}
      <p
        className={cn(
          "font-bold text-sm leading-snug mb-1",
          "text-text-primary dark:text-text-primary-dark",
        )}
      >
        {service.name}
      </p>

      {/* Location */}
      <p
        className={cn(
          "flex items-center gap-1 text-xs mb-3",
          "text-text-secondary dark:text-text-secondary-dark",
        )}
      >
        <span aria-hidden="true">📍</span>
        {service.location}
      </p>

      {/* View details link */}
      <button
        type="button"
        onClick={() => navigate(`/services/${service.id}`)}
        aria-label={`View full details for ${service.name}`}
        className={cn(
          "w-full py-2 rounded-lg text-xs font-bold min-h-[36px]",
          "bg-primary text-(--color-primary-fg)",
          "dark:bg-primary-dark dark:text-(--color-primary-dark-fg)",
          "hover:bg-primary-hover dark:hover:opacity-90",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
        )}
      >
        View Details →
      </button>

      {/* Popup arrow pointing down */}
      <div
        aria-hidden="true"
        className={cn(
          flipDown
            ? "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full"
            : "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full",
          "w-3 h-3 rotate-45 -mb-1.5",
          flipDown ? "border-l border-t" : "border-r border-b",
          "bg-(--color-bg) dark:bg-surface-dark",
          "border-border dark:border-border-dark",
        )}
      />
    </div>
  );
}
