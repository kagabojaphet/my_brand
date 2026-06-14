const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: [true, "Session ID is required"],
      trim: true,
      index: true,
    },
    ip: {
      type: String,
      trim: true,
      default: "",
    },
    country: {
      type: String,
      trim: true,
      default: "Unknown",
    },
    city: {
      type: String,
      trim: true,
      default: "Unknown",
    },
    device: {
      type: String,
      enum: {
        values: ["desktop", "mobile", "tablet", "unknown"],
        message: "{VALUE} is not a valid device type",
      },
      default: "desktop",
      index: true,
    },
    browser: {
      type: String,
      trim: true,
      default: "Unknown",
    },
    os: {
      type: String,
      trim: true,
      default: "Unknown",
    },
    referrer: {
      type: String,
      trim: true,
      default: "direct",
    },
    page: {
      type: String,
      required: [true, "Page path is required"],
      trim: true,
      index: true,
    },
    userAgent: {
      type: String,
      trim: true,
      default: "",
    },
    duration: {
      type: Number,
      default: 0,
      min: [0, "Duration cannot be negative"],
      // seconds spent on the page
    },
    bounced: {
      type: Boolean,
      default: true,
      // true = visitor left after viewing only this page
    },
  },
  {
    // Use Mongoose timestamps so `createdAt` / `updatedAt` are always
    // present and properly managed. The original manual `timestamp`
    // field (singular, not standard) is replaced here.
    timestamps: true,
  }
);

// ── Indexes ────────────────────────────────────────────────────────────────
visitorSchema.index({ createdAt: -1 });
visitorSchema.index({ sessionId: 1 });
visitorSchema.index({ page: 1 });
visitorSchema.index({ country: 1 });
visitorSchema.index({ createdAt: -1, page: 1 });

module.exports = mongoose.model("Visitor", visitorSchema);
