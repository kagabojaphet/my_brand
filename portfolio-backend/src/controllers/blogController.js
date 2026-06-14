// src/controllers/blogController.js
const Blog = require("../models/Blog");
const { cloudinary } = require("../config/cloudinary");

const getIP = (req) =>
  ((req.headers["x-forwarded-for"] || req.ip || "unknown") + "").split(",")[0].trim();

const destroyImage = async (publicId) => {
  if (publicId) { try { await cloudinary.uploader.destroy(publicId); } catch (_) {} }
};

const parseTags = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map((t) => String(t).trim()).filter(Boolean);
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map((t) => String(t).trim()).filter(Boolean) : [];
  } catch (_) { return raw.split(",").map((t) => t.trim()).filter(Boolean); }
};

// ── PUBLIC ────────────────────────────────────────────────────────────────

exports.getBlogs = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 9, featured } = req.query;
    const query = { published: true };
    if (category && category !== "All") query.category = category;
    if (featured === "true") query.featured = true;
    if (search && search.trim()) {
      const re = { $regex: search.trim(), $options: "i" };
      query.$or = [{ title: re }, { excerpt: re }, { tags: re }];
    }
    const pageNum  = Math.max(1, parseInt(page,  10) || 1);
    const limitNum = Math.min(50, parseInt(limit, 10) || 9);
    const [total, blogs] = await Promise.all([
      Blog.countDocuments(query),
      Blog.find(query)
        .select("-content -likedBy -dislikedBy -comments")
        .sort({ featured: -1, createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
    ]);
    res.json({
      success: true,
      data: blogs,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) { next(err); }
};

exports.getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true })
      .select("-likedBy -dislikedBy");
    if (!blog) return res.status(404).json({ success: false, message: "Blog post not found." });
    Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).exec();
    res.json({ success: true, data: blog });
  } catch (err) { next(err); }
};

// ── REACTIONS ─────────────────────────────────────────────────────────────

exports.getReactions = async (req, res, next) => {
  try {
    const ip = getIP(req);
    const blog = await Blog.findById(req.params.id)
      .select("likes dislikes shares likedBy dislikedBy").lean();
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });
    res.json({
      success:  true,
      liked:    blog.likedBy.includes(ip),
      disliked: blog.dislikedBy.includes(ip),
      likes:    blog.likes,
      dislikes: blog.dislikes,
      shares:   blog.shares,
    });
  } catch (err) { next(err); }
};

exports.likeBlog = async (req, res, next) => {
  try {
    const ip = getIP(req);
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });
    const alreadyLiked = blog.likedBy.includes(ip);
    if (alreadyLiked) {
      blog.likedBy.pull(ip);
      blog.likes = Math.max(0, blog.likes - 1);
    } else {
      if (blog.dislikedBy.includes(ip)) {
        blog.dislikedBy.pull(ip);
        blog.dislikes = Math.max(0, blog.dislikes - 1);
      }
      blog.likedBy.push(ip);
      blog.likes += 1;
    }
    await blog.save();
    res.json({ success: true, liked: !alreadyLiked, likes: blog.likes, dislikes: blog.dislikes });
  } catch (err) { next(err); }
};

exports.dislikeBlog = async (req, res, next) => {
  try {
    const ip = getIP(req);
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });
    const alreadyDisliked = blog.dislikedBy.includes(ip);
    if (alreadyDisliked) {
      blog.dislikedBy.pull(ip);
      blog.dislikes = Math.max(0, blog.dislikes - 1);
    } else {
      if (blog.likedBy.includes(ip)) {
        blog.likedBy.pull(ip);
        blog.likes = Math.max(0, blog.likes - 1);
      }
      blog.dislikedBy.push(ip);
      blog.dislikes += 1;
    }
    await blog.save();
    res.json({ success: true, disliked: !alreadyDisliked, likes: blog.likes, dislikes: blog.dislikes });
  } catch (err) { next(err); }
};

exports.shareBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id, { $inc: { shares: 1 } }, { new: true }
    ).select("shares");
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });
    res.json({ success: true, shares: blog.shares });
  } catch (err) { next(err); }
};

// ── COMMENTS (PUBLIC) ─────────────────────────────────────────────────────

exports.getComments = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).select("comments");
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });
    const approved = blog.comments
      .filter((c) => c.approved)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, data: approved, total: approved.length });
  } catch (err) { next(err); }
};

