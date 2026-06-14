const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: [true, "Page path is required"],
      trim: true,
      index: true,
    },

    // ── Core Web Vitals ────────────────────────────────────────────────────
    lcp: {
      type: Number,
      min: [0, "LCP cannot be negative"],
      default: null,
      // Largest Contentful Paint — milliseconds (good: <2500ms)
    },
    fid: {
      type: Number,
      min: [0, "FID cannot be negative"],
      default: null,
      // First Input Delay — milliseconds (good: <100ms)
    },
    cls: {
      type: Number,
      min: [0, "CLS cannot be negative"],
      default: null,
      // Cumulative Layout Shift — unitless score (good: <0.1)
    },
    ttfb: {
      type: Number,
      min: [0, "TTFB cannot be negative"],
      default: null,
      // Time to First Byte — milliseconds (good: <800ms)
    },
    fcp: {
      type: Number,
      min: [0, "FCP cannot be negative"],
      default: null,
      // First Contentful Paint — milliseconds (good: <1800ms)
    },
    loadTime: {
      type: Number,
      min: [0, "Load time cannot be negative"],
      default: null,
      // Total page load time — milliseconds
    },

    device: {
      type: String,
      enum: {
        values: ["desktop", "mobile", "tablet", "unknown"],
        message: "{VALUE} is not a valid device type",
      },
      default: "desktop",
    },
    connection: {
      type: String,
      enum: {
        values: ["slow-2g", "2g", "3g", "4g", "wifi", "unknown"],
        message: "{VALUE} is not a valid connection type",
      },
      default: "unknown",
    },
  },
  {
    // Same fix as PageView — use Mongoose timestamps for consistency
    timestamps: true,
  }
);

// ── Indexes ────────────────────────────────────────────────────────────────
performanceSchema.index({ page: 1, createdAt: -1 });
performanceSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Performance", performanceSchema);
