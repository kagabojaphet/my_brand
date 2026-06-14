const express              = require("express");
const router               = express.Router();
const blog                 = require("../controllers/blogController");
const { protect, adminOnly } = require("../middleware/auth");
const { uploadBlog }       = require("../config/cloudinary");

// Admin
router.get   ("/admin/all",                               protect, adminOnly, blog.adminGetBlogs);
router.get   ("/admin/comments/pending",                  protect, adminOnly, blog.getPendingComments);
router.post  ("/admin/create",                            protect, adminOnly, uploadBlog.single("coverImage"), blog.createBlog);
router.put   ("/admin/:id",                               protect, adminOnly, uploadBlog.single("coverImage"), blog.updateBlog);
router.delete("/admin/:id",                               protect, adminOnly, blog.deleteBlog);
router.patch ("/admin/:id/comments/:commentId/approve",   protect, adminOnly, blog.approveComment);
router.delete("/admin/:id/comments/:commentId",           protect, adminOnly, blog.deleteComment);

// Reactions & comments — by _id (BEFORE /:slug)
router.get ("/:id/reactions",                 blog.getReactions);
router.post("/:id/like",                      blog.likeBlog);
router.post("/:id/dislike",                   blog.dislikeBlog);
router.post("/:id/share",                     blog.shareBlog);
router.get ("/:id/comments",                  blog.getComments);
router.post("/:id/comments",                  blog.addComment);
router.post("/:id/comments/:commentId/reply", blog.replyToComment);

// Public — list + single (/:slug MUST be last)
router.get("/",       blog.getBlogs);
router.get("/:slug",  blog.getBlog);

module.exports = router;