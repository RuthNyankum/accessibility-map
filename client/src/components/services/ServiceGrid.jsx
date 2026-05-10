import { useState } from "react";
import { cn } from "../../utils/cn";
import { ServiceCard } from "./ServiceCard";

export function ServiceGrid({ services = [], loading = false }) {
  const [view, setView] = useState("grid");

  if (loading) {
    return (
      <div
        role="status"
        aria-label="Loading services"
        aria-live="polite"
        className="flex items-center justify-center py-20"
      >
        <div
          className={cn(
            "w-8 h-8 rounded-full border-4 animate-spin",
            "border-border dark:border-border-dark",
            "border-t-primary dark:border-t-primary-dark",
          )}
        />
        <span className="sr-only">Loading services, please wait</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={cn(
            "text-sm font-medium",
            "text-text-primary dark:text-text-primary-dark",
          )}
        >
          {services.length} {services.length === 1 ? "service" : "services"}{" "}
          found
        </p>

        <div
          role="group"
          aria-label="View layout"
          className="flex items-center gap-1"
        >
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-label="Switch to grid view"
            aria-pressed={view === "grid"}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg border transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-focus",
              view === "grid"
                ? "bg-primary border-primary text-primary-fg"
                : "bg-bg border-border text-text-secondary hover:bg-surface",
            )}
          >
            <span
              aria-hidden="true"
              className="grid grid-cols-2 gap-[3px] w-4 h-4"
            >
              <span className="rounded-[1px] bg-current block" />
              <span className="rounded-[1px] bg-current block" />
              <span className="rounded-[1px] bg-current block" />
              <span className="rounded-[1px] bg-current block" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => setView("list")}
            aria-label="Switch to list view"
            aria-pressed={view === "list"}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg border transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-focus",
              view === "list"
                ? "bg-primary border-primary text-primary-fg"
                : "bg-bg border-border text-text-secondary hover:bg-surface",
            )}
          >
            <span aria-hidden="true" className="flex flex-col gap-[4px] w-4">
              <span className="h-0.5 bg-current rounded block" />
              <span className="h-0.5 bg-current rounded block" />
              <span className="h-0.5 bg-current rounded block" />
            </span>
          </button>
        </div>
      </div>

      {services.length === 0 && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "flex flex-col items-center justify-center py-20 gap-3 rounded-2xl border",
            "border-border dark:border-border-dark",
            "bg-surface dark:bg-surface-dark",
          )}
        >
          <span aria-hidden="true" className="text-4xl">
            🔍
          </span>
          <p
            className={cn(
              "text-base font-bold",
              "text-text-primary dark:text-text-primary-dark",
            )}
          >
            No services found
          </p>
          <p
            className={cn(
              "text-sm",
              "text-text-muted dark:text-text-muted-dark",
            )}
          >
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {services.length > 0 && (
        <ul
          role="list"
          aria-label={`${services.length} disability support services`}
          className={cn(
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 gap-5"
              : "flex flex-col gap-4",
          )}
        >
          {services.map((service) => (
            <li key={service._id}>
              <ServiceCard service={service} listView={view === "list"} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
