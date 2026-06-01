import { useState } from "react";
import { cn } from "../../utils/cn";
import { MapMarkerPopup } from "./MapMarkerPopup";

// Colorblind-safe pin colors — matching your design tokens
const PIN_COLORS = {
  Physical: "#0e7490",
  Visual: "#065f46",
  Hearing: "#92400e",
  "Mental Health": "#5b21b6",
  Speech: "#9d174d",
  Intellectual: "#065f46",
};

// Ghana bounding box for proportional pin placement
const GHANA = { minLat: 4.5, maxLat: 11.2, minLng: -3.5, maxLng: 1.2 };

const toPercent = (lat, lng) => ({
  x: ((lng - GHANA.minLng) / (GHANA.maxLng - GHANA.minLng)) * 100,
  y: 100 - ((lat - GHANA.minLat) / (GHANA.maxLat - GHANA.minLat)) * 100,
});

/**
 * MapLegend — fixed bottom-left overlay showing pin color meanings.
 * aria-hidden because the sidebar list already conveys this information
 * to screen readers — this is purely visual.
 */
function MapLegend() {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute bottom-4 left-4 z-[1000] p-4 rounded-xl border shadow-lg",
        "bg-(--color-bg) dark:bg-surface-dark",
        "border-border dark:border-border-dark",
      )}
    >
      <p className="text-[10px] font-black tracking-widest uppercase mb-3 text-text-muted dark:text-text-muted-dark">
        Type
      </p>
      <ul className="flex flex-col gap-2 list-none p-0 m-0">
        {Object.entries(PIN_COLORS).map(([label, color]) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs font-bold text-text-secondary dark:text-text-secondary-dark">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * MapView
 *
 * Renders a proportional SVG placeholder map of Ghana with service pins.
 * Replace the inner content with <MapContainer> from react-leaflet for
 * a real interactive map — see comment block below.
 *
 * Props:
 *   services    — filtered Service[]
 *   selectedId  — string | null — currently selected service id
 *   onPinClick  — fn(id: string)
 *
 * ── To use Leaflet (real maps) ───────────────────────────────────────────────
 * npm install react-leaflet leaflet
 *
 * import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
 * import "leaflet/dist/leaflet.css";
 *
 * Replace MapCanvas contents with:
 * <MapContainer center={[7.9465, -1.0232]} zoom={7} style={{ height: "100%", width: "100%" }}>
 *   <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
 *     attribution='&copy; OpenStreetMap contributors' />
 *   {services.map(s => (
 *     <Marker key={s.id} position={[s.lat, s.lng]}
 *       icon={createColorIcon(PIN_COLORS[s.badge])}
 *       eventHandlers={{ click: () => onPinClick(s.id) }}>
 *       <Popup><MapMarkerPopup service={s} /></Popup>
 *     </Marker>
 *   ))}
 * </MapContainer>
 * ────────────────────────────────────────────────────────────────────────────
 */
export function MapView({ services = [], selectedId, onPinClick }) {
  const [popupId, setPopupId] = useState(null);

  const handlePinClick = (id) => {
    const next = popupId === id ? null : id;
    setPopupId(next);
    onPinClick?.(next);
  };

  const popupService = services.find((s) => s.id === popupId);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        "bg-map-bg dark:bg-map-bg-dark",
      )}
      style={{ height: "100%", paddingTop: "80px", boxSizing: "border-box" }}
      role="img"
      aria-label={`Map of Ghana showing ${services.length} disability support ${services.length === 1 ? "service" : "services"}`}
    >
      {/* ── Grid lines ──────────────────────────────────────────── */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20 pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="mapgrid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="var(--color-map-road)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapgrid)" />
      </svg>

      {/* ── Region labels ─────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[
          { label: "Greater Accra", top: "78%", left: "58%" },
          { label: "Ashanti", top: "55%", left: "42%" },
          { label: "Western", top: "68%", left: "18%" },
          { label: "Central", top: "70%", left: "36%" },
          { label: "Eastern", top: "62%", left: "55%" },
          { label: "Volta", top: "58%", left: "72%" },
          { label: "Northern", top: "28%", left: "50%" },
          { label: "Upper East", top: "10%", left: "60%" },
          { label: "Upper West", top: "12%", left: "32%" },
          { label: "Brong-Ahafo", top: "44%", left: "40%" },
          { label: "Savannah", top: "22%", left: "42%" },
          { label: "Bono East", top: "44%", left: "56%" },
          { label: "Ahafo", top: "52%", left: "30%" },
          { label: "Western North", top: "50%", left: "18%" },
          { label: "Oti", top: "46%", left: "68%" },
          { label: "North East", top: "16%", left: "58%" },
        ].map(({ label, top, left }) => (
          <span
            key={label}
            className="absolute text-[10px] font-bold uppercase tracking-wider text-map-road dark:text-map-road-dark"
            style={{ top, left }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* ── Service pins ──────────────────────────────────────────── */}
      {services.map((service) => {
        const { x, y } = toPercent(service.lat, service.lng);
        const color = PIN_COLORS[service.badge] || "#006400";
        const isSelected = selectedId === service.id || popupId === service.id;

        return (
          <div
            key={service.id}
            style={{ left: `${x}%`, top: `${y}%` }}
            className="absolute -translate-x-1/2 -translate-y-full"
          >
            {/* Pin button */}
            <button
              type="button"
              onClick={() => handlePinClick(service.id)}
              aria-label={`${service.name} — ${service.badge} service in ${service.location}. Click to view details.`}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full",
                "text-white text-sm font-black shadow-lg",
                "border-2 border-white dark:border-slate-700",
                "transition-transform duration-150 hover:scale-110",
                isSelected &&
                  "scale-125 ring-2 ring-offset-2 ring-white dark:ring-slate-700",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
              )}
              style={{ backgroundColor: color }}
            >
              <span aria-hidden="true">+</span>
            </button>

            {/* Always-visible name tag */}
            <div
              aria-hidden="true"
              className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 mt-0.5",
                "px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shadow-sm pointer-events-none",
                "bg-(--color-bg) dark:bg-surface-dark",
                "text-text-primary dark:text-text-primary-dark",
                "border border-border dark:border-border-dark",
              )}
            >
              {service.name.split(" ").slice(0, 2).join(" ")}
            </div>
          </div>
        );
      })}

      {/* ── Popup ───────────────────────────────────────────────── */}
      {popupService &&
        (() => {
          const { x, y } = toPercent(popupService.lat, popupService.lng);
          const flipDown = y < 35; // pin is near top — show popup below instead
          return (
            <MapMarkerPopup
              service={popupService}
              onClose={() => {
                setPopupId(null);
                onPinClick?.(null);
              }}
              style={{ left: `${x}%`, top: `${y}%` }}
              flipDown={flipDown}
            />
          );
        })()}

      {/* ── Legend ──────────────────────────────────────────────── */}
      <MapLegend />
    </div>
  );
}
