// ─── Filter options ───────────────────────────────────────────────────────────

export const STATS = [
  { value: "120+", label: "Services listed" },
  { value: "10", label: "Regions covered" },
  { value: "6", label: "Disability types" },
];

export const CATEGORIES = [
  "Rehabilitation",
  "Mental Health",
  "Visual Support",
  "Hearing Support",
  "Speech Therapy",
  "Legal Aid",
  "Educational Support",
  "Community Support",
  "Medical Care",
  "Assistive Technology",
  "Counselling",
  "Other",
];

export const DISABILITY_TYPES = [
  "Physical",
  "Visual",
  "Intellectual",
  "Hearing",
  "Mental Health",
  "Speech",
];

export const TARGET_GROUPS = [
  "Children (under 18)",
  "Adults (18–64)",
  "Elderly (65+)",
  "All ages",
  "Women only",
  "Men only",
];

export const REGIONS = [
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

// Maps disability type label → badge color key (used when building the payload)
export const BADGE_COLOR_MAP = {
  Physical: "physical",
  Visual: "visual",
  Hearing: "hearing",
  "Mental Health": "mental",
  Speech: "speech",
  Intellectual: "intellectual",
};

// ─── Character / length limits ────────────────────────────────────────────────

export const LIMITS = {
  SERVICE_NAME_MAX: 100,
  SHORT_DESCRIPTION_MAX: 150,
  SHORT_DESCRIPTION_MIN: 50,
  LONG_DESCRIPTION_MAX: 3000,
  ABOUT_MAX: 3000, // alias used in the Mongoose model
};

// ─── Phone validation ─────────────────────────────────────────────────────────
// Local format  : exactly 10 digits starting with 0  → e.g. 0501235683
// Int'l format  : + followed by country code (1-3 digits) then a space then
//                 9 digits                             → e.g. +233 501235683

export const PHONE_REGEX = /^(?:0\d{9}|\+\d{1,3} \d{9})$/;

export const PHONE_HINT =
  "Use local format (0XXXXXXXXX) or international format (+233 XXXXXXXXX).";

// ─── Multi-step form steps metadata ──────────────────────────────────────────

export const STEPS = [
  { number: 1, label: "Basic Info" },
  { number: 2, label: "Service Details" },
  { number: 3, label: "Location" },
  { number: 4, label: "Review & Submit" },
];

// Default map center / zoom for Ghana
export const GHANA_CENTER = [7.9465, -1.0232];
export const DEFAULT_ZOOM = 7;
