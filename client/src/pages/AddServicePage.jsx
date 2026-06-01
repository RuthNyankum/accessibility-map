import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { cn } from "../utils/cn";
import "leaflet/dist/leaflet.css";
import API from "../services/api";

// ─── Constants (single source of truth) ──────────────────────────────────────
import {
  CATEGORIES,
  DISABILITY_TYPES,
  TARGET_GROUPS,
  REGIONS,
  BADGE_COLOR_MAP,
  LIMITS,
  PHONE_REGEX,
  PHONE_HINT,
  STEPS,
  GHANA_CENTER,
  DEFAULT_ZOOM,
} from "../constants/servicesData";

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ─── Shared input classes ─────────────────────────────────────────────────────

const inputBase = (hasError) =>
  cn(
    "w-full px-4 py-3 rounded-xl border text-sm min-h-[52px]",
    "bg-[var(--color-bg)] dark:bg-[var(--color-surface-dark)]",
    "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
    "placeholder:text-[var(--color-text-muted)] dark:placeholder:text-[var(--color-text-muted-dark)]",
    "focus:outline-none focus:ring-2 transition-colors duration-200",
    hasError
      ? "border-[var(--color-danger)] focus:ring-[var(--color-danger)]"
      : "border-[var(--color-border)] dark:border-[var(--color-border-dark)] focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-dark)]",
  );

const labelBase = cn(
  "block text-sm font-bold mb-2",
  "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
);

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="text-xs mt-1.5 text-danger dark:text-danger-dark"
    >
      {message}
    </p>
  );
}

function ProgressSidebar({ currentStep, completedSteps }) {
  return (
    <aside
      aria-label="Form progress"
      className={cn(
        "hidden md:block w-52 shrink-0 p-5 rounded-2xl border self-start",
        "bg-surface dark:bg-surface-dark",
        "border-border dark:border-border-dark",
      )}
    >
      <p className="text-[10px] font-black tracking-widest uppercase mb-4 text-text-muted dark:text-text-muted-dark">
        Your Progress
      </p>
      <ol role="list" className="flex flex-col gap-0 list-none p-0">
        {STEPS.map((step, i) => {
          const isDone = completedSteps.includes(step.number);
          const isCurrent = currentStep === step.number;

          return (
            <li key={step.number} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  aria-hidden="true"
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0",
                    isDone
                      ? "bg-primary text-(--color-primary-fg) dark:bg-primary-dark dark:text-(--color-primary-dark-fg)"
                      : isCurrent
                        ? "border-2 border-primary dark:border-primary-dark text-primary dark:text-primary-dark"
                        : "border-2 border-border dark:border-border-dark text-text-muted dark:text-text-muted-dark",
                  )}
                >
                  {isDone ? "✓" : step.number}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden="true"
                    className={cn(
                      "w-0.5 h-8 mt-1",
                      isDone
                        ? "bg-primary dark:bg-primary-dark"
                        : "bg-border dark:bg-border-dark",
                    )}
                  />
                )}
              </div>

              <div className="pt-1 pb-8">
                <p
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider leading-none",
                    isCurrent || isDone
                      ? "text-(.--color-text-muted) dark:text-text-muted-dark"
                      : "text-text-muted dark:text-text-muted-dark opacity-50",
                  )}
                >
                  Step {step.number}
                </p>
                <p
                  className={cn(
                    "text-sm font-bold mt-0.5 leading-none",
                    isDone
                      ? "text-text-secondary dark:text-text-secondary-dark"
                      : isCurrent
                        ? "text-primary dark:text-primary-dark"
                        : "text-text-muted dark:text-text-muted-dark opacity-50",
                  )}
                >
                  {step.label}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

