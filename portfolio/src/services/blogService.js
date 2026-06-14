// src/services/blogService.js
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
});

export const blogService = {

  // ── Public ───────────────────────────────────────────────────────────────

  /** GET /api/blogs?category=&search=&page=&limit= */
  async getBlogs(params = "") {
    const res = await fetch(`${BASE}/blogs${params}`);
    return res.json();
  },

  /** GET /api/blogs/:slug */
  async getBlog(slug) {
    const res = await fetch(`${BASE}/blogs/${slug}`);
    return res.json();
  },

  /** GET /api/blogs/:id/reactions */
  async getReactions(id) {
    const res = await fetch(`${BASE}/blogs/${id}/reactions`);
    return res.json();
  },

  /** GET /api/blogs/:id/comments */
  async getComments(id) {
    const res = await fetch(`${BASE}/blogs/${id}/comments`);
    return res.json();
  },

  /** POST /api/blogs/:id/comments */
  async addComment(id, payload) {
    const res = await fetch(`${BASE}/blogs/${id}/comments`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
    return res.json();
  },

  /** POST /api/blogs/:id/comments/:commentId/reply */
  async replyToComment(id, commentId, payload) {
    const res = await fetch(`${BASE}/blogs/${id}/comments/${commentId}/reply`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
    return res.json();
  },

  /** POST /api/blogs/:id/like */
  async likeBlog(id) {
    const res = await fetch(`${BASE}/blogs/${id}/like`, { method: "POST" });
    return res.json();
  },

  /** POST /api/blogs/:id/dislike */
  async dislikeBlog(id) {
    const res = await fetch(`${BASE}/blogs/${id}/dislike`, { method: "POST" });
    return res.json();
  },

  /** POST /api/blogs/:id/share */
  async shareBlog(id) {
    const res = await fetch(`${BASE}/blogs/${id}/share`, { method: "POST" });
    return res.json();
  },

  // ── Admin ─────────────────────────────────────────────────────────────────

  /** GET /api/blogs/admin/all */
  async adminGetBlogs(queryString = "") {
    const res = await fetch(`${BASE}/blogs/admin/all${queryString}`, {
      headers: authHeader(),
    });
    return res.json();
  },

  /** GET /api/blogs/admin/comments/pending */
  async getPendingComments() {
    const res = await fetch(`${BASE}/blogs/admin/comments/pending`, {
      headers: authHeader(),
    });
    return res.json();
  },

  /** POST /api/blogs/admin/create  (multipart FormData) */
  async createBlog(formData) {
    const res = await fetch(`${BASE}/blogs/admin/create`, {
      method:  "POST",
      headers: authHeader(),   // ← no Content-Type: browser sets boundary automatically
      body:    formData,
    });
    return res.json();
  },

  /** PUT /api/blogs/admin/:id  (multipart FormData) */
  async updateBlog(id, formData) {
    const res = await fetch(`${BASE}/blogs/admin/${id}`, {
      method:  "PUT",
      headers: authHeader(),
      body:    formData,
    });
    return res.json();
  },

  /** DELETE /api/blogs/admin/:id */
  async deleteBlog(id) {
    const res = await fetch(`${BASE}/blogs/admin/${id}`, {
      method:  "DELETE",
      headers: authHeader(),
    });
    return res.json();
  },

  /** PATCH /api/blogs/admin/:id/comments/:commentId/approve */
  async approveComment(blogId, commentId) {
    const res = await fetch(
      `${BASE}/blogs/admin/${blogId}/comments/${commentId}/approve`,
      { method: "PATCH", headers: authHeader() }
    );
    return res.json();
  },

  /** DELETE /api/blogs/admin/:id/comments/:commentId */
  async deleteComment(blogId, commentId) {
    const res = await fetch(
      `${BASE}/blogs/admin/${blogId}/comments/${commentId}`,
      { method: "DELETE", headers: authHeader() }
    );
    return res.json();
  },
};
