const Blog      = require("../models/Blog");
const Project   = require("../models/Project");
const Contact   = require("../models/Contact");
const Visitor   = require("../models/Visitor");
const PageView  = require("../models/PageView");
const Education = require("../models/Education");

// ── GET /api/stats/dashboard  (admin) ─────────────────────────────────────
exports.getDashboardStats = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // FIX: Visitor and PageView now use Mongoose `timestamps: true`,
    //      so the date field is `createdAt`, NOT `timestamp`.
    const [
      totalBlogs,
      publishedBlogs,
      totalProjects,
      totalMessages,
      unreadMessages,
      totalVisitors,
      recentVisitors,
      totalPageViews,
      totalEducation,
      topBlogs,
      pendingCommentAgg,
      likesAgg,
      viewsAgg,
      sharesAgg,
    ] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ published: true }),

      Project.countDocuments(),

      Contact.countDocuments(),
      Contact.countDocuments({ status: "unread" }),

      Visitor.countDocuments(),
      // FIX: createdAt, not timestamp
      Visitor.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),

      // FIX: createdAt, not timestamp
      PageView.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),

      Education.countDocuments(),

      Blog.find({ published: true })
        .select("title slug views likes shares createdAt")
        .sort({ views: -1 })
        .limit(5)
        .lean(),

      // Count all pending (unapproved) comments across all blogs
      Blog.aggregate([
        {
          $project: {
            pendingCount: {
              $size: {
                $filter: {
                  input: "$comments",
                  as:    "c",
                  cond:  { $eq: ["$$c.approved", false] },
                },
              },
            },
          },
        },
        { $group: { _id: null, total: { $sum: "$pendingCount" } } },
      ]),

      Blog.aggregate([{ $group: { _id: null, total: { $sum: "$likes"  } } }]),
      Blog.aggregate([{ $group: { _id: null, total: { $sum: "$views"  } } }]),
      Blog.aggregate([{ $group: { _id: null, total: { $sum: "$shares" } } }]),
    ]);

    res.json({
      success: true,
      data: {
        blogs: {
          total:     totalBlogs,
          published: publishedBlogs,
          drafts:    totalBlogs - publishedBlogs,
        },
        projects: { total: totalProjects },
        messages: { total: totalMessages, unread: unreadMessages },
        visitors: { total: totalVisitors, last30Days: recentVisitors },
        pageViews:{ last30Days: totalPageViews },
        education:{ total: totalEducation },
        engagement: {
          totalLikes:      likesAgg[0]?.total          || 0,
          totalViews:      viewsAgg[0]?.total          || 0,
          totalShares:     sharesAgg[0]?.total         || 0,
          pendingComments: pendingCommentAgg[0]?.total || 0,
        },
        topBlogs,
      },
    });
  } catch (err) {
    next(err);
  }
};
