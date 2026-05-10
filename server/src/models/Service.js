import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    // Primary disability type shown as the main badge
    badge: {
      type: String,
      required: [true, "Service type is required"],
      enum: [
        "Physical",
        "Visual",
        "Hearing",
        "Mental Health",
        "Speech",
        "Intellectual",
      ],
    },

    // CSS color key used for the badge component
    badgeColor: {
      type: String,
      enum: [
        "physical",
        "visual",
        "hearing",
        "mental",
        "speech",
        "intellectual",
      ],
      required: true,
    },

    // Additional tags shown as pills on the detail page
    tags: [{ type: String, trim: true }],

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    region: {
      type: String,
      required: [true, "Region is required"],
      enum: [
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
      ],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    website: {
      type: String,
      trim: true,
    },

    hours: {
      type: String,
      trim: true,
    },

    // Short paragraph shown on cards
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [150, "Description cannot exceed 300 characters"],
    },

    // Full paragraph shown on the detail page
    about: {
      type: String,
      maxlength: [2000, "About cannot exceed 2000 characters"],
    },

    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },

    // Shown in the hero section on the home page
    featured: {
      type: Boolean,
      default: false,
    },

    // Services stay pending until an admin approves them
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // The user who submitted the service
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

// Text index for full-text search
serviceSchema.index({ name: "text", description: "text", about: "text" });

const Service = mongoose.model("Service", serviceSchema);
export default Service;