exports.addComment = async (req, res, next) => {
  try {
    const { name, email, content } = req.body;
    if (!name?.trim() || !email?.trim() || !content?.trim())
      return res.status(400).json({ success: false, message: "Name, email and content are required." });
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=FF4D00&color=fff&size=80&rounded=true`;
    blog.comments.push({
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      content: content.trim(),
      avatar,
      approved: false,
    });
    await blog.save();
    res.status(201).json({
      success: true,
      message: "Comment submitted — it will appear after admin approval. Thank you!",
    });
  } catch (err) { next(err); }
};

exports.replyToComment = async (req, res, next) => {
  try {
    const { name, content } = req.body;
    if (!name?.trim() || !content?.trim())
      return res.status(400).json({ success: false, message: "Name and content are required." });
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });
    const comment = blog.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found." });
    if (!comment.approved)
      return res.status(400).json({ success: false, message: "Cannot reply to a pending comment." });
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=555&color=fff&size=60&rounded=true`;
    comment.replies.push({ name: name.trim(), content: content.trim(), avatar });
    await blog.save();
    res.status(201).json({ success: true, message: "Reply added." });
  } catch (err) { next(err); }
};

// ── ADMIN CRUD ────────────────────────────────────────────────────────────

exports.adminGetBlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, published } = req.query;
    const query = {};
    if (search) query.title = { $regex: search.trim(), $options: "i" };
    if (published !== undefined && published !== "") query.published = published === "true";
    const pageNum  = Math.max(1, parseInt(page,  10) || 1);
    const limitNum = Math.min(50, parseInt(limit, 10) || 10);
    const [total, blogs] = await Promise.all([
      Blog.countDocuments(query),
      Blog.find(query)
        .select("-content -likedBy -dislikedBy")
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
    ]);
    res.json({
      success: true,
      data: blogs,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) { next(err); }
};

exports.createBlog = async (req, res, next) => {
  try {
    const { title, excerpt, content, category, tags, featured, published, metaDescription, author } = req.body;
    const blog = await Blog.create({
      title:    title?.trim(),
      excerpt:  excerpt?.trim(),
      content,
      category,
      author:   author?.trim() || "Japhet",
      tags:     parseTags(tags),
      featured:  featured  === "true",
      published: published === "true",
      metaDescription: metaDescription?.trim(),
      coverImage: req.file
        ? { url: req.file.path, publicId: req.file.filename }
        : { url: "", publicId: "" },
    });
    res.status(201).json({ success: true, data: blog, message: "Blog created." });
  } catch (err) { next(err); }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const { title, excerpt, content, category, tags, featured, published, metaDescription, author } = req.body;
    const update = {};
    if (title           !== undefined) update.title           = title.trim();
    if (excerpt         !== undefined) update.excerpt         = excerpt.trim();
    if (content         !== undefined) update.content         = content;
    if (category        !== undefined) update.category        = category;
    if (author          !== undefined) update.author          = author.trim();
    if (tags            !== undefined) update.tags            = parseTags(tags);
    if (featured        !== undefined) update.featured        = featured  === "true";
    if (published       !== undefined) update.published       = published === "true";
    if (metaDescription !== undefined) update.metaDescription = metaDescription.trim();
    if (req.file) {
      const existing = await Blog.findById(req.params.id).select("coverImage");
      await destroyImage(existing?.coverImage?.publicId);
      update.coverImage = { url: req.file.path, publicId: req.file.filename };
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });
    res.json({ success: true, data: blog, message: "Blog updated." });
  } catch (err) { next(err); }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });
    await destroyImage(blog.coverImage?.publicId);
    await blog.deleteOne();
    res.json({ success: true, message: "Blog deleted." });
  } catch (err) { next(err); }
};

// ── ADMIN COMMENT MODERATION ─────────────────────────────────────────────

exports.getPendingComments = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ "comments.approved": false }).select("title slug comments");
    const pending = [];
    blogs.forEach((blog) =>
      blog.comments.filter((c) => !c.approved).forEach((c) =>
        pending.push({ ...c.toObject(), blogId: blog._id, blogTitle: blog.title, blogSlug: blog.slug })
      )
    );
    pending.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, data: pending, total: pending.length });
  } catch (err) { next(err); }
};

exports.approveComment = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });
    const comment = blog.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found." });
    comment.approved = !comment.approved;
    await blog.save();
    res.json({
      success:  true,
      approved: comment.approved,
      message:  `Comment ${comment.approved ? "approved" : "hidden"}.`,
    });
  } catch (err) { next(err); }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });
    blog.comments.pull(req.params.commentId);
    await blog.save();
    res.json({ success: true, message: "Comment deleted." });
  } catch (err) { next(err); }
};
