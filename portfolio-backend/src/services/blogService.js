// src/services/blogService.js
// Pure fetch-based service (no axios dependency).
// Used by React components to talk to the backend API.

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Always fresh — picks up token changes between calls
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
});

// ── Generic helpers ────────────────────────────────────────────────────────

/** Throw a structured error when the server responds with !ok */
async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data   = data;
    throw err;
  }
  return data;
}

/** Build a query string from a plain-object params map */
function qs(params = {}) {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  return entries.length ? "?" + new URLSearchParams(entries).toString() : "";
}

// ── Public API ─────────────────────────────────────────────────────────────

export const blogService = {

  // ── List / detail ──────────────────────────────────────────────────────

  /**
   * @param {{ category?: string, search?: string, page?: number,
   *            limit?: number, featured?: boolean }} params
   */
  async getBlogs(params = {}) {
    const res = await fetch(`${BASE}/blogs${qs(params)}`);
    return handleResponse(res);
  },

  async getBlog(slug) {
    if (!slug) throw new Error("slug is required");
    const res = await fetch(`${BASE}/blogs/${encodeURIComponent(slug)}`);
    return handleResponse(res);
  },

  // ── Reactions ──────────────────────────────────────────────────────────

  async getReactions(id) {
    const res = await fetch(`${BASE}/blogs/${id}/reactions`);
    return handleResponse(res);
  },

  async likeBlog(id) {
    const res = await fetch(`${BASE}/blogs/${id}/like`, { method: "POST" });
    return handleResponse(res);
  },

  async dislikeBlog(id) {
    const res = await fetch(`${BASE}/blogs/${id}/dislike`, { method: "POST" });
    return handleResponse(res);
  },

  async shareBlog(id) {
    const res = await fetch(`${BASE}/blogs/${id}/share`, { method: "POST" });
    return handleResponse(res);
  },

  // ── Comments ───────────────────────────────────────────────────────────

  async getComments(id) {
    const res = await fetch(`${BASE}/blogs/${id}/comments`);
    return handleResponse(res);
  },

  /**
   * @param {string} id  — blog _id
   * @param {{ name: string, email: string, content: string }} payload
   */
  async addComment(id, payload) {
    const res = await fetch(`${BASE}/blogs/${id}/comments`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  /**
   * @param {string} id         — blog _id
   * @param {string} commentId  — comment _id
   * @param {{ name: string, content: string }} payload
   */
  async replyToComment(id, commentId, payload) {
    const res = await fetch(`${BASE}/blogs/${id}/comments/${commentId}/reply`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  // ── Admin ──────────────────────────────────────────────────────────────

  /** @param {{ page?: number, limit?: number, search?: string, published?: boolean }} params */
  async adminBlogs(params = {}) {
    const res = await fetch(`${BASE}/blogs/admin/all${qs(params)}`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  /** @param {FormData} formData */
  async createBlog(formData) {
    const res = await fetch(`${BASE}/blogs/admin/create`, {
      method:  "POST",
      headers: authHeaders(), // do NOT set Content-Type — browser sets multipart boundary
      body:    formData,
    });
    return handleResponse(res);
  },

  /** @param {string} id  @param {FormData} formData */
  async updateBlog(id, formData) {
    const res = await fetch(`${BASE}/blogs/admin/${id}`, {
      method:  "PUT",
      headers: authHeaders(),
      body:    formData,
    });
    return handleResponse(res);
  },

  async deleteBlog(id) {
    const res = await fetch(`${BASE}/blogs/admin/${id}`, {
      method:  "DELETE",
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  // ── Admin comment moderation ───────────────────────────────────────────

  async getPendingComments() {
    const res = await fetch(`${BASE}/blogs/admin/comments/pending`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  async approveComment(blogId, commentId) {
    const res = await fetch(
      `${BASE}/blogs/admin/${blogId}/comments/${commentId}/approve`,
      { method: "PATCH", headers: authHeaders() }
    );
    return handleResponse(res);
  },

  async deleteComment(blogId, commentId) {
    const res = await fetch(
      `${BASE}/blogs/admin/${blogId}/comments/${commentId}`,
      { method: "DELETE", headers: authHeaders() }
    );
    return handleResponse(res);
  },
};
