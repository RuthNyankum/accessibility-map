// ─── Single source of truth for all service data ─────────────────────────────
//
// featured: true  → appears on HomePage featured section
// featured: false → only on ServicesPage
//
// When you connect the backend, replace this array with an API call
// and remove this file. The filter logic in each page stays the same.

export const ALL_SERVICES = [
  {
    id: "1",
    badge: "Physical",
    badgeColor: "physical",
    name: "Accra Rehab Center",
    location: "Accra",
    phone: "+233 30 000 0001",
    description:
      "Rehabilitation and physiotherapy services for people with physical disabilities.",
    featured: true,
  },
  {
    id: "2",
    badge: "Visual",
    badgeColor: "visual",
    name: "Vision First Ghana",
    location: "Kumasi",
    phone: "+233 30 000 0001",
    description:
      "Counselling, psychotherapy, and community mental health programs.",
    featured: true,
  },
  {
    id: "3",
    badge: "Hearing",
    badgeColor: "hearing",
    name: "Deaf Community Hub",
    location: "Accra",
    phone: "+233 30 000 0001",
    description:
      "Sign language support, deaf community resources, and hearing aid referrals.",
    featured: true,
  },
  {
    id: "4",
    badge: "Mental Health",
    badgeColor: "mental",
    name: "Mental Wellness GH",
    location: "Accra",
    phone: "+233 30 000 0001",
    description:
      "Counselling, psychotherapy, and community mental health programs.",
    featured: true,
  },
  {
    id: "5",
    badge: "Hearing",
    badgeColor: "hearing",
    name: "Deaf Community Hub",
    location: "Accra",
    phone: "+233 30 000 0001",
    description:
      "Counselling, psychotherapy, and community mental health programs.",
    featured: false,
  },
  {
    id: "6",
    badge: "Visual",
    badgeColor: "visual",
    name: "Vision First Ghana",
    location: "Kumasi",
    phone: "+233 30 000 0001",
    description:
      "Counselling, psychotherapy, and community mental health programs.",
    featured: false,
  },
  {
    id: "7",
    badge: "Mental Health",
    badgeColor: "mental",
    name: "Mental Wellness GH",
    location: "Accra",
    phone: "+233 30 000 0001",
    description:
      "Counselling, psychotherapy, and community mental health programs.",
    featured: false,
  },
  {
    id: "8",
    badge: "Speech",
    badgeColor: "speech",
    name: "Speech Care GH",
    location: "Tamale",
    phone: "+233 30 000 0001",
    description: "Speech therapy and language development support.",
    featured: false,
  },
  {
    id: "9",
    badge: "Intellectual",
    badgeColor: "intellectual",
    name: "Ability Support Centre",
    location: "Cape Coast",
    phone: "+233 30 000 0001",
    description:
      "Day programs and support for people with intellectual disabilities.",
    featured: false,
  },
  {
    id: "10",
    badge: "Physical",
    badgeColor: "physical",
    name: "Takoradi Physio Hub",
    location: "Takoradi",
    phone: "+233 30 000 0001",
    description: "Physiotherapy and mobility support services.",
    featured: false,
  },
  {
    id: "11",
    badge: "Visual",
    badgeColor: "visual",
    name: "Braille Ghana",
    location: "Accra",
    phone: "+233 30 000 0001",
    description: "Braille learning resources and visual impairment support.",
    featured: false,
  },
  {
    id: "12",
    badge: "Hearing",
    badgeColor: "hearing",
    name: "Sign Language Centre",
    location: "Kumasi",
    phone: "+233 30 000 0001",
    description: "Sign language classes and deaf community resources.",
    featured: false,
  },
];

// ─── Derived exports — import these directly instead of filtering every time ──

// The 4 featured services shown on the HomePage
export const FEATURED_SERVICES = ALL_SERVICES.filter((s) => s.featured);

// ─── Filter options ───────────────────────────────────────────────────────────

export const STATS = [
  { value: "120+", label: "Services listed" },
  { value: "10", label: "Regions covered" },
  { value: "6", label: "Disability types" },
];

export const DISABILITY_TYPES = [
  "All types",
  "Physical Disability",
  "Visual Impairment",
  "Hearing Impairment",
  "Mental Health",
  "Speech & Language",
  "Intellectual Disability",
];

export const REGIONS = [
  "All regions",
  "Accra",
  "Kumasi",
  "Tamale",
  "Cape Coast",
  "Takoradi",
  "Ho",
  "Koforidua",
  "Sunyani",
  "Wa",
  "Bolgatanga",
];
