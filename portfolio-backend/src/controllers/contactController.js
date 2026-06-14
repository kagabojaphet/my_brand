const Contact = require("../models/Contact");

const ALLOWED_STATUSES = ["unread", "read", "replied", "archived"];

// ── POST /api/contact  (public) ────────────────────────────────────────────
exports.sendMessage = async (req, res, next) => {
  try {
    
    const { name, email, subject, message } = req.body;

    // Basic presence check (model validators will do deeper validation)
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim())
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });

    const ip = ((req.headers["x-forwarded-for"] || req.ip || "") + "")
      .split(",")[0]
      .trim();

    await Contact.create({
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      ip,
    });

    res.status(201).json({
      success: true,
      message: "Message sent! I'll get back to you as soon as possible.",
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/contact/admin/all  (admin) ────────────────────────────────────
exports.getMessages = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = {};
    if (status && ALLOWED_STATUSES.includes(status)) query.status = status;

    const pageNum  = Math.max(1, parseInt(page,  10) || 1);
    const limitNum = Math.min(100, parseInt(limit, 10) || 20);

    const [total, messages, unread] = await Promise.all([
      Contact.countDocuments(query),
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Contact.countDocuments({ status: "unread" }),
    ]);

    res.json({
      success: true,
      data:    messages,
      unread,
      pagination: {
        total,
        page:  pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/contact/admin/:id/status  (admin) ───────────────────────────
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !ALLOWED_STATUSES.includes(status))
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
      });

    const msg = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!msg)
      return res.status(404).json({ success: false, message: "Message not found." });

    res.json({ success: true, data: msg, message: `Marked as "${status}".` });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/contact/admin/:id  (admin) ─────────────────────────────────
exports.deleteMessage = async (req, res, next) => {
  try {
    const msg = await Contact.findByIdAndDelete(req.params.id);
    if (!msg)
      return res.status(404).json({ success: false, message: "Message not found." });

    res.json({ success: true, message: "Message deleted." });
  } catch (err) {
    next(err);
  }
};