function StepHeader({ step, title, subtitle, percent }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-black tracking-widest uppercase text-text-muted dark:text-text-muted-dark">
          Step {step} of {STEPS.length}
        </p>
        <p className="text-xs font-black text-text-muted dark:text-text-muted-dark">
          {percent}%
        </p>
      </div>
      <div
        className={cn(
          "w-full h-2 rounded-full mb-6 overflow-hidden",
          "bg-surface-2 dark:bg-border-dark",
        )}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Form completion: ${percent}%`}
      >
        <div
          className="h-full rounded-full bg-primary dark:bg-primary-dark transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <h1
        className={cn(
          "text-3xl font-black mb-1",
          "text-text-primary dark:text-text-primary-dark",
        )}
      >
        Add a Service
      </h1>
      <h2
        className={cn(
          "text-lg font-bold mb-1",
          "text-(--color-prim.ary) dark:text-primary-dark",
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "text-sm",
          "text-text-secondary dark:text-text-secondary-dark",
        )}
      >
        {subtitle}
      </p>
    </div>
  );
}

function NavButtons({
  onBack,
  onNext,
  nextLabel = "Continue →",
  loading = false,
  showBack = true,
}) {
  const newLocal = "hover:bg-primary-hover dark:hover:opacity-90";
  return (
    <div className="flex gap-4 mt-8">
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "px-8 py-3 rounded-xl font-bold text-sm min-h-13",
            "border border-border dark:border-border-dark",
            "bg-(--color-bg) dark:bg-surface-dark",
            "text-text-primary dark:text-text-primary-dark",
            "hover:bg-surface dark:hover:bg-[#2d3f5a]",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
          )}
        >
          ← Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={loading}
        className={cn(
          "px-8 py-3 rounded-xl font-bold text-sm min-h-[52px]",
          "bg-primary text-(--color-primary-fg)",
          "dark:bg-primary-dark dark:te.xt-[var(--color-primary-dark-fg)]",
          newLocal,
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]",
        )}
      >
        {loading ? "Submitting..." : nextLabel}
      </button>
    </div>
  );
}

// ─── Step 1: Basic Info ───────────────────────────────────────────────────────

function Step1({ data, onChange, errors }) {
  const toggleType = (type) => {
    const current = data.disabilityTypes;
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onChange("disabilityTypes", next);
  };

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        step={1}
        title="Basic Info"
        subtitle="Start with the core details — name, type, and who it is for."
        percent={25}
      />

      {/* Service Name */}
      <div>
        <label htmlFor="s1-name" className={labelBase}>
          Service Name{" "}
          <span className="text-danger" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="s1-name"
          type="text"
          placeholder="e.g. Accra Rehab Center"
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
          maxLength={LIMITS.SERVICE_NAME_MAX}
          aria-required="true"
          aria-describedby={errors.name ? "s1-name-err" : undefined}
          aria-invalid={!!errors.name}
          className={inputBase(errors.name)}
        />
        <FieldError id="s1-name-err" message={errors.name} />
      </div>

      {/* Service Category */}
      <div>
        <label htmlFor="s1-category" className={labelBase}>
          Service Category{" "}
          <span className="text-danger" aria-hidden="true">
            *
          </span>
        </label>
        <select
          id="s1-category"
          value={data.category}
          onChange={(e) => onChange("category", e.target.value)}
          aria-required="true"
          aria-describedby={errors.category ? "s1-category-err" : undefined}
          aria-invalid={!!errors.category}
          className={inputBase(errors.category)}
        >
          <option value="">Select a Category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <FieldError id="s1-category-err" message={errors.category} />
      </div>

      {/* Disability Types */}
      <div>
        <p className={cn(labelBase, "mb-3")} id="s1-types-label">
          Disability Types Supported{" "}
          <span className="text-danger" aria-hidden="true">
            *
          </span>
        </p>
        <div
          role="group"
          aria-labelledby="s1-types-label"
          aria-describedby={errors.disabilityTypes ? "s1-types-err" : undefined}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        >
          {DISABILITY_TYPES.map((type) => {
            const checked = data.disabilityTypes.includes(type);
            return (
              <label
                key={type}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer text-sm font-bold",
                  "transition-colors duration-150",
                  checked
                    ? "border-primary bg-primary-light text-primary dark:border-primary-dark dark:bg-[#052e16] dark:text-primary-dark"
                    : "border-border dark:border-border-dark text-text-secondary dark:text-text-secondary-dark hover:border-primary dark:hover:border-primary-dark",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleType(type)}
                  aria-label={`Include ${type} disability type`}
                  className="w-4 h-4 rounded accent-primary dark:accent-primary-dark"
                  style={{ minHeight: "unset" }}
                />
                {type}
              </label>
            );
          })}
        </div>
        <FieldError id="s1-types-err" message={errors.disabilityTypes} />
      </div>

      {/* Target Group */}
      <div>
        <label htmlFor="s1-target" className={labelBase}>
          Who can use this service?
        </label>
        <select
          id="s1-target"
          value={data.targetGroup}
          onChange={(e) => onChange("targetGroup", e.target.value)}
          className={inputBase(false)}
        >
          <option value="">Select a target group</option>
          {TARGET_GROUPS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ─── Step 2: Service Details ──────────────────────────────────────────────────

function Step2({ data, onChange, errors }) {
  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        step={2}
        title="Service Details"
        subtitle="Tell us how to reach this service and describe what it offers."
        percent={50}
      />

      {/* Phone + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="s2-phone" className={labelBase}>
            Phone Number{" "}
            <span className="text-danger" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="s2-phone"
            type="tel"
            placeholder="0501235683 or +233 501235683"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            aria-required="true"
            aria-describedby={errors.phone ? "s2-phone-err" : "s2-phone-hint"}
            aria-invalid={!!errors.phone}
            className={inputBase(errors.phone)}
          />
          <p
            id="s2-phone-hint"
            className="text-xs mt-1 text-text-muted dark:text-text-muted-dark"
          >
            {PHONE_HINT}
          </p>
          <FieldError id="s2-phone-err" message={errors.phone} />
        </div>

        <div>
          <label htmlFor="s2-email" className={labelBase}>
            Email Address
          </label>
          <input
            id="s2-email"
            type="email"
            placeholder="info@example.com"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            className={inputBase(false)}
          />
        </div>
      </div>

      {/* Website + Hours */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="s2-website" className={labelBase}>
            Website
          </label>
          <input
            id="s2-website"
            type="url"
            placeholder="https://yoursite.com"
            value={data.website}
            onChange={(e) => onChange("website", e.target.value)}
            className={inputBase(false)}
          />
        </div>

        <div>
          <label htmlFor="s2-hours" className={labelBase}>
            Opening Hours
          </label>
          <input
            id="s2-hours"
            type="text"
            placeholder="e.g. Mon-Fri, 8am – 5pm"
            value={data.hours}
            onChange={(e) => onChange("hours", e.target.value)}
            className={inputBase(false)}
          />
        </div>
      </div>

      {/* Short Description */}
      <div>
        <label htmlFor="s2-description" className={labelBase}>
          Short Description{" "}
          <span className="text-danger" aria-hidden="true">
            *
          </span>
        </label>
        <textarea
          id="s2-description"
          rows={4}
          placeholder="Briefly describe what this service offers (shown on service cards)..."
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
          maxLength={LIMITS.SHORT_DESCRIPTION_MAX}
          aria-required="true"
          aria-describedby={errors.description ? "s2-desc-err" : "s2-desc-hint"}
          aria-invalid={!!errors.description}
          className={cn(
            inputBase(errors.description),
            "min-h-[120px] resize-y py-3",
          )}
        />
        <div className="flex items-start justify-between mt-1">
          <p
            id="s2-desc-hint"
            className="text-xs text-text-muted dark:text-text-muted-dark"
          >
            Minimum {LIMITS.SHORT_DESCRIPTION_MIN} characters, maximum{" "}
            {LIMITS.SHORT_DESCRIPTION_MAX}. Shown on service cards.
          </p>
          <span
            className={cn(
              "text-xs font-bold ml-3 shrink-0",
              data.description.length > LIMITS.SHORT_DESCRIPTION_MAX
                ? "text-danger"
                : data.description.length >= LIMITS.SHORT_DESCRIPTION_MAX * 0.9
                  ? "text-(--color-warning,#d97706)"
                  : "text-text-muted dark:text-text-muted-dark",
            )}
          >
            {data.description.length}/{LIMITS.SHORT_DESCRIPTION_MAX}
          </span>
        </div>
        <FieldError id="s2-desc-err" message={errors.description} />
      </div>

      {/* Full Description (about) */}
      <div>
        <label htmlFor="s2-about" className={labelBase}>
          Full Description{" "}
          <span className="text-xs font-normal text-text-muted dark:text-text-muted-dark">
            (optional — shown on service detail page)
          </span>
        </label>
        <textarea
          id="s2-about"
          rows={7}
          placeholder="Provide a detailed description — history, approach, facilities, staff qualifications, etc."
          value={data.about}
          onChange={(e) => onChange("about", e.target.value)}
          maxLength={LIMITS.LONG_DESCRIPTION_MAX}
          aria-describedby="s2-about-hint"
          className={cn(inputBase(errors.about), "min-h-[180px] resize-y py-3")}
        />
        <div className="flex items-start justify-between mt-1">
          <p
            id="s2-about-hint"
            className="text-xs text-text-muted dark:text-text-muted-dark"
          >
            The short description above appears on service cards. This longer
            version is shown when users click into the service detail page. Max{" "}
            {LIMITS.LONG_DESCRIPTION_MAX} characters.
          </p>
          <span
            className={cn(
              "text-xs font-bold ml-3 shrink-0",
              data.about.length > LIMITS.LONG_DESCRIPTION_MAX
                ? "text-danger"
                : data.about.length >= LIMITS.LONG_DESCRIPTION_MAX * 0.9
                  ? "text-(--color-warning,#d97706)"
                  : "text-text-muted dark:text-text-muted-dark",
            )}
          >
            {data.about.length}/{LIMITS.LONG_DESCRIPTION_MAX}
          </span>
        </div>
        <FieldError id="s2-about-err" message={errors.about} />
      </div>

      {/* Languages */}
      <div>
        <label htmlFor="s2-languages" className={labelBase}>
          Languages Spoken
        </label>
        <input
          id="s2-languages"
          type="text"
          placeholder="e.g. English, Twi, Hausa"
          value={data.languages}
          onChange={(e) => onChange("languages", e.target.value)}
          aria-describedby="s2-lang-hint"
          className={inputBase(false)}
        />
        <p
          id="s2-lang-hint"
          className="text-xs mt-1 text-text-muted dark:text-text-muted-dark"
        >
          List the languages spoken, separated by commas.
        </p>
      </div>
    </div>
  );
}

// ─── Clickable Map Component ──────────────────────────────────────────────────

function ClickableMap({ position, onMapClick }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

// ─── Step 3: Location with Map ────────────────────────────────────────────────

function Step3({ data, onChange, errors }) {
  const [mapPosition, setMapPosition] = useState(null);

  useEffect(() => {
    if (data.lat && data.lng) {
      setMapPosition([parseFloat(data.lat), parseFloat(data.lng)]);
    }
  }, [data.lat, data.lng]);

  const handleMapClick = (lat, lng) => {
    setMapPosition([lat, lng]);
    onChange("lat", lat.toString());
    onChange("lng", lng.toString());
  };

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapPosition([latitude, longitude]);
          onChange("lat", latitude.toString());
          onChange("lng", longitude.toString());
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to get your location. Please check your browser permissions.",
          );
        },
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        step={3}
        title="Service Location"
        subtitle="Where is this service located? This helps people find it on the map."
        percent={75}
      />

      {/* Region + City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="s3-region" className={labelBase}>
            Region{" "}
            <span className="text-danger" aria-hidden="true">
              *
            </span>
          </label>
          <select
            id="s3-region"
            value={data.region}
            onChange={(e) => onChange("region", e.target.value)}
            aria-required="true"
            aria-describedby={errors.region ? "s3-region-err" : undefined}
            aria-invalid={!!errors.region}
            className={inputBase(errors.region)}
          >
            <option value="">Select a region</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <FieldError id="s3-region-err" message={errors.region} />
        </div>

        <div>
          <label htmlFor="s3-city" className={labelBase}>
            City / Town{" "}
            <span className="text-danger" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="s3-city"
            type="text"
            placeholder="e.g. Accra, Takoradi"
            value={data.city}
            onChange={(e) => onChange("city", e.target.value)}
            aria-required="true"
            aria-describedby={errors.city ? "s3-city-err" : undefined}
            aria-invalid={!!errors.city}
            className={inputBase(errors.city)}
          />
          <FieldError id="s3-city-err" message={errors.city} />
        </div>
      </div>

      {/* Street Address */}
      <div>
        <label htmlFor="s3-address" className={labelBase}>
          Street Address
        </label>
        <input
          id="s3-address"
          type="text"
          placeholder="e.g. 14 Independence Avenue"
          value={data.address}
          onChange={(e) => onChange("address", e.target.value)}
          aria-describedby="s3-address-hint"
          className={inputBase(false)}
        />
        <p
          id="s3-address-hint"
          className="text-xs mt-1 text-text-muted dark:text-text-muted-dark"
        >
          Optional but helpful — makes it easier for users to find you.
        </p>
      </div>

      {/* Nearest Landmark */}
      <div>
        <label htmlFor="s3-landmark" className={labelBase}>
          Nearest Landmark
        </label>
        <input
          id="s3-landmark"
          type="text"
          placeholder="e.g. Near Accra Mall"
          value={data.landmark}
          onChange={(e) => onChange("landmark", e.target.value)}
          aria-describedby="s3-landmark-hint"
          className={inputBase(false)}
        />
        <p
          id="s3-landmark-hint"
          className="text-xs mt-1 text-text-muted dark:text-text-muted-dark"
        >
          Landmarks help users who are unfamiliar with the area.
        </p>
      </div>

      <div aria-hidden="true" className="h-px bg-border dark:bg-border-dark" />

      {/* Map */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className={cn(labelBase, "mb-0")}>Map Pin Location</p>
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold",
              "bg-primary text-(--color-primary-fg)",
              "dark:bg-primary-dark dark:text-(--color-primary-dark-fg)",
              "hover:opacity-90 transition-opacity",
            )}
          >
            📍 Use My Location
          </button>
        </div>

        <div className="relative">
          <MapContainer
            center={mapPosition || GHANA_CENTER}
            zoom={mapPosition ? 15 : DEFAULT_ZOOM}
            style={{
              height: "400px",
              width: "100%",
              borderRadius: "1rem",
              zIndex: 1,
            }}
            className="rounded-2xl border border-border dark:border-border-dark"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickableMap position={mapPosition} onMapClick={handleMapClick} />
          </MapContainer>

          {!mapPosition && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/50 text-white px-4 py-2 rounded-lg text-sm font-bold">
                Click on the map to place a pin
              </div>
            </div>
          )}
        </div>

        <p className="text-xs mt-2 text-text-muted dark:text-text-muted-dark">
          Click anywhere on the map to place a pin at your service location.
        </p>
      </div>

      {/* Lat / Lng */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label htmlFor="s3-lat" className={labelBase}>
            Latitude
          </label>
          <input
            id="s3-lat"
            type="number"
            step="any"
            placeholder="e.g. 5.6037"
            value={data.lat}
            onChange={(e) => {
              const val = e.target.value;
              onChange("lat", val);
              if (val && data.lng) {
                setMapPosition([parseFloat(val), parseFloat(data.lng)]);
              }
            }}
            aria-describedby="s3-coords-hint"
            className={inputBase(false)}
          />
        </div>
        <div>
          <label htmlFor="s3-lng" className={labelBase}>
            Longitude
          </label>
          <input
            id="s3-lng"
            type="number"
            step="any"
            placeholder="e.g. -0.1870"
            value={data.lng}
            onChange={(e) => {
              const val = e.target.value;
              onChange("lng", val);
              if (data.lat && val) {
                setMapPosition([parseFloat(data.lat), parseFloat(val)]);
              }
            }}
            className={inputBase(false)}
          />
        </div>
      </div>
      <p
        id="s3-coords-hint"
        className="text-xs -mt-4 text-text-muted dark:text-text-muted-dark"
      >
        Click on the map or enter coordinates manually.
      </p>
    </div>
  );
}

// ─── Step 4: Review & Submit ──────────────────────────────────────────────────

function ReviewRow({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[10px] font-black uppercase tracking-wider text-text-muted dark:text-text-muted-dark mb-0.5">
        {label}
      </dt>
      <dd className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
        {value}
      </dd>
    </div>
  );
}

function ReviewSection({ title, onEdit, children }) {
  return (
    <div
      className={cn(
        "p-5 rounded-2xl border",
        "bg-surface dark:bg-surface-dark",
        "border-border dark:border-border-dark",
      )}
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border dark:border-border-dark">
        <h3 className="text-xs font-black uppercase tracking-widest text-text-muted dark:text-text-muted-dark">
          {title}
        </h3>
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${title}`}
          className={cn(
            "text-xs font-bold min-h-0",
            "text-primary dark:text-primary-dark",
            "hover:underline underline-offset-2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm",
          )}
        >
          Edit
        </button>
      </div>
      <dl className="grid grid-cols-2 gap-x-8 gap-y-4">{children}</dl>
    </div>
  );
}

