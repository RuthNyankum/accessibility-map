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
              "bg-(--color-bg) dark:bg-surface-dark",
              "text-text-primary dark:text-text-primary-dark",
              "border-border dark:border-border-dark",
              "placeholder:text-text-muted dark:placeholder:text-text-muted-dark",
              "focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark",
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
            "bg-primary text-(--color-primary-fg)",
            "dark:bg-primary-dark dark:text-(--color-primary-dark-fg)",
            "hover:bg-primary-light hover:text-primary",
            "dark:hover:bg-[#052e16] dark:hover:text-primary-dark",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            "focus-visible:ring-focus dark:focus-visible:ring-focus-dark",
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
            "inline-flex items-center justify-center px-6 rounded-lg font-bold text-sm cursor-pointer",
            "min-h-[48px] min-w-[90px]",
            "border border-border dark:border-border-dark",
            "bg-(--color-bg) dark:bg-surface-dark",
            "text-text-primary dark:text-text-primary-dark",
            "hover:bg-surface dark:hover:bg-[#2d3f5a]",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            "focus-visible:ring-focus dark:focus-visible:ring-focus-dark",
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
            "text-text-muted dark:text-text-muted-dark",
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
        className={cn("text-xs", "text-text-muted dark:text-text-muted-dark")}
      >
        Type a keyword and press Search, or use the filters on the left to
        narrow results.
      </p>
    </div>
  );
}
