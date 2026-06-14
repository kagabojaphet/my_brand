// src/models/Blog.js  — final version
const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true, maxlength: [100, "Name cannot exceed 100 characters"] },
    content: { type: String, required: true, trim: true, maxlength: [800, "Reply cannot exceed 800 characters"] },
    avatar:  { type: String, default: "" },
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true, maxlength: [100, "Name cannot exceed 100 characters"] },
    email:    {
      type: String, required: true, lowercase: true, trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    avatar:   { type: String, default: "" },
    content:  { type: String, required: true, trim: true, maxlength: [1000, "Comment cannot exceed 1000 characters"] },
    approved: { type: Boolean, default: false },
    likes:    { type: Number, default: 0, min: [0, "Likes cannot be negative"] },
    replies:  [replySchema],
  },
  { timestamps: true }
);

const blogSchema = new mongoose.Schema(
  {
    title:   {
      type: String, required: [true, "Blog title is required"],
      trim: true, maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug:    { type: String, unique: true, lowercase: true, trim: true, index: true },
    excerpt: {
      type: String, required: [true, "Blog excerpt is required"],
      trim: true, maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    content: { type: String, required: [true, "Blog content is required"] },

    category: {
      type: String,
      required: [true, "Blog category is required"],
      enum: {
        // ── Added "DevOps" to match the rest of the codebase ──
        values:  ["React", "Design", "Career", "Tutorials", "Node.js", "DevOps", "General"],
        message: "{VALUE} is not a valid category",
      },
    },

    tags:       [{ type: String, trim: true, lowercase: true }],
    coverImage: { url: { type: String, default: "" }, publicId: { type: String, default: "" } },
    readTime:   { type: String, default: "1 min" },
    featured:   { type: Boolean, default: false },
    published:  { type: Boolean, default: false },
    author:     { type: String, default: "Japhet", trim: true },

    likes:      { type: Number, default: 0, min: [0, "Likes cannot be negative"] },
    dislikes:   { type: Number, default: 0, min: [0, "Dislikes cannot be negative"] },
    shares:     { type: Number, default: 0, min: [0, "Shares cannot be negative"] },
    views:      { type: Number, default: 0, min: [0, "Views cannot be negative"] },

    likedBy:    [{ type: String }],
    dislikedBy: [{ type: String }],

    comments: [commentSchema],

    metaDescription: {
      type: String, trim: true,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },
  },
  {
    timestamps: true,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

/* ── Indexes ──────────────────────────────────────────────────────────────── */
blogSchema.index({ slug: 1 });
blogSchema.index({ published: 1, createdAt: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ featured: -1, createdAt: -1 });

/* ── Virtual: approved comment count ─────────────────────────────────────── */
blogSchema.virtual("commentCount").get(function () {
  return this.comments?.filter((c) => c.approved).length ?? 0;
});

/* ── Auto-generate slug from title (only when slug is empty) ─────────────── */
blogSchema.pre("validate", function (next) {
  if (this.isModified("title") && (!this.slug || this.slug === "")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 200);
  }
  next();
});

/* ── Auto-calculate read time ─────────────────────────────────────────────── */
blogSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    const words = this.content
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .filter(Boolean).length;
    this.readTime = `${Math.max(1, Math.ceil(words / 200))} min read`;
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
