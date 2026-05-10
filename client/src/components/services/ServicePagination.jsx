import { cn } from "../../utils/cn";

export function ServicePagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) {
  const btnBase = cn(
    "inline-flex items-center justify-center min-h-[44px] min-w-[44px]",
    "rounded-lg border text-sm font-bold",
    "transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
    "focus-visible:ring-[var(--color-focus)] dark:focus-visible:ring-[var(--color-focus-dark)]",
  );
  const idleBtn = cn(
    btnBase,
    "border-[var(--color-border)] dark:border-[var(--color-border-dark)]",
    "bg-[var(--color-bg)] dark:bg-[var(--color-surface-dark)]",
    "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
    "hover:bg-[var(--color-surface)] dark:hover:bg-[#2d3f5a]",
  );
  const activeBtn = cn(
    btnBase,
    "border-[var(--color-primary)] dark:border-[var(--color-primary-dark)]",
    "bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)]",
    "text-[var(--color-primary-fg)] dark:text-[var(--color-primary-dark-fg)]",
  );
  const disabledBtn = cn(
    btnBase,
    "border-[var(--color-border)] dark:border-[var(--color-border-dark)]",
    "bg-[var(--color-bg)] dark:bg-[var(--color-surface-dark)]",
    "text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]",
    "opacity-40 cursor-not-allowed",
  );

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 py-6"
    >
      <button
        type="button"
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        aria-disabled={currentPage === 1}
        className={currentPage === 1 ? disabledBtn : idleBtn}
      >
        <span aria-hidden="true">&lt;</span>
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange?.(page)}
          aria-label={`Go to page ${page}`}
          aria-current={page === currentPage ? "page" : undefined}
          className={page === currentPage ? activeBtn : idleBtn}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        aria-disabled={currentPage === totalPages}
        className={currentPage === totalPages ? disabledBtn : idleBtn}
      >
        <span aria-hidden="true">&gt;</span>
      </button>
    </nav>
  );
}
