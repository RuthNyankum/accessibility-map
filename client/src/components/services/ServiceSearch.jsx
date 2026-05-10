import { cn } from "../../utils/cn";

/**
 * ServiceSearch
 *
 * Props:
 *   value       — string   — current search input value
 *   onChange    — fn       — called with new string on input change
 *   onSearch    — fn       — called on form submit
 *   onClear     — fn       — called when Clear is clicked
 *   totalCount  — number   — total services in the dataset
 *   shownCount  — number   — how many are currently shown after filtering
 *   loading     — boolean  — disables search while fetching
 */
export function ServiceSearch({
  value,
  onChange,
  onSearch,
  onClear,
  totalCount = 0,
  shownCount = 0,
  loading = false,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.();
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Search form — role="search" is a distinct ARIA landmark (WCAG 2.4.1) */}
      <form
        role="search"
        aria-label="Search disability support services"
        onSubmit={handleSubmit}
        className="flex flex-wrap items-center gap-3"
      >
        {/* Input */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="services-search" className="sr-only">
            Search by service name or keyword
          </label>
          <input
            id="services-search"
            type="search"
            placeholder="search by service or keyword....."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-describedby="services-search-hint"
            disabled={loading}
            className={cn(
              "w-full px-4 py-2 rounded-lg border text-sm min-h-[48px]",
              "bg-[var(--color-bg)] dark:bg-[var(--color-surface-dark)]",
              "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
              "border-[var(--color-border)] dark:border-[var(--color-border-dark)]",
              "placeholder:text-[var(--color-text-muted)] dark:placeholder:text-[var(--color-text-muted-dark)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-dark)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-colors duration-200",
            )}
          />
        </div>

        {/* Search button */}
        <button
          type="submit"
          disabled={loading}
          aria-label="Search services"
          className={cn(
            "inline-flex items-center justify-center px-6 rounded-lg font-bold text-sm",
            "min-h-[48px] min-w-[100px]",
            "bg-[var(--color-primary)] text-[var(--color-primary-fg)]",
            "dark:bg-[var(--color-primary-dark)] dark:text-[var(--color-primary-dark-fg)]",
            "hover:bg-[var(--color-primary-hover)] dark:hover:opacity-90",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            "focus-visible:ring-[var(--color-focus)] dark:focus-visible:ring-[var(--color-focus-dark)]",
          )}
        >
          Search
        </button>

        {/* Clear button */}
        <button
          type="button"
          onClick={onClear}
          disabled={loading || !value}
          aria-label="Clear search and show all services"
          className={cn(
            "inline-flex items-center justify-center px-6 rounded-lg font-bold text-sm",
            "min-h-[48px] min-w-[90px]",
            "border border-[var(--color-border)] dark:border-[var(--color-border-dark)]",
            "bg-[var(--color-bg)] dark:bg-[var(--color-surface-dark)]",
            "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
            "hover:bg-[var(--color-surface)] dark:hover:bg-[#2d3f5a]",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            "focus-visible:ring-[var(--color-focus)] dark:focus-visible:ring-[var(--color-focus-dark)]",
          )}
        >
          Clear
        </button>

        {/* Results count — aria-live so screen readers announce filter changes */}
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={cn(
            "text-sm ml-auto",
            "text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]",
          )}
        >
          {loading
            ? "Loading services..."
            : `Showing ${shownCount} of ${totalCount} services`}
        </p>
      </form>

      {/* Screen-reader hint linked to the input */}
      <p
        id="services-search-hint"
        className={cn(
          "text-xs",
          "text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]",
        )}
      >
        Type a keyword and press Search, or use the filters on the left to
        narrow results.
      </p>
    </div>
  );
}