function Step4({ data, onEdit, errors, serverError, loading, onSubmit }) {
  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        step={4}
        title="Review & Submit"
        subtitle="Check everything below before submitting. Use Edit to make changes."
        percent={100}
      />

      {serverError && (
        <div
          role="alert"
          className={cn(
            "px-4 py-3 rounded-xl text-sm border",
            "bg-danger-bg border-danger-border text-danger",
            "dark:bg-danger-bg-dark dark:text-danger-dark",
          )}
        >
          {serverError}
        </div>
      )}

      {/* Basic Info */}
      <ReviewSection title="Basic Info" onEdit={() => onEdit(1)}>
        <ReviewRow label="Service Name" value={data.step1.name} />
        <ReviewRow label="Category" value={data.step1.category} />
        {data.step1.disabilityTypes.length > 0 && (
          <div className="col-span-2">
            <dt className="text-[10px] font-black uppercase tracking-wider text-text-muted dark:text-text-muted-dark mb-1.5">
              Disability Types
            </dt>
            <dd className="flex flex-wrap gap-2">
              {data.step1.disabilityTypes.map((t) => (
                <span
                  key={t}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold border",
                    "border-border dark:border-border-dark",
                    "text-text-secondary dark:text-text-secondary-dark",
                  )}
                >
                  {t}
                </span>
              ))}
            </dd>
          </div>
        )}
        <ReviewRow label="Target Group" value={data.step1.targetGroup} />
      </ReviewSection>

      {/* Service Details */}
      <ReviewSection title="Service Details" onEdit={() => onEdit(2)}>
        <ReviewRow label="Phone" value={data.step2.phone} />
        <ReviewRow label="Email" value={data.step2.email} />
        <ReviewRow label="Website" value={data.step2.website} />
        <ReviewRow label="Opening Hours" value={data.step2.hours || "—"} />
        {data.step2.description && (
          <div className="col-span-2">
            <dt className="text-[10px] font-black uppercase tracking-wider text-text-muted dark:text-text-muted-dark mb-0.5">
              Short Description
            </dt>
            <dd className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed line-clamp-4">
              {data.step2.description}
            </dd>
          </div>
        )}
        {data.step2.about && (
          <div className="col-span-2">
            <dt className="text-[10px] font-black uppercase tracking-wider text-text-muted dark:text-text-muted-dark mb-0.5">
              Full Description
            </dt>
            <dd className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed line-clamp-4">
              {data.step2.about}
            </dd>
          </div>
        )}
      </ReviewSection>

      {/* Location */}
      <ReviewSection title="Location" onEdit={() => onEdit(3)}>
        <ReviewRow label="Region" value={data.step3.region} />
        <ReviewRow label="City" value={data.step3.city} />
        <ReviewRow label="Address" value={data.step3.address || "—"} />
        <ReviewRow label="Landmark" value={data.step3.landmark || "—"} />
        {data.step3.lat && data.step3.lng && (
          <div className="col-span-2">
            <dt className="text-[10px] font-black uppercase tracking-wider text-text-muted dark:text-text-muted-dark mb-0.5">
              Map Coordinates
            </dt>
            <dd className="text-sm text-text-secondary dark:text-text-secondary-dark">
              {parseFloat(data.step3.lat).toFixed(6)},{" "}
              {parseFloat(data.step3.lng).toFixed(6)}
            </dd>
          </div>
        )}
      </ReviewSection>

      {/* Submit button */}
      <div className="flex gap-4 mt-2">
        <button
          type="button"
          onClick={() => onEdit(3)}
          className={cn(
            "px-8 py-3 rounded-xl font-bold text-sm min-h-[52px]",
            "border border-border dark:border-border-dark",
            "text-text-primary dark:text-text-primary-dark",
            "hover:bg-surface dark:hover:bg-[#2d3f5a]",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
          )}
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className={cn(
            "flex-1 py-3 rounded-xl font-bold text-sm min-h-[52px]",
            "bg-primary text-(--color-primary-fg)",
            "dark:bg-primary-dark dark:text-(--color-primary-dark-fg)",
            "hover:bg-primary-hover dark:hover:opacity-90",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus",
          )}
        >
          {loading ? "Submitting..." : "✓ Submit Service"}
        </button>
      </div>
    </div>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen({ onReset }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <span aria-hidden="true" className="text-6xl mb-6">
        🎉
      </span>
      <h1
        className={cn(
          "text-3xl font-black mb-4",
          "text-text-primary dark:text-text-primary-dark",
        )}
      >
        Service Submitted!
      </h1>
      <p
        className={cn(
          "text-base max-w-md mb-8 leading-relaxed",
          "text-text-secondary dark:text-text-secondary-dark",
        )}
      >
        Thank you for adding to AbilityMap Ghana. Your service will be reviewed
        and published within 24–48 hours.
      </p>

      <div
        className={cn(
          "inline-flex items-center gap-2 px-6 py-3 rounded-xl border mb-10 text-sm font-bold",
          "border-primary dark:border-primary-dark",
          "bg-primary-light dark:bg-[#052e16]",
          "text-primary dark:text-primary-dark",
        )}
      >
        <span aria-hidden="true">✓</span> Your submission is under review
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/services")}
          aria-label="View all services"
          className={cn(
            "px-8 py-3 rounded-xl font-bold text-sm min-h-[52px]",
            "bg-primary text-(--color-primary-fg)",
            "dark:bg-primary-dark dark:text-(--color-primary-dark-fg)",
            "hover:bg-primary-hover dark:hover:opacity-90 transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus",
          )}
        >
          View All Services
        </button>
        <button
          type="button"
          onClick={onReset}
          aria-label="Add another service"
          className={cn(
            "px-8 py-3 rounded-xl font-bold text-sm min-h-[52px]",
            "border border-border dark:border-border-dark",
            "text-text-primary dark:text-text-primary-dark",
            "hover:bg-surface dark:hover:bg-[#2d3f5a] transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
          )}
        >
          Add Another Service
        </button>
      </div>
    </div>
  );
}

