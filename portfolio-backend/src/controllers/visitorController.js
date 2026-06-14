const Visitor = require("../models/Visitor");

const VALID_DEVICES = ["desktop", "mobile", "tablet", "unknown"];

// ── POST /api/visitors  (public — called from frontend) ────────────────────
exports.trackVisitor = async (req, res, next) => {
  try {
    const {
      sessionId, country, city,
      device, browser, os,
      referrer, page, userAgent,
    } = req.body;

    if (!sessionId || !page)
      return res
        .status(400)
        .json({ success: false, message: "sessionId and page are required." });

    const ip = ((req.headers["x-forwarded-for"] || req.ip || "") + "")
      .split(",")[0]
      .trim();

    await Visitor.create({
      sessionId,
      ip,
      country:   country   || "Unknown",
      city:      city      || "Unknown",
      device:    VALID_DEVICES.includes(device) ? device : "unknown",
      browser:   browser   || "Unknown",
      os:        os        || "Unknown",
      referrer:  referrer  || "direct",
      page:      page.trim(),
      userAgent: userAgent || "",
    });

    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/visitors/:sessionId/duration  (public — called on page leave)
exports.updateDuration = async (req, res, next) => {
  try {
    const { duration, bounced } = req.body;

    const update = {};
    if (duration !== undefined) update.duration = Math.max(0, Number(duration) || 0);
    if (bounced  !== undefined) update.bounced  = bounced === true || bounced === "true";

    // FIX: sort by `createdAt` not `timestamp` (model uses Mongoose timestamps now)
    await Visitor.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      update,
      { sort: { createdAt: -1 } }
    );

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/visitors/admin/all  (admin) ───────────────────────────────────
exports.getVisitors = async (req, res, next) => {
  try {
    const days  = Math.min(Math.max(Number(req.query.days) || 30, 1), 365);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // FIX: use `createdAt` throughout (model no longer has a `timestamp` field)
    const matchStage = { $match: { createdAt: { $gte: since } } };

    const [
      total,
      byCountry,
      byDevice,
      byPage,
      recent,
      byDay,
      bouncedCount,
    ] = await Promise.all([

      Visitor.countDocuments({ createdAt: { $gte: since } }),

      Visitor.aggregate([
        matchStage,
        { $group: { _id: "$country", count: { $sum: 1 } } },
        { $sort:  { count: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, country: "$_id", count: 1 } },
      ]),

      Visitor.aggregate([
        matchStage,
        { $group: { _id: "$device", count: { $sum: 1 } } },
        { $sort:  { count: -1 } },
        { $project: { _id: 0, device: "$_id", count: 1 } },
      ]),

      Visitor.aggregate([
        matchStage,
        { $group: { _id: "$page", count: { $sum: 1 } } },
        { $sort:  { count: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, page: "$_id", count: 1 } },
      ]),

      Visitor.find({ createdAt: { $gte: since } })
        .sort({ createdAt: -1 })
        .limit(20)
        .select("-userAgent")
        .lean(),

      Visitor.aggregate([
        matchStage,
        {
          $group: {
            _id:   { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: "$_id", count: 1 } },
      ]),

      Visitor.countDocuments({ createdAt: { $gte: since }, bounced: true }),
    ]);

    const bounceRate = total > 0
      ? `${Math.round((bouncedCount / total) * 100)}%`
      : "0%";

    res.json({
      success: true,
      data: {
        total,
        byCountry,
        byDevice,
        byPage,
        recent,
        byDay,
        bounceRate,
        period: { days, since },
      },
    });
  } catch (err) {
    next(err);
  }
};
