const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      trim:      true,
      default:   "Japhet",
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    tagline: {
      type:      String,
      trim:      true,
      default:   "",
      maxlength: [200, "Tagline cannot exceed 200 characters"],
    },
    bio: {
      type:      String,
      trim:      true,
      default:   "",
      maxlength: [2000, "Bio cannot exceed 2000 characters"],
    },
    email: {
      type:      String,
      trim:      true,
      lowercase: true,
      default:   "",
    },
    phone: {
      type:    String,
      trim:    true,
      default: "",
    },
    location: {
      type:    String,
      trim:    true,
      default: "",
    },
    accentColor: {
      type:    String,
      trim:    true,
      default: "#FF4D00",
    },
    availability: {
      type:    Boolean,
      default: true,
    },
    availabilityNote: {
      type:    String,
      trim:    true,
      default: "Available for freelance",
    },

    // ── Logo (uploaded via Cloudinary) ─────────────────────────────────────
    logo:         { type: String, default: "" }, // Cloudinary secure_url
    logoPublicId: { type: String, default: "" }, // Cloudinary public_id

    // ── Profile avatar (uploaded via Cloudinary) ───────────────────────────
    avatar:         { type: String, default: "" },
    avatarPublicId: { type: String, default: "" },

    // ── Social links ───────────────────────────────────────────────────────
    socials: {
      github:   { type: String, trim: true, default: "" },
      linkedin: { type: String, trim: true, default: "" },
      twitter:  { type: String, trim: true, default: "" },
      dribbble: { type: String, trim: true, default: "" },
      website:  { type: String, trim: true, default: "" },
    },

    // ── SEO ────────────────────────────────────────────────────────────────
    seo: {
      title:       { type: String, trim: true, default: "" },
      description: { type: String, trim: true, default: "" },
      keywords:    { type: String, trim: true, default: "" },
    },

    // ── Resume PDF ────────────────────────────────────────────────────────
    resumeUrl:      { type: String, default: "" },
    resumePublicId: { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

module.exports = mongoose.model("Brand", brandSchema);
