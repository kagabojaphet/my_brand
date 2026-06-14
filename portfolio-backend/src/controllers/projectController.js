// src/controllers/projectController.js
const Project        = require("../models/Project");
const { cloudinary } = require("../config/cloudinary");

const destroyImage = async (publicId) => {
  if (publicId) {
    try { await cloudinary.uploader.destroy(publicId); } catch (_) {}
  }
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

// GET /api/projects
exports.getProjects = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const query = { published: true };
    if (category && category !== "All") query.category = category;
    if (featured === "true")            query.featured  = true;

    const projects = await Project.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();
    res.json({ success: true, data: projects });
  } catch (err) { next(err); }
};

// GET /api/projects/:id
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, published: true }).lean();
    if (!project)
      return res.status(404).json({ success: false, message: "Project not found." });
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
};

// ── ADMIN ─────────────────────────────────────────────────────────────────

// GET /api/projects/admin/all
exports.adminGetProjects = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search?.trim()) query.title = { $regex: search.trim(), $options: "i" };

    const projects = await Project.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();
    res.json({ success: true, data: projects });
  } catch (err) { next(err); }
};

// POST /api/projects/admin/create
exports.createProject = async (req, res, next) => {
  try {
    const {
      title, category, description, shortDesc,
      tags, demoUrl, githubUrl, result,
      featured, published, order, color,
    } = req.body;

    const project = await Project.create({
      title:       title?.trim(),
      category,
      description: description?.trim(),
      shortDesc:   shortDesc?.trim()  || "",
      demoUrl:     demoUrl?.trim()    || "",
      githubUrl:   githubUrl?.trim()  || "",
      result:      result?.trim()     || "",
      color:       color              || "from-blue-400/20 to-purple-400/20",
      tags:        parseTags(tags),
      featured:    featured  === "true",
      published:   published !== "false",
      order:       Number(order) || 0,
      coverImage:  req.file
        ? { url: req.file.path, publicId: req.file.filename }
        : { url: "", publicId: "" },
    });

    res.status(201).json({ success: true, data: project, message: "Project created." });
  } catch (err) { next(err); }
};

// PUT /api/projects/admin/:id
exports.updateProject = async (req, res, next) => {
  try {
    const {
      title, category, description, shortDesc,
      tags, demoUrl, githubUrl, result,
      featured, published, order, color,
    } = req.body;

    const update = {};
    if (title       !== undefined) update.title       = title.trim();
    if (category    !== undefined) update.category    = category;
    if (description !== undefined) update.description = description.trim();
    if (shortDesc   !== undefined) update.shortDesc   = shortDesc.trim();
    if (demoUrl     !== undefined) update.demoUrl     = demoUrl.trim();
    if (githubUrl   !== undefined) update.githubUrl   = githubUrl.trim();
    if (result      !== undefined) update.result      = result.trim();
    if (color       !== undefined) update.color       = color;
    if (tags        !== undefined) update.tags        = parseTags(tags);
    if (featured    !== undefined) update.featured    = featured  === "true";
    if (published   !== undefined) update.published   = published === "true";
    if (order       !== undefined) update.order       = Number(order) || 0;

    if (req.file) {
      const existing = await Project.findById(req.params.id).select("coverImage");
      await destroyImage(existing?.coverImage?.publicId);
      update.coverImage = { url: req.file.path, publicId: req.file.filename };
    }

    const project = await Project.findByIdAndUpdate(req.params.id, update, {
      new: true, runValidators: true,
    });
    if (!project)
      return res.status(404).json({ success: false, message: "Project not found." });

    res.json({ success: true, data: project, message: "Project updated." });
  } catch (err) { next(err); }
};

// DELETE /api/projects/admin/:id
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project)
      return res.status(404).json({ success: false, message: "Project not found." });

    await destroyImage(project.coverImage?.publicId);
    for (const img of project.images ?? []) await destroyImage(img.publicId);
    await project.deleteOne();

    res.json({ success: true, message: "Project deleted." });
  } catch (err) { next(err); }
};