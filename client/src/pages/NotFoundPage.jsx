import { Link } from "react-router-dom";
import { cn } from "../utils/cn";

export default function NotFoundPage() {
  return (
    <main
      id="main-content"
      className={cn(
        "flex flex-col items-center justify-center min-h-screen px-4 text-center",
        "bg-(--color-bg) dark:bg-bg-dark",
      )}
      aria-labelledby="not-found-title"
    >
      {/* Screen reader gets a clear page description */}
      <p className="sr-only">Error 404 — Page not found</p>

      <span aria-hidden="true" className="text-6xl mb-4">
        🗺️
      </span>

      <h1
        id="not-found-title"
        className={cn(
          "text-7xl font-black mb-4",
          "text-primary dark:text-primary-dark",
        )}
      >
        404
      </h1>

      <h2
        className={cn(
          "text-2xl font-bold mb-3",
          "text-text-primary dark:text-text-primary-dark",
        )}
      >
        Page Not Found
      </h2>

      <p
        className={cn(
          "text-base max-w-md mb-8 leading-relaxed",
          "text-text-secondary dark:text-text-secondary-dark",
        )}
      >
        The page you're looking for doesn't exist or may have been moved. Try
        going back home or browsing our services.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/"
          className={cn(
            "px-8 py-3 rounded-xl font-bold text-sm min-h-[52px]",
            "inline-flex items-center justify-center",
            "bg-primary text-(--color-primary-fg)",
            "dark:bg-primary-dark dark:text-(--color-primary-dark-fg)",
            "hover:bg-primary-hover dark:hover:opacity-90",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus",
          )}
        >
          Go Back Home
        </Link>

        <Link
          to="/services"
          className={cn(
            "px-8 py-3 rounded-xl font-bold text-sm min-h-[52px]",
            "inline-flex items-center justify-center",
            "border border-border dark:border-border-dark",
            "text-text-primary dark:text-text-primary-dark",
            "hover:bg-surface dark:hover:bg-[#2d3f5a]",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
          )}
        >
          Browse Services
        </Link>
      </div>
    </main>
  );
}