// ─── Empty state initializers ─────────────────────────────────────────────────

const EMPTY_STEP1 = {
  name: "",
  category: "",
  disabilityTypes: [],
  targetGroup: "",
};
const EMPTY_STEP2 = {
  phone: "",
  email: "",
  website: "",
  hours: "",
  description: "",
  about: "",
  languages: "",
};
const EMPTY_STEP3 = {
  region: "",
  city: "",
  address: "",
  landmark: "",
  lat: "",
  lng: "",
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AddServicePage() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [step1, setStep1] = useState(EMPTY_STEP1);
  const [step2, setStep2] = useState(EMPTY_STEP2);
  const [step3, setStep3] = useState(EMPTY_STEP3);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = "Add a Service — AbilityMap Ghana";
    const token = localStorage.getItem("abilitymap-token");
    if (!token) {
      navigate("/login");
      return;
    }
    setAuthChecked(true);
  }, [navigate]);

  const updateStep1 = (field, value) => {
    setStep1((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const updateStep2 = (field, value) => {
    setStep2((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const updateStep3 = (field, value) => {
    setStep3((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  // ── Validation per step ──────────────────────────────────────────────────

  const validateStep1 = () => {
    const e = {};
    if (!step1.name.trim()) e.name = "Service name is required";
    if (!step1.category) e.category = "Please select a category";
    if (step1.disabilityTypes.length === 0)
      e.disabilityTypes = "Select at least one disability type";
    return e;
  };

  const validateStep2 = () => {
    const e = {};

    // Phone validation
    if (!step2.phone.trim()) {
      e.phone = "Phone number is required";
    } else if (!PHONE_REGEX.test(step2.phone.trim())) {
      e.phone = `Invalid format. ${PHONE_HINT}`;
    }

    // Short description validation
    if (!step2.description.trim()) {
      e.description = "Short description is required";
    } else if (step2.description.trim().length < LIMITS.SHORT_DESCRIPTION_MIN) {
      e.description = `Description must be at least ${LIMITS.SHORT_DESCRIPTION_MIN} characters`;
    } else if (step2.description.length > LIMITS.SHORT_DESCRIPTION_MAX) {
      e.description = `Description cannot exceed ${LIMITS.SHORT_DESCRIPTION_MAX} characters`;
    }

    // Full description (about) validation — optional but capped
    if (step2.about.length > LIMITS.LONG_DESCRIPTION_MAX) {
      e.about = `Full description cannot exceed ${LIMITS.LONG_DESCRIPTION_MAX} characters`;
    }

    return e;
  };

  const validateStep3 = () => {
    const e = {};
    if (!step3.region) e.region = "Please select a region";
    if (!step3.city.trim()) e.city = "City or town is required";
    return e;
  };

  // ── Navigation ────────────────────────────────────────────────────────────

  const handleNext = () => {
    let errs = {};
    if (currentStep === 1) errs = validateStep1();
    if (currentStep === 2) errs = validateStep2();
    if (currentStep === 3) errs = validateStep3();

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      const fieldMap = {
        name: "s1-name",
        category: "s1-category",
        disabilityTypes: "s1-types-label",
        phone: "s2-phone",
        description: "s2-description",
        about: "s2-about",
        region: "s3-region",
        city: "s3-city",
      };
      document.getElementById(fieldMap[firstKey])?.focus();
      return;
    }

    setErrors({});
    setCompletedSteps((prev) => [...new Set([...prev, currentStep])]);
    setCurrentStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditStep = (step) => {
    setErrors({});
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setServerError("");
    setLoading(true);

    const primaryType = step1.disabilityTypes[0] || "Physical";
    const badgeColorMap = {
      Physical: "physical",
      Visual: "visual",
      Hearing: "hearing",
      "Mental Health": "mental",
      Speech: "speech",
      Intellectual: "intellectual",
    };

    const payload = {
      name: step1.name.trim(),
      badge: primaryType,
      badgeColor: badgeColorMap[primaryType],
      tags: step1.disabilityTypes,
      location: step3.city.trim(),
      region: step3.region,
      address: step3.address.trim() || step3.city.trim(),
      phone: step2.phone.trim(),
      email: step2.email.trim(),
      website: step2.website.trim(),
      hours: step2.hours.trim(),
      description: step2.description.trim(),
      about: step2.about.trim(),
      coordinates:
        step3.lat && step3.lng
          ? { lat: parseFloat(step3.lat), lng: parseFloat(step3.lng) }
          : undefined,
    };

    try {
      await API.post("/services", payload);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setServerError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setCurrentStep(1);
    setCompletedSteps([]);
    setStep1(EMPTY_STEP1);
    setStep2(EMPTY_STEP2);
    setStep3(EMPTY_STEP3);
    setErrors({});
    setServerError("");
  };

  if (!authChecked) return null;

  return (
    <div
      className={cn(
        "min-h-screen px-6 py-8",
        "bg-(--color-bg) dark:bg-bg-dark",
        "transition-colors duration-300",
      )}
    >
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        {!success && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol
              role="list"
              className="flex items-center gap-1 text-sm list-none p-0"
            >
              <li>
                <Link
                  to="/"
                  className="text-primary dark:text-primary-dark hover:underline min-h-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
                >
                  Home
                </Link>
              </li>
              <li
                aria-hidden="true"
                className="text-text-muted dark:text-text-muted-dark"
              >
                ›
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-primary dark:text-primary-dark hover:underline min-h-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm"
                >
                  Services
                </Link>
              </li>
              <li
                aria-hidden="true"
                className="text-text-muted dark:text-text-muted-dark"
              >
                ›
              </li>
              <li
                className="font-bold text-text-primary dark:text-text-primary-dark"
                aria-current="page"
              >
                Add a Service
              </li>
            </ol>
          </nav>
        )}

        {/* Success screen */}
        {success && <SuccessScreen onReset={handleReset} />}

        {/* Multi-step form */}
        {!success && (
          <div className="flex gap-8 items-start">
            <ProgressSidebar
              currentStep={currentStep}
              completedSteps={completedSteps}
            />

            <main
              id="main-content"
              className="flex-1 min-w-0"
              aria-label="Add service form"
            >
              {currentStep === 1 && (
                <>
                  <Step1 data={step1} onChange={updateStep1} errors={errors} />
                  <NavButtons
                    onNext={handleNext}
                    showBack={false}
                    nextLabel="Continue →"
                  />
                </>
              )}

              {currentStep === 2 && (
                <>
                  <Step2 data={step2} onChange={updateStep2} errors={errors} />
                  <NavButtons
                    onBack={handleBack}
                    onNext={handleNext}
                    nextLabel="Continue →"
                  />
                </>
              )}

              {currentStep === 3 && (
                <>
                  <Step3 data={step3} onChange={updateStep3} errors={errors} />
                  <NavButtons
                    onBack={handleBack}
                    onNext={handleNext}
                    nextLabel="Continue →"
                  />
                </>
              )}

              {currentStep === 4 && (
                <Step4
                  data={{ step1, step2, step3 }}
                  onEdit={handleEditStep}
                  errors={errors}
                  serverError={serverError}
                  loading={loading}
                  onSubmit={handleSubmit}
                />
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
