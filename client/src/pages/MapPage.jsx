import { useState, useEffect, useCallback } from "react";
import { cn } from "../utils/cn";
import { MapSidebar } from "../components/map/MapSidebar";
import { MapView } from "../components/map/MapView";

// ── CONSTANTS ──────────────────────────────────────────────────────────────
// Filter options for disability types (used in sidebar dropdown + filtering)
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
 * Converts backend service format into a map-friendly format.
 * - Extracts coordinates from nested structure
 * - Ensures safe fallback values
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
        <p className="text-sm font-bold text-text-muted dark:text-text-muted-dark">
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
      <p className="font-bold text-danger dark:text-danger-dark">{message}</p>

      <button
        type="button"
        onClick={onRetry}
        className={cn(
          "px-6 py-2.5 rounded-xl font-bold text-sm min-h-[44px]",
          "bg-primary text-(--color-primary-fg)",
          "dark:bg-primary-dark dark:text-(--color-primary-dark-fg)",
          "hover:bg-primary-hover",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
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
  // ── STATE ──────────────────────────────────────────────────────────────
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [selectedId, setSelectedId] = useState(null);

  /**
   * Mobile accessibility state:
   * controls whether user is viewing list OR map on small screens
   */
  const [viewMode, setViewMode] = useState("list"); // "list" | "map"

  // ── FETCH SERVICES ─────────────────────────────────────────────────────
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      const res = await fetch(`${API_BASE}/services?page=1&limit=100`, {
        headers,
      });

      if (!res.ok) {
        throw new Error("Failed to load services");
      }

      const json = await res.json();
      const all = json.services ?? [];

      // Remove services without coordinates (cannot render on map)
      const withCoords = all.filter(
        (s) => s.coordinates?.lat && s.coordinates?.lng,
      );

      setAllServices(withCoords.map(normaliseService));
    } catch (err) {
      setError(err.message || "Error loading services");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    document.title = "Service Map — AbilityMap Ghana";
    fetchServices();
  }, [fetchServices]);

  // ── FILTERING ─────────────────────────────────────────────────────────
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

  return (
    <div
      className={cn("flex flex-col", "bg-(--color-bg) dark:bg-bg-dark")}
      style={{ height: "calc(100vh - 116px)" }}
    >
      {/* ── HEADER ───────────────────────────────────────────────────── */}
      <header className="px-6 pt-5 pb-3 border-b border-border dark:border-border-dark">
        <h1 className="text-xl font-black text-text-primary dark:text-text-primary-dark">
          Service Map
        </h1>

        {/* Mobile view toggle (accessibility improvement) */}
        <div className="flex gap-2 mt-3 md:hidden">
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex-1 py-2 rounded-lg font-bold text-sm",
              viewMode === "list"
                ? "bg-primary text-white"
                : "bg-surface dark:bg-surface-dark",
            )}
            aria-pressed={viewMode === "list"}
          >
            List
          </button>

          <button
            onClick={() => setViewMode("map")}
            className={cn(
              "flex-1 py-2 rounded-lg font-bold text-sm",
              viewMode === "map"
                ? "bg-primary text-white"
                : "bg-surface dark:bg-surface-dark",
            )}
            aria-pressed={viewMode === "map"}
          >
            Map
          </button>
        </div>
      </header>

      {/* ── BODY ─────────────────────────────────────────────────────── */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorBanner message={error} onRetry={fetchServices} />
      ) : (
        <div className="flex flex-1 min-h-0">
          {/* ── DESKTOP SIDEBAR (unchanged UX) ─────────────────────── */}
          <div className="hidden md:flex">
            <MapSidebar
              search={search}
              onSearchChange={setSearch}
              typeFilter={typeFilter}
              onTypeChange={setTypeFilter}
              services={filtered}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>

          {/* ── MOBILE LIST VIEW ───────────────────────────────────── */}
          {viewMode === "list" && (
            <div className="md:hidden flex-1 overflow-auto">
              <MapSidebar
                search={search}
                onSearchChange={setSearch}
                typeFilter={typeFilter}
                onTypeChange={setTypeFilter}
                services={filtered}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
          )}

          {/* ── MAP VIEW ───────────────────────────────────────────── */}
          <div
            className={cn(
              "flex-1 min-w-0",
              viewMode === "list" ? "hidden md:block" : "block",
            )}
          >
            <MapView
              services={filtered}
              selectedId={selectedId}
              onPinClick={setSelectedId}
            />
          </div>
        </div>
      )}
    </div>
  );
}
