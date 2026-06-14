const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  { url: { type: String, required: true }, publicId: { type: String, required: true }, caption: { type: String, trim: true, default: "" } },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    title:       { type: String, required: [true, "Project title is required"], trim: true, maxlength: [200, "Title cannot exceed 200 characters"] },
    category:    { type: String, required: [true, "Project category is required"], enum: { values: ["React Apps", "Web Design", "Mobile", "Branding", "Full Stack", "Other"], message: "{VALUE} is not a valid category" }, index: true },
    description: { type: String, required: [true, "Project description is required"], trim: true, maxlength: [3000, "Description cannot exceed 3000 characters"] },
    shortDesc:   { type: String, trim: true, maxlength: [300, "Short description cannot exceed 300 characters"], default: "" },
    tags:        [{ type: String, trim: true, lowercase: true }],
    // Cover image — Cloudinary
    coverImage:  { url: { type: String, default: "" }, publicId: { type: String, default: "" } },
    // Additional gallery images — each uploaded to Cloudinary
    images:      [imageSchema],
    demoUrl:     { type: String, trim: true, default: "", match: [/^https?:\/\/.+|^$/, "Demo URL must be a valid URL"] },
    githubUrl:   { type: String, trim: true, default: "", match: [/^https?:\/\/.+|^$/, "GitHub URL must be a valid URL"] },
    result:      { type: String, trim: true, maxlength: [200, "Result cannot exceed 200 characters"], default: "" },
    featured:    { type: Boolean, default: false, index: true },
    published:   { type: Boolean, default: true,  index: true },
    order:       { type: Number, default: 0 },
    color:       { type: String, default: "from-blue-400/20 to-purple-400/20" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

projectSchema.index({ published: 1, order: 1, createdAt: -1 });
projectSchema.index({ featured: -1 });

module.exports = mongoose.model("Project", projectSchema);
