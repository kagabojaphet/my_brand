const mongoose = require("mongoose");

const pageViewSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: [true, "Page path is required"],
      trim: true,
      index: true,
    },
    sessionId: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    referrer: {
      type: String,
      trim: true,
      default: "direct",
    },
    device: {
      type: String,
      enum: {
        values: ["desktop", "mobile", "tablet", "unknown"],
        message: "{VALUE} is not a valid device type",
      },
      default: "desktop",
    },
    loadTime: {
      type: Number,
      default: 0,
      min: [0, "Load time cannot be negative"],
      // milliseconds
    },
  },
  {
    // Use timestamps: true so createdAt is auto-set and properly indexed.
    // A manual `timestamp: { type: Date, default: Date.now }` field
    // was named inconsistently (singular vs the rest of the codebase).
    timestamps: true,
  }
);

// ── Indexes ────────────────────────────────────────────────────────────────
pageViewSchema.index({ page: 1, createdAt: -1 });
pageViewSchema.index({ createdAt: -1 });
pageViewSchema.index({ sessionId: 1 });

module.exports = mongoose.model("PageView", pageViewSchema);
