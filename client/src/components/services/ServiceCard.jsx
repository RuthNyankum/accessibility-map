import { useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";
import { Badge } from "../common/Badge";
import { CardReadButton } from "../common/CardReadButton";

/**
 * ServiceCard — single card used on both HomePage and ServicesPage.
 *
 * Props:
 *   service   — Service object
 *   listView  — boolean — compact horizontal layout for list view toggle
 */
export function ServiceCard({ service, listView = false }) {
  const navigate = useNavigate();

  const cardReadText = [
    service.name,
    `Service type: ${service.badge}.`,
    `Located at ${service.location}.`,
    service.description ?? "",
    service.phone ? `Phone: ${service.phone}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      aria-label={`${service.name} — ${service.badge} service`}
      className={cn(
        "flex transition-all duration-300 rounded-2xl border",
        "bg-(--color-bg) dark:bg-surface-dark",
        "border-border dark:border-border-dark",
        "hover:border-primary dark:hover:border-primary-dark",
        "hover:shadow-sm",
        listView ? "flex-row items-start gap-5 p-5" : "flex-col gap-3 p-6",
      )}
    >
      {/* ── Left / main column ──────────────────────────────────── */}
      <div className={cn("flex flex-col gap-3", listView && "flex-1 min-w-0")}>
        {/* Badge */}
        <Badge type={service.badgeColor} label={service.badge} />

        {/* Name */}
        <h3
          className={cn(
            "font-bold leading-snug",
            listView ? "text-base" : "text-lg",
            "text-text-primary dark:text-text-primary-dark",
          )}
        >
          {service.name}
        </h3>

        {/* Location */}
        <p
          className={cn(
            "flex items-center gap-2 text-sm",
            "text-text-secondary dark:text-text-secondary-dark",
          )}
        >
          <span aria-hidden="true">📍</span>
          <span>{service.location}</span>
        </p>

        {/* Description — the short paragraph shown in the screenshot */}
        {service.description && (
          <p
            className={cn(
              "text-sm leading-relaxed",
              "text-text-secondary dark:text-text-secondary-dark",
              listView && "line-clamp-2",
            )}
          >
            {service.description}
          </p>
        )}
      </div>

      {/* ── Right / action column ────────────────────────────────── */}
      <div
        className={cn("flex flex-col gap-3", listView && "shrink-0 items-end")}
      >
        {/* Divider above phone */}
        <div
          aria-hidden="true"
          className="h-px w-full bg-border dark:bg-border-dark"
        />

        {/* Phone */}
        {service.phone && (
          <p
            className={cn(
              "flex items-center gap-2 text-sm",
              "text-text-secondary dark:text-text-secondary-dark",
            )}
          >
            <span aria-hidden="true">📞</span>
            <a
              href={`tel:${service.phone.replace(/\s/g, "")}`}
              aria-label={`Call ${service.name} at ${service.phone}`}
              className={cn(
                "hover:underline underline-offset-2 min-h-0",
                "text-text-secondary dark:text-text-secondary-dark",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                "dark:focus-visible:ring-focus-dark rounded-sm",
              )}
            >
              Phone: {service.phone}
            </a>
          </p>
        )}

        {/* Divider above actions */}
        <div
          aria-hidden="true"
          className="h-px w-full bg-border dark:bg-border-dark"
        />

        {/* Actions row — Read + Details */}
        <div className="flex items-center gap-3">
          <CardReadButton text={cardReadText} cardId={service.id} />

          <button
            type="button"
            onClick={() => navigate(`/services/${service.id}`)}
            aria-label={`View full details for ${service.name}`}
            className={cn(
              "inline-flex items-center gap-1 text-sm font-bold min-h-0",
              "text-primary dark:text-primary-dark",
              "hover:underline underline-offset-2 transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
              "dark:focus-visible:ring-focus-dark rounded-sm",
            )}
          >
            Details <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </article>
  );
}
