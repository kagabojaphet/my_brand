const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: [true, "Institution name is required"], trim: true, maxlength: [200, "Institution name cannot exceed 200 characters"] },
    degree:      { type: String, required: [true, "Degree is required"], trim: true, maxlength: [200, "Degree cannot exceed 200 characters"] },
    field:       { type: String, required: [true, "Field of study is required"], trim: true, maxlength: [200, "Field cannot exceed 200 characters"] },
    startYear:   { type: String, required: [true, "Start year is required"], trim: true, match: [/^\d{4}$/, "Start year must be a 4-digit year"] },
    endYear:     { type: String, trim: true, default: "Present" },
    current:     { type: Boolean, default: false },
    description: { type: String, trim: true, maxlength: [1000, "Description cannot exceed 1000 characters"], default: "" },
    grade:       { type: String, trim: true, maxlength: [50, "Grade cannot exceed 50 characters"], default: "" },
    // Logo — uploaded to Cloudinary, stored as URL + publicId
    logo:         { type: String, default: "" },  // Cloudinary secure_url
    logoPublicId: { type: String, default: "" },  // Cloudinary public_id
    location:    { type: String, trim: true, maxlength: [200, "Location cannot exceed 200 characters"], default: "" },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

educationSchema.pre("save", function (next) {
  if (this.current) this.endYear = "Present";
  next();
});

educationSchema.index({ order: 1, startYear: -1 });

module.exports = mongoose.model("Education", educationSchema);
