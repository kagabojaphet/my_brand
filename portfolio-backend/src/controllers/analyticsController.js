const PageView = require("../models/PageView");

// ── POST /api/analytics/track  (public — called from frontend) ─────────────
exports.trackView = async (req, res, next) => {
  try {
    const { page, sessionId, referrer, device, loadTime } = req.body;

    if (!page || typeof page !== "string" || !page.trim())
      return res.status(400).json({ success: false, message: "page is required." });

    // Sanitise / normalise the device value so it matches the enum
    const deviceEnum = ["desktop", "mobile", "tablet", "unknown"];
    const normDevice = deviceEnum.includes(device) ? device : "unknown";

    await PageView.create({
      page:      page.trim(),
      sessionId: sessionId || "",
      referrer:  referrer  || "direct",
      device:    normDevice,
      loadTime:  Number(loadTime) || 0,
    });

    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/analytics  (admin) ────────────────────────────────────────────
exports.getAnalytics = async (req, res, next) => {
  try {
    const days  = Math.min(Math.max(Number(req.query.days) || 30, 1), 365); // clamp 1–365
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // FIX: PageView now uses `createdAt` (Mongoose timestamps), NOT `timestamp`
    const dateField = "$createdAt";

    const [totalViews, viewsByPage, viewsByDay, viewsByDevice, avgLoadTime] =
      await Promise.all([
        // Total page views in window
        PageView.countDocuments({ createdAt: { $gte: since } }),

        // Top 10 most-visited pages
        PageView.aggregate([
          { $match: { createdAt: { $gte: since } } },
          { $group: { _id: "$page", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
          { $project: { _id: 0, page: "$_id", count: 1 } },
        ]),

        // Daily view counts (for line chart)
        PageView.aggregate([
          { $match: { createdAt: { $gte: since } } },
          {
            $group: {
              _id:   { $dateToString: { format: "%Y-%m-%d", date: dateField } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          { $project: { _id: 0, date: "$_id", count: 1 } },
        ]),

        // Breakdown by device
        PageView.aggregate([
          { $match: { createdAt: { $gte: since } } },
          { $group: { _id: "$device", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $project: { _id: 0, device: "$_id", count: 1 } },
        ]),

        // Average load time across all pages
        PageView.aggregate([
          { $match: { createdAt: { $gte: since }, loadTime: { $gt: 0 } } },
          { $group: { _id: null, avg: { $avg: "$loadTime" } } },
        ]),
      ]);

    res.json({
      success: true,
      data: {
        totalViews,
        viewsByPage,
        viewsByDay,
        viewsByDevice,
        avgLoadTime: Math.round(avgLoadTime[0]?.avg || 0),
        period: { days, since },
      },
    });
  } catch (err) {
    next(err);
  }
};
