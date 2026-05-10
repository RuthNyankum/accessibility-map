import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Service from "../models/Service.js";
import User from "../models/User.js";

const seedData = [
  {
    name: "Accra Rehab Center",
    badge: "Physical",
    badgeColor: "physical",
    tags: [
      "Physiotherapy",
      "Wheelchair access",
      "Home visits",
      "Assistive devices",
      "Stroke recovery",
    ],
    location: "East Legon, Accra",
    region: "Greater Accra",
    address: "East Legon, Accra",
    phone: "+233 20 111 2233",
    email: "info@accrarehab.gh",
    website: "accrarehab.com.gh",
    hours: "Mon–Fri, 8am – 5pm",
    description:
      "Rehabilitation and physiotherapy services for people with physical disabilities.",
    about:
      "Accra Rehab Center offers a full range of rehabilitation services including physiotherapy, occupational therapy, and assistive device provision. Their team of certified professionals works with individuals recovering from injuries, stroke, and those living with physical disabilities.",
    coordinates: { lat: 5.6037, lng: -0.187 },
    featured: true,
    status: "approved",
  },
  {
    name: "Vision First Ghana",
    badge: "Visual",
    badgeColor: "visual",
    tags: ["Braille", "Screen readers", "Low vision", "Eye care"],
    location: "Kumasi",
    region: "Kumasi",
    address: "Adum, Kumasi",
    phone: "+233 30 000 0002",
    email: "info@visionfirst.gh",
    website: "visionfirst.com.gh",
    hours: "Mon–Fri, 9am – 4pm",
    description:
      "Counselling, psychotherapy, and community mental health programs.",
    about:
      "Vision First Ghana provides visual impairment support including braille training, assistive technology, and eye health referrals.",
    coordinates: { lat: 6.6885, lng: -1.6244 },
    featured: true,
    status: "approved",
  },
  {
    name: "Deaf Community Hub",
    badge: "Hearing",
    badgeColor: "hearing",
    tags: ["Sign language", "Deaf community", "Hearing aids"],
    location: "Accra",
    region: "Greater Accra",
    address: "Osu, Accra",
    phone: "+233 30 000 0003",
    email: "info@deafhub.gh",
    hours: "Mon–Sat, 8am – 6pm",
    description:
      "Sign language support, deaf community resources, and hearing aid referrals.",
    about:
      "Deaf Community Hub is a dedicated resource centre for the deaf and hard of hearing in Ghana, offering sign language classes, community events, and hearing device support.",
    coordinates: { lat: 5.5502, lng: -0.1962 },
    featured: true,
    status: "approved",
  },
  {
    name: "Mental Wellness GH",
    badge: "Mental Health",
    badgeColor: "mental",
    tags: ["Counselling", "Psychotherapy", "Group therapy"],
    location: "Accra",
    region: "Greater Accra",
    address: "Labone, Accra",
    phone: "+233 30 000 0004",
    email: "hello@mentalwellness.gh",
    hours: "Mon–Fri, 8am – 6pm",
    description:
      "Counselling, psychotherapy, and community mental health programs.",
    about:
      "Mental Wellness GH provides accessible, affordable mental health support including individual counselling, group therapy, and community outreach programs.",
    coordinates: { lat: 5.5717, lng: -0.1821 },
    featured: true,
    status: "approved",
  },
];

const seed = async () => {
  await connectDB();

  try {
    await Service.deleteMany({});
    console.log("Existing services cleared");

    await Service.insertMany(seedData);
    console.log(`${seedData.length} services seeded successfully`);
  } catch (err) {
    console.error("Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

seed();
