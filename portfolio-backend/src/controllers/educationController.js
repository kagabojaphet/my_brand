// src/controllers/educationController.js
const Education      = require("../models/Education");
const { cloudinary } = require("../config/cloudinary");

const destroyImage = async (publicId) => {
  if (publicId) {
    try { await cloudinary.uploader.destroy(publicId); } catch (_) {}
  }
};

// GET /api/education  (public)
exports.getEducation = async (req, res, next) => {
  try {
    const list = await Education.find().sort({ order: 1, startYear: -1 }).lean();
    res.json({ success: true, data: list });
  } catch (err) { next(err); }
};

// GET /api/education/admin/all  (admin)
exports.adminGetEducation = async (req, res, next) => {
  try {
    const list = await Education.find().sort({ order: 1, startYear: -1 }).lean();
    res.json({ success: true, data: list });
  } catch (err) { next(err); }
};

// POST /api/education/admin/create  (admin)
exports.createEducation = async (req, res, next) => {
  try {
    const {
      institution, degree, field,
      startYear, endYear, current,
      description, grade, location, order,
    } = req.body;

    const isCurrent = current === "true" || current === true;

    const education = await Education.create({
      institution: institution?.trim(),
      degree:      degree?.trim(),
      field:       field?.trim(),
      startYear:   startYear?.trim(),
      endYear:     isCurrent ? "Present" : endYear?.trim() || "Present",
      current:     isCurrent,
      description: description?.trim() || "",
      grade:       grade?.trim()       || "",
      location:    location?.trim()    || "",
      order:       Number(order)       || 0,
      logo:         req.file ? req.file.path     : "",
      logoPublicId: req.file ? req.file.filename : "",
    });

    res.status(201).json({ success: true, data: education, message: "Education entry created." });
  } catch (err) { next(err); }
};

// PUT /api/education/admin/:id  (admin)
exports.updateEducation = async (req, res, next) => {
  try {
    const {
      institution, degree, field,
      startYear, endYear, current,
      description, grade, location, order,
    } = req.body;

    const update = {};
    if (institution !== undefined) update.institution = institution.trim();
    if (degree      !== undefined) update.degree      = degree.trim();
    if (field       !== undefined) update.field       = field.trim();
    if (startYear   !== undefined) update.startYear   = startYear.trim();
    if (grade       !== undefined) update.grade       = grade.trim();
    if (location    !== undefined) update.location    = location.trim();
    if (description !== undefined) update.description = description.trim();
    if (order       !== undefined) update.order       = Number(order) || 0;

    if (current !== undefined) {
      update.current = current === "true" || current === true;
      update.endYear = update.current
        ? "Present"
        : endYear?.trim() || "Present";
    } else if (endYear !== undefined) {
      update.endYear = endYear.trim();
    }

    if (req.file) {
      const existing = await Education.findById(req.params.id).select("logoPublicId");
      await destroyImage(existing?.logoPublicId);
      update.logo         = req.file.path;
      update.logoPublicId = req.file.filename;
    }

    const education = await Education.findByIdAndUpdate(req.params.id, update, {
      new: true, runValidators: true,
    });
    if (!education)
      return res.status(404).json({ success: false, message: "Entry not found." });

    res.json({ success: true, data: education, message: "Education updated." });
  } catch (err) { next(err); }
};

// DELETE /api/education/admin/:id  (admin)
exports.deleteEducation = async (req, res, next) => {
  try {
    const education = await Education.findById(req.params.id);
    if (!education)
      return res.status(404).json({ success: false, message: "Entry not found." });

    await destroyImage(education.logoPublicId);
    await education.deleteOne();

    res.json({ success: true, message: "Education entry deleted." });
  } catch (err) { next(err); }
};