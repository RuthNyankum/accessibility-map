import { useState, useEffect, useCallback } from "react";
import { cn } from "../utils/cn";
import { MapSidebar } from "../components/map/MapSidebar";
import { MapView } from "../components/map/MapView";

// ── CONSTANTS ──────────────────────────────────────────────────────────────
const TYPE_OPTIONS = [
  "All types",
  "Physical",
  "Visual",
  "Hearing",
  "Mental Health",
  "Speech",
  "Intellectual",
];

// ── API ────────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL;

/**
 * normaliseService
 *
 * Your schema already uses `badge`, `badgeColor`, `location`, `phone`,
 * `email`, `website`, `hours`, `description` — so almost no remapping needed.
 * The only difference is coordinates: your schema stores { lat, lng } nested
 * under `coordinates`, so we pull those out to the top level for MapView.
 */
function normaliseService(raw) {
  return {
    id: String(raw._id),
    name: raw.name,
    badge: raw.badge,
    badgeColor: raw.badgeColor,
    location: raw.location,
    region: raw.region ?? "",
    address: raw.address ?? "",
    phone: raw.phone ?? "",
    email: raw.email ?? "",
    website: raw.website ?? "",
    hours: raw.hours ?? "",
    description: raw.description ?? "",
    about: raw.about ?? "",
    tags: raw.tags ?? [],
    lat: Number(raw.coordinates?.lat ?? 0),
    lng: Number(raw.coordinates?.lng ?? 0),
  };
}

// ── LOADING SKELETON ───────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div
      className="flex items-center justify-center flex-1"
      role="status"
      aria-label="Loading services"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
          style={{
            borderColor: `var(--color-border)`,
            borderTopColor: "var(--color-primary)",
          }}
          aria-hidden="true"
        />
        <p className="text-sm font-bold text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
          Loading services…
        </p>
      </div>
    </div>
  );
}

// ── ERROR BANNER ───────────────────────────────────────────────────────────
function ErrorBanner({ message, onRetry }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex flex-col items-center justify-center flex-1 gap-4 px-6 text-center"
    >
      <span aria-hidden="true" className="text-4xl">
        ⚠️
      </span>
      <p className="font-bold text-[var(--color-danger)] dark:text-[var(--color-danger-dark)]">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className={cn(
          "px-6 py-2.5 rounded-xl font-bold text-sm min-h-[44px]",
          "bg-[var(--color-primary)] text-[var(--color-primary-fg)]",
          "dark:bg-[var(--color-primary-dark)] dark:text-[var(--color-primary-dark-fg)]",
          "hover:bg-[var(--color-primary-hover)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]",
          "transition-colors duration-200",
        )}
        aria-label="Retry loading services"
      >
        Try again
      </button>
    </div>
  );
}

// ── MAP PAGE ───────────────────────────────────────────────────────────────
export default function MapPage() {
  // ── State ──
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [selectedId, setSelectedId] = useState(null);

  // ── Fetch ALL approved services (loop through pages) ───────────────────
  // The API paginates (default limit=8). For the map we want every pin,
  // so we fetch page by page until we have them all.
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // ── First request — get total so we know how many pages to fetch ──
      const firstRes = await fetch(`${API_BASE}/services?page=1&limit=100`, {
        headers,
      });

      if (!firstRes.ok) {
        throw new Error(
          `Failed to load services (${firstRes.status} ${firstRes.statusText})`,
        );
      }

      const firstJson = await firstRes.json();
      // Your API returns: { services: [...], total, page, totalPages }
      const { services: firstBatch, totalPages } = firstJson;

      let all = [...firstBatch];

      // ── Fetch remaining pages in parallel if needed ────────────────────
      if (totalPages > 1) {
        const pageNumbers = Array.from(
          { length: totalPages - 1 },
          (_, i) => i + 2,
        );

        const rest = await Promise.all(
          pageNumbers.map((p) =>
            fetch(`${API_BASE}/services?page=${p}&limit=100`, { headers })
              .then((r) => r.json())
              .then((j) => j.services ?? []),
          ),
        );

        all = all.concat(rest.flat());
      }

      // ── Drop services with no coordinates — can't place them on map ───
      const withCoords = all.filter(
        (s) => s.coordinates?.lat != null && s.coordinates?.lng != null,
      );

      if (withCoords.length < all.length) {
        console.warn(
          `[MapPage] ${all.length - withCoords.length} service(s) skipped — missing coordinates.`,
        );
      }

      setAllServices(withCoords.map(normaliseService));
    } catch (err) {
      console.error("[MapPage] fetch error:", err);
      setError(
        err.message ||
          "Could not load services. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    document.title = "Service Map — AbilityMap Ghana";
    fetchServices();
  }, [fetchServices]);

  // ── Client-side filtering ──────────────────────────────────────────────
  // Search hits name, location, address, and badge
  const filtered = allServices.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      s.badge.toLowerCase().includes(q);
    const matchType = typeFilter === "All types" || s.badge === typeFilter;
    return matchSearch && matchType;
  });

  // Clear selection if filtered out
  useEffect(() => {
    if (selectedId && !filtered.find((s) => s.id === selectedId)) {
      setSelectedId(null);
    }
  }, [search, typeFilter]);

  // ── Pin / sidebar selection ────────────────────────────────────────────
  const handleSelect = (id) => {
    setSelectedId(id);
    if (id) {
      setTimeout(() => {
        document
          .getElementById(`map-sidebar-${id}`)
          ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 50);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "flex flex-col",
        "bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]",
        "transition-colors duration-300",
      )}
      style={{ height: "calc(100vh - 116px)" }}
    >
      {/* Page header */}
      <header
        className={cn(
          "px-6 pt-5 pb-4 shrink-0 border-b",
          "border-[var(--color-border)] dark:border-[var(--color-border-dark)]",
        )}
      >
        <h1
          className={cn(
            "text-xl font-black",
            "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
          )}
        >
          Service Map
        </h1>
        <p
          className={cn(
            "text-sm mt-0.5",
            "text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]",
          )}
        >
          {loading
            ? "Loading services…"
            : error
              ? "Could not load services"
              : `${allServices.length} service${allServices.length !== 1 ? "s" : ""} across Ghana`}
        </p>
      </header>

      {/* Body */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorBanner message={error} onRetry={fetchServices} />
      ) : (
        <div className="flex flex-1 min-h-0">
          <MapSidebar
            search={search}
            onSearchChange={setSearch}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            typeOptions={TYPE_OPTIONS}
            services={filtered}
            selectedId={selectedId}
            onSelect={handleSelect}
          />

          <div className="flex-1 min-w-0 relative">
            <MapView
              services={filtered}
              selectedId={selectedId}
              onPinClick={handleSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
}
