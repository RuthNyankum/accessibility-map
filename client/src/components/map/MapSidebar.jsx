import { useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";
import { Badge } from "../common/Badge";

const TYPE_OPTIONS = [
  "All types",
  "Physical",
  "Visual",
  "Hearing",
  "Mental Health",
  "Speech",
  "Intellectual",
];

/**
 * MapSidebarCard — one service entry in the sidebar list.
 */
function MapSidebarCard({ service, isSelected, onClick }) {
  return (
    <button
      type="button"
      id={`map-sidebar-${service.id}`}
      onClick={onClick}
      aria-label={`${service.name} in ${service.location}. ${isSelected ? "Selected." : "Click to highlight on map."}`}
      aria-pressed={isSelected}
      className={cn(
        "w-full text-left flex flex-col gap-2 px-4 py-4 border-b",
        "border-[var(--color-border)] dark:border-[var(--color-border-dark)]",
        "transition-colors duration-150",
        isSelected
          ? "bg-[var(--color-primary-light)] dark:bg-[#052e16]"
          : [
              "bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]",
              "hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-surface-dark)]",
            ],
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus)]",
      )}
    >
      <Badge type={service.badgeColor} label={service.badge} />

      <p
        className={cn(
          "font-bold text-base leading-snug",
          "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
        )}
      >
        {service.name}
      </p>

      <p
        className={cn(
          "flex items-center gap-1.5 text-xs",
          "text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]",
        )}
      >
        <span aria-hidden="true">📍</span>
        {service.location}
      </p>
    </button>
  );
}

/**
 * MapSidebar
 *
 * Props:
 *   search         — string
 *   onSearchChange — fn(value: string)
 *   typeFilter     — string
 *   onTypeChange   — fn(value: string)
 *   services       — filtered Service[]
 *   selectedId     — string | null
 *   onSelect       — fn(id: string | null)
 */
export function MapSidebar({
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
  services,
  selectedId,
  onSelect,
}) {
  const navigate = useNavigate();
  const selectedService = services.find((s) => s.id === selectedId);

  return (
    <aside
      aria-label="Service filters and list"
      className={cn(
        "w-64 shrink-0 flex flex-col border-r overflow-hidden",
        "border-[var(--color-border)] dark:border-[var(--color-border-dark)]",
        "bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]",
        "transition-colors duration-300",
      )}
    >
      {/* Search + filter controls */}
      <div
        className={cn(
          "px-4 py-4 border-b shrink-0 flex flex-col gap-3",
          "border-[var(--color-border)] dark:border-[var(--color-border-dark)]",
        )}
      >
        {/* Search */}
        <div role="search" aria-label="Search services on map">
          <label htmlFor="map-search" className="sr-only">
            Search services by name or location
          </label>
          <input
            id="map-search"
            type="search"
            placeholder="Search services...."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              "w-full px-4 py-2.5 rounded-xl border text-sm min-h-[44px]",
              "bg-[var(--color-bg)] dark:bg-[var(--color-surface-dark)]",
              "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
              "border-[var(--color-border)] dark:border-[var(--color-border-dark)]",
              "placeholder:text-[var(--color-text-muted)] dark:placeholder:text-[var(--color-text-muted-dark)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-dark)]",
              "transition-colors duration-200",
            )}
          />
        </div>

        {/* Type filter */}
        <div>
          <label htmlFor="map-type" className="sr-only">
            Filter by disability type
          </label>
          <select
            id="map-type"
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className={cn(
              "w-full px-4 py-2.5 rounded-xl border text-sm min-h-[44px] cursor-pointer",
              "bg-[var(--color-bg)] dark:bg-[var(--color-surface-dark)]",
              "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
              "border-[var(--color-border)] dark:border-[var(--color-border-dark)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-dark)]",
              "transition-colors duration-200",
            )}
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Results count — live region for screen readers */}
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={cn(
            "text-xs font-bold text-center",
            "text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]",
          )}
        >
          {services.length} {services.length === 1 ? "service" : "services"}{" "}
          shown
        </p>
      </div>

      {/* Service list */}
      <div className="flex-1 overflow-y-auto">
        {services.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-10 px-4 gap-2"
            role="status"
          >
            <span aria-hidden="true" className="text-2xl">
              🔍
            </span>
            <p className="text-xs text-center text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
              No services match your filters
            </p>
          </div>
        ) : (
          <ul
            role="list"
            aria-label={`${services.length} disability support services`}
            className="list-none p-0 m-0"
          >
            {services.map((service) => (
              <li key={service.id}>
                <MapSidebarCard
                  service={service}
                  isSelected={selectedId === service.id}
                  onClick={() =>
                    onSelect(selectedId === service.id ? null : service.id)
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* View details button — only shown when a service is selected */}
      {selectedService && (
        <div
          className={cn(
            "px-4 py-3 border-t shrink-0",
            "border-[var(--color-border)] dark:border-[var(--color-border-dark)]",
          )}
        >
          <button
            type="button"
            onClick={() => navigate(`/services/${selectedService.id}`)}
            aria-label={`View full details for ${selectedService.name}`}
            className={cn(
              "w-full py-2.5 rounded-xl font-bold text-sm min-h-[44px]",
              "bg-[var(--color-primary)] text-[var(--color-primary-fg)]",
              "dark:bg-[var(--color-primary-dark)] dark:text-[var(--color-primary-dark-fg)]",
              "hover:bg-[var(--color-primary-hover)] dark:hover:opacity-90",
              "transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]",
            )}
          >
            View Details →
          </button>
        </div>
      )}
    </aside>
  );
}
