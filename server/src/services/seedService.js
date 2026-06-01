import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Service from "../models/Service.js";

dotenv.config();

const SERVICES_SEED = [
  {
    name: "Accra Accessibility Centre",
    badge: "Physical",
    badgeColor: "physical",
    tags: ["Wheelchair Access", "Physiotherapy", "Mobility Aids"],
    location: "Accra",
    region: "Greater Accra",
    address: "14 Independence Ave, Accra",
    phone: "+233 30 222 1001",
    email: "info@accraaccess.org",
    website: "https://accraaccess.org",
    hours: "Mon–Fri: 8am–5pm",
    description:
      "Mobility support and rehabilitation services for people with physical disabilities.",
    about:
      "We provide physiotherapy, mobility aid distribution, and wheelchair repair services across Greater Accra.",
    coordinates: { lat: 5.6037, lng: -0.187 },
    status: "approved",
    featured: true,
  },
  {
    name: "Kumasi Deaf Support Network",
    badge: "Hearing",
    badgeColor: "hearing",
    tags: ["Sign Language", "Deaf Community", "Interpreter Services"],
    location: "Kumasi",
    region: "Ashanti",
    address: "22 Adum Road, Kumasi",
    phone: "+233 32 201 4455",
    email: "contact@kumasideaf.org",
    website: "https://kumasideaf.org",
    hours: "Mon–Sat: 9am–4pm",
    description:
      "Sign language training and interpreter services for the Deaf community in Ashanti.",
    about:
      "Our network connects Deaf individuals with certified interpreters, hosts sign language workshops, and advocates for Deaf rights in the Ashanti region.",
    coordinates: { lat: 6.6885, lng: -1.6244 },
    status: "approved",
    featured: false,
  },
  {
    name: "Takoradi Vision Aid",
    badge: "Visual",
    badgeColor: "visual",
    tags: ["Braille", "Screen Readers", "Eye Care"],
    location: "Takoradi",
    region: "Western",
    address: "5 Market Circle, Takoradi",
    phone: "+233 31 202 3310",
    email: "help@takoradivision.org",
    website: "https://takoradivision.org",
    hours: "Mon–Fri: 8am–4:30pm",
    description:
      "Braille literacy and assistive technology for people with visual impairments in the Western region.",
    about:
      "Takoradi Vision Aid offers free eye screenings, Braille training, and screen reader setup assistance to visually impaired residents of Western Ghana.",
    coordinates: { lat: 4.8845, lng: -1.7554 },
    status: "approved",
    featured: false,
  },
  {
    name: "Cape Coast Mental Wellness Hub",
    badge: "Mental Health",
    badgeColor: "mental",
    tags: ["Counselling", "Therapy", "Support Groups"],
    location: "Cape Coast",
    region: "Central",
    address: "9 Victoria Road, Cape Coast",
    phone: "+233 33 213 0022",
    email: "wellness@ccmhub.org",
    website: "https://ccmhub.org",
    hours: "Mon–Fri: 9am–5pm",
    description:
      "Mental health counselling and peer support for individuals in the Central region.",
    about:
      "We run weekly therapy groups, individual counselling sessions, and community outreach programs to reduce the stigma around mental health in Central Ghana.",
    coordinates: { lat: 5.1054, lng: -1.2466 },
    status: "approved",
    featured: false,
  },
  {
    name: "Koforidua Speech & Language Clinic",
    badge: "Speech",
    badgeColor: "speech",
    tags: ["Speech Therapy", "Language Disorders", "Children"],
    location: "Koforidua",
    region: "Eastern",
    address: "3 Hospital Road, Koforidua",
    phone: "+233 34 202 6699",
    email: "info@kofospeech.org",
    website: "https://kofospeech.org",
    hours: "Tue–Sat: 8am–3pm",
    description:
      "Speech therapy and language support for children and adults in the Eastern region.",
    about:
      "Our licensed speech-language pathologists work with children and adults experiencing speech, language, and swallowing disorders across Eastern Ghana.",
    coordinates: { lat: 6.094, lng: -0.2574 },
    status: "approved",
    featured: false,
  },
  {
    name: "Ho Intellectual Support Services",
    badge: "Intellectual",
    badgeColor: "intellectual",
    tags: ["Learning Support", "Vocational Training", "Life Skills"],
    location: "Ho",
    region: "Volta",
    address: "17 Kpehe Road, Ho",
    phone: "+233 36 202 1144",
    email: "support@hoiss.org",
    website: "https://hoiss.org",
    hours: "Mon–Fri: 8am–4pm",
    description:
      "Vocational and life skills training for adults with intellectual disabilities in the Volta region.",
    about:
      "Ho ISS empowers adults with intellectual disabilities through vocational training, literacy programs, and community integration support.",
    coordinates: { lat: 6.6012, lng: 0.4712 },
    status: "approved",
    featured: false,
  },
  {
    name: "Tamale Disability Resource Centre",
    badge: "Physical",
    badgeColor: "physical",
    tags: ["Assistive Devices", "Rehabilitation", "Community Outreach"],
    location: "Tamale",
    region: "Northern",
    address: "44 Salaga Road, Tamale",
    phone: "+233 37 202 5588",
    email: "info@tamaledrcentre.org",
    website: "https://tamaledrcentre.org",
    hours: "Mon–Fri: 8am–5pm",
    description:
      "Assistive device distribution and rehabilitation for people with disabilities across the Northern region.",
    about:
      "We partner with hospitals and community groups to provide prosthetics, crutches, and physical rehabilitation services to underserved communities in Northern Ghana.",
    coordinates: { lat: 9.4008, lng: -0.8393 },
    status: "approved",
    featured: false,
  },
  {
    name: "Bolgatanga Hearing Care Clinic",
    badge: "Hearing",
    badgeColor: "hearing",
    tags: ["Hearing Aids", "Audiology", "Deaf Education"],
    location: "Bolgatanga",
    region: "Upper East",
    address: "8 Bazaar Road, Bolgatanga",
    phone: "+233 38 209 0033",
    email: "care@bolgahearing.org",
    website: "https://bolgahearing.org",
    hours: "Mon–Fri: 8am–4pm",
    description:
      "Hearing assessments and subsidised hearing aids for the Upper East region.",
    about:
      "Our audiologists provide hearing tests, fitting and maintenance of hearing aids, and Deaf education support for families across Upper East Ghana.",
    coordinates: { lat: 10.7856, lng: -0.8514 },
    status: "approved",
    featured: false,
  },
  {
    name: "Wa Inclusive Learning Centre",
    badge: "Intellectual",
    badgeColor: "intellectual",
    tags: ["Inclusive Education", "Special Needs", "Family Support"],
    location: "Wa",
    region: "Upper West",
    address: "2 Wechiau Road, Wa",
    phone: "+233 39 209 0077",
    email: "learn@wailc.org",
    website: "https://wailc.org",
    hours: "Mon–Sat: 8am–3pm",
    description:
      "Inclusive education and family support for children with intellectual and developmental disabilities in Upper West.",
    about:
      "We work alongside families and local schools to create inclusive learning environments for children with special needs in Upper West Ghana.",
    coordinates: { lat: 10.0601, lng: -2.5099 },
    status: "approved",
    featured: false,
  },
  {
    name: "Sunyani Mental Health Outreach",
    badge: "Mental Health",
    badgeColor: "mental",
    tags: ["Community Psychiatry", "Crisis Support", "Awareness"],
    location: "Sunyani",
    region: "Brong-Ahafo",
    address: "31 Fiapre Road, Sunyani",
    phone: "+233 35 209 1122",
    email: "outreach@sunyanimh.org",
    website: "https://sunyanimh.org",
    hours: "Mon–Fri: 9am–5pm",
    description:
      "Community psychiatry and crisis support services for residents of the Brong-Ahafo region.",
    about:
      "Sunyani MHO connects people in crisis with psychiatric care, runs mental health awareness campaigns in schools, and provides ongoing community support groups.",
    coordinates: { lat: 7.3349, lng: -2.3266 },
    status: "approved",
    featured: false,
  },
  {
    name: "Damongo Visual Impairment Support",
    badge: "Visual",
    badgeColor: "visual",
    tags: ["White Cane Training", "Orientation", "Community Aid"],
    location: "Damongo",
    region: "Savannah",
    address: "10 Larabanga Road, Damongo",
    phone: "+233 37 209 0055",
    email: "info@damongovis.org",
    website: "https://damongovis.org",
    hours: "Mon–Fri: 8am–3pm",
    description:
      "White cane training and orientation services for visually impaired individuals in the Savannah region.",
    about:
      "We provide white cane skills, mobility orientation, and community-based support for people with visual impairments across the Savannah region.",
    coordinates: { lat: 9.0817, lng: -1.8167 },
    status: "approved",
    featured: false,
  },
  {
    name: "Techiman Speech Therapy Unit",
    badge: "Speech",
    badgeColor: "speech",
    tags: ["Stuttering", "Voice Therapy", "Aphasia"],
    location: "Techiman",
    region: "Bono East",
    address: "5 Nkoranza Road, Techiman",
    phone: "+233 35 209 3344",
    email: "speech@techimanstt.org",
    website: "https://techimanstt.org",
    hours: "Mon–Fri: 8am–4pm",
    description:
      "Stuttering, voice, and aphasia therapy for residents of the Bono East region.",
    about:
      "Our unit specialises in stuttering intervention, voice therapy, and aphasia rehabilitation, serving patients across Bono East with outreach clinics in surrounding districts.",
    coordinates: { lat: 7.5833, lng: -1.9333 },
    status: "approved",
    featured: false,
  },
  {
    name: "Goaso Disability Empowerment Centre",
    badge: "Physical",
    badgeColor: "physical",
    tags: ["Wheelchair Sports", "Empowerment", "Peer Support"],
    location: "Goaso",
    region: "Ahafo",
    address: "3 Kukuom Road, Goaso",
    phone: "+233 35 209 5566",
    email: "empower@goasodec.org",
    website: "https://goasodec.org",
    hours: "Mon–Sat: 8am–4pm",
    description:
      "Wheelchair sports and empowerment programs for people with physical disabilities in the Ahafo region.",
    about:
      "We run adapted sports leagues, peer mentoring, and skills development workshops for people with physical disabilities across the Ahafo region.",
    coordinates: { lat: 6.8017, lng: -2.515 },
    status: "approved",
    featured: false,
  },
  {
    name: "Sefwi Wiawso Deaf Community Hub",
    badge: "Hearing",
    badgeColor: "hearing",
    tags: ["Ghanaian Sign Language", "Community Events", "Advocacy"],
    location: "Sefwi Wiawso",
    region: "Western North",
    address: "7 Bibiani Road, Sefwi Wiawso",
    phone: "+233 31 209 7788",
    email: "hub@sefwideaf.org",
    website: "https://sefwideaf.org",
    hours: "Mon–Fri: 9am–4pm",
    description:
      "Ghanaian Sign Language promotion and Deaf community advocacy in Western North.",
    about:
      "Our hub fosters the Deaf community in Western North through GSL classes, cultural events, and advocacy work with local government and schools.",
    coordinates: { lat: 6.2041, lng: -2.4839 },
    status: "approved",
    featured: false,
  },
  {
    name: "Dambai Intellectual Disability Clinic",
    badge: "Intellectual",
    badgeColor: "intellectual",
    tags: ["Assessment", "Behavioural Support", "Family Counselling"],
    location: "Dambai",
    region: "Oti",
    address: "1 Krachi Road, Dambai",
    phone: "+233 36 209 4400",
    email: "clinic@dambaiid.org",
    website: "https://dambaiid.org",
    hours: "Mon–Fri: 8am–3pm",
    description:
      "Intellectual disability assessment and behavioural support for families in the Oti region.",
    about:
      "We offer diagnostic assessments, behavioural support plans, and family counselling for children and adults with intellectual disabilities in the Oti region.",
    coordinates: { lat: 7.9631, lng: 0.1764 },
    status: "approved",
    featured: false,
  },
  {
    name: "Nalerigu Mental Health Support",
    badge: "Mental Health",
    badgeColor: "mental",
    tags: ["Psychiatric Nursing", "Community Care", "Stigma Reduction"],
    location: "Nalerigu",
    region: "North East",
    address: "Baptist Medical Centre, Nalerigu",
    phone: "+233 37 209 6600",
    email: "mhs@nalerigu.org",
    website: "https://nalerigu.org",
    hours: "Mon–Fri: 8am–5pm",
    description:
      "Psychiatric nursing and stigma-reduction programs for the North East region.",
    about:
      "Based at the Baptist Medical Centre, we provide psychiatric nursing, community care follow-ups, and run stigma-reduction campaigns across North East Ghana.",
    coordinates: { lat: 10.5267, lng: -0.3667 },
    status: "approved",
    featured: false,
  },
];

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // ── Admin ────────────────────────────────────────────────────────────────
    const existingAdmin = await User.findOne({ email: "admin@abilitymap.com" });
    if (existingAdmin) {
      console.log("⚠️  Admin already exists — skipping admin creation");
    } else {
      const admin = await User.create({
        name: "Admin",
        email: "admin@abilitymap.com",
        password: "admin12345",
        role: "admin",
      });
      console.log(`✅ Admin created  →  ${admin.email}  (${admin._id})`);
    }

    // ── Services ─────────────────────────────────────────────────────────────
    const existingCount = await Service.countDocuments();
    if (existingCount > 0) {
      console.log(
        `⚠️  ${existingCount} service(s) already exist — skipping service seed`,
      );
    } else {
      const inserted = await Service.insertMany(SERVICES_SEED);
      console.log(`✅ ${inserted.length} services seeded (one per region)`);
      inserted.forEach((s) => console.log(`   • [${s.region}] ${s.name}`));
    }

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

seedAll();
