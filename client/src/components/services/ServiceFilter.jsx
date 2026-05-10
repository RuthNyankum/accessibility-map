import { cn } from "../../utils/cn";

const DISABILITY_TYPES = [
  "Physical",
  "Visual",
  "Hearing",
  "Mental Health",
  "Speech",
  "Intellectual",
];

const REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Central",
  "Eastern",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
  "Brong-Ahafo",
  "Savannah",
  "Bono East",
  "Ahafo",
  "Western North",
  "Oti",
  "North East",
];

export function ServiceFilter({
  selectedTypes = [],
  selectedRegions = [],
  onTypeChange,
  onRegionChange,
}) {
  const checkboxClass = cn(
    "w-4 h-4 rounded border shrink-0 cursor-pointer",
    "border-border dark:border-border-dark",
    "accent-primary dark:accent-primary-dark",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
    "focus-visible:ring-focus dark:focus-visible:ring-focus-dark",
  );

  const legendClass = cn(
    "text-[11px] font-bold tracking-widest uppercase mb-3",
    "text-text-primary dark:text-text-primary-dark",
  );

  return (
    <aside
      aria-label="Filter services"
      className={cn(
        "flex flex-col gap-6 p-4 rounded-xl border",
        "bg-surface dark:bg-surface-dark",
        "border-border dark:border-border-dark",
        "transition-colors duration-300",
      )}
    >
      <fieldset className="border-none p-0 m-0">
        <legend className={legendClass}>Disability Type</legend>
        <ul role="list" className="flex flex-col gap-2 list-none p-0">
          {DISABILITY_TYPES.map((label) => {
            const id = `type-${label.toLowerCase().replace(/\s/g, "-")}`;
            const isChecked = selectedTypes.includes(label);
            return (
              <li key={label}>
                <label
                  htmlFor={id}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer min-h-[28px]",
                    "text-sm text-text-secondary dark:text-text-secondary-dark",
                    "hover:text-text-primary dark:hover:text-text-primary-dark",
                    "transition-colors duration-150",
                  )}
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => onTypeChange?.(label, e.target.checked)}
                    className={checkboxClass}
                    style={{ minHeight: "unset" }}
                  />
                  <span>{label}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <div aria-hidden="true" className="h-px bg-border dark:bg-border-dark" />

      <fieldset className="border-none p-0 m-0">
        <legend className={legendClass}>Region</legend>
        <ul role="list" className="flex flex-col gap-2 list-none p-0">
          {REGIONS.map((label) => {
            const id = `region-${label.toLowerCase().replace(/\s/g, "-")}`;
            const isChecked = selectedRegions.includes(label);
            return (
              <li key={label}>
                <label
                  htmlFor={id}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer min-h-[28px]",
                    "text-sm text-text-secondary dark:text-text-secondary-dark",
                    "hover:text-text-primary dark:hover:text-text-primary-dark",
                    "transition-colors duration-150",
                  )}
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => onRegionChange?.(label, e.target.checked)}
                    className={checkboxClass}
                    style={{ minHeight: "unset" }}
                  />
                  <span>{label}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>
    </aside>
  );
}
