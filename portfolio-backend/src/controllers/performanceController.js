const Performance = require("../models/Performance");

const VALID_DEVICES     = ["desktop", "mobile", "tablet", "unknown"];
const VALID_CONNECTIONS = ["slow-2g", "2g", "3g", "4g", "wifi", "unknown"];

// ── POST /api/performance  (public — Web Vitals from frontend) ─────────────
exports.trackPerformance = async (req, res, next) => {
  try {
    const { page, lcp, fid, cls, ttfb, fcp, loadTime, device, connection } = req.body;

    if (!page || typeof page !== "string" || !page.trim())
      return res.status(400).json({ success: false, message: "page is required." });

    // Sanitise enum fields so they don't fail model validation
    const safeDevice     = VALID_DEVICES.includes(device)         ? device     : "unknown";
    const safeConnection = VALID_CONNECTIONS.includes(connection)  ? connection : "unknown";

    // Only store valid positive numbers — null is fine for missing metrics
    const toMetric = (v) => (v !== undefined && v !== null && !isNaN(+v) && +v >= 0) ? +v : null;

    await Performance.create({
      page:       page.trim(),
      lcp:        toMetric(lcp),
      fid:        toMetric(fid),
      cls:        toMetric(cls),
      ttfb:       toMetric(ttfb),
      fcp:        toMetric(fcp),
      loadTime:   toMetric(loadTime),
      device:     safeDevice,
      connection: safeConnection,
    });

    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/performance/admin/all  (admin) ────────────────────────────────
exports.getPerformance = async (req, res, next) => {
  try {
    const days  = Math.min(Math.max(Number(req.query.days) || 30, 1), 365);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // FIX: Use `createdAt` (Mongoose timestamps), NOT `timestamp`
    const matchStage = { $match: { createdAt: { $gte: since } } };

    const [averages, byPage, byDay] = await Promise.all([

      // Overall averages (null values excluded from $avg automatically)
      Performance.aggregate([
        matchStage,
        {
          $group: {
            _id:         null,
            avgLcp:      { $avg: "$lcp"      },
            avgFid:      { $avg: "$fid"      },
            avgCls:      { $avg: "$cls"      },
            avgTtfb:     { $avg: "$ttfb"     },
            avgFcp:      { $avg: "$fcp"      },
            avgLoadTime: { $avg: "$loadTime" },
            samples:     { $sum: 1           },
          },
        },
        { $project: { _id: 0 } },
      ]),

      // Per-page averages (sorted worst load time first)
      Performance.aggregate([
        matchStage,
        {
          $group: {
            _id:         "$page",
            avgLcp:      { $avg: "$lcp"      },
            avgFid:      { $avg: "$fid"      },
            avgCls:      { $avg: "$cls"      },
            avgLoadTime: { $avg: "$loadTime" },
            samples:     { $sum: 1           },
          },
        },
        { $sort: { avgLoadTime: -1 } },
        { $project: { _id: 0, page: "$_id", avgLcp: 1, avgFid: 1, avgCls: 1, avgLoadTime: 1, samples: 1 } },
      ]),

      // Daily averages (for trend chart)
      Performance.aggregate([
        matchStage,
        {
          $group: {
            _id:         { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            avgLoadTime: { $avg: "$loadTime" },
            avgLcp:      { $avg: "$lcp"      },
            samples:     { $sum: 1           },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: "$_id", avgLoadTime: 1, avgLcp: 1, samples: 1 } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        averages: averages[0] || {},
        byPage,
        byDay,
        period: { days, since },
      },
    });
  } catch (err) {
    next(err);
  }
};
