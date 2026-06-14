// src/admin/components/blog/BlogRow.jsx
import { useState } from "react";
import {
  Pencil, Trash2, Eye, EyeOff, Star, StarOff,
  Loader2, CheckCircle, XCircle, ChevronUp, MessageCircle,
} from "lucide-react";
import { BASE, TOKEN, blogApi } from "./blogApi.jsx";

export default function BlogRow({ blog, onEdit, onRefresh }) {
  const [deleting, setDeleting] = useState(false);
  const [showCmts, setShowCmts] = useState(false);
  const [comments, setComments] = useState([]);
  const [cmtLoad,  setCmtLoad]  = useState(false);

  // ── Quick-toggle published / featured ────────────────────────────────────
  const quickUpdate = async (fields) => {
    try {
      const fd = new FormData();
      Object.entries(fields).forEach(([k, v]) => fd.append(k, String(v)));
      const res = await fetch(`${BASE}/blogs/admin/${blog._id}`, {
        method:  "PUT",
        headers: { Authorization: `Bearer ${TOKEN()}` },
        body:    fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Update failed");
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!confirm(`Delete "${blog.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await blogApi(`/blogs/admin/${blog._id}`, { method: "DELETE" });
      onRefresh();
    } catch (err) {
      alert(err.message);
      setDeleting(false);
    }
  };

  // ── Load comments ────────────────────────────────────────────────────────
  // FIX: use GET /blogs/:id/comments (public endpoint, returns only approved)
  //      for pending we use the admin endpoint directly
  const loadComments = async () => {
    if (showCmts) { setShowCmts(false); return; }
    setCmtLoad(true);
    try {
      // Fetch ALL comments for this blog (admin view — includes unapproved)
      // We re-use the pending endpoint filtered to this blog
      const data = await blogApi(`/blogs/admin/all?search=${encodeURIComponent(blog.title)}&limit=1`);
      // Find this exact blog in results to get its comments array
      const found = (data.data || []).find((b) => b._id === blog._id);
      setComments(found?.comments || []);
      setShowCmts(true);
    } catch {
      // Fallback: fetch public approved comments
      try {
        const data = await fetch(`${BASE}/blogs/${blog._id}/comments`).then(r => r.json());
        setComments(data.data || []);
        setShowCmts(true);
      } catch {}
    } finally {
      setCmtLoad(false);
    }
  };

  // ── Comment moderation ───────────────────────────────────────────────────
  const approveComment = async (commentId) => {
    try {
      await blogApi(`/blogs/admin/${blog._id}/comments/${commentId}/approve`, { method: "PATCH" });
      loadComments();
      onRefresh();
    } catch (err) { alert(err.message); }
  };

  const deleteComment = async (commentId) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await blogApi(`/blogs/admin/${blog._id}/comments/${commentId}`, { method: "DELETE" });
      // Update local state immediately
      setComments(prev => prev.filter(c => c._id !== commentId));
      onRefresh();
    } catch (err) { alert(err.message); }
  };

  const pendingCount = blog.comments?.filter((c) => !c.approved).length ?? 0;

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">

      {/* Main row */}
      <div className="flex items-center gap-4 p-4">

        {/* Thumbnail */}
        {blog.coverImage?.url ? (
          <img src={blog.coverImage.url} alt={blog.title}
            className="w-14 h-14 rounded-xl object-cover shrink-0" />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
            <span className="font-display font-700 text-accent text-xl">
              {blog.title?.[0]?.toUpperCase()}
            </span>
          </div>
        )}

        {/* Meta */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <h3 className="font-600 text-sm truncate">{blog.title}</h3>
            <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
              {blog.category}
            </span>
            {blog.featured && (
              <span className="text-xs bg-yellow-400/15 text-yellow-500 dark:text-yellow-400 px-2 py-0.5 rounded-full">
                ★ Featured
              </span>
            )}
            {blog.published
              ? <span className="text-xs bg-green-400/15 text-green-500 px-2 py-0.5 rounded-full">● Live</span>
              : <span className="text-xs bg-neutral-200 dark:bg-neutral-700 text-neutral-500 px-2 py-0.5 rounded-full">Draft</span>
            }
          </div>
          <p className="text-xs text-neutral-400 truncate">{blog.excerpt}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400">
            <span>👁 {blog.views ?? 0}</span>
            <span>👍 {blog.likes ?? 0}</span>
            <span>🔗 {blog.shares ?? 0}</span>
            <span>{blog.readTime}</span>
            {pendingCount > 0 && (
              <span className="text-orange-400 font-500">💬 {pendingCount} pending</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => quickUpdate({ featured: !blog.featured })}
            title={blog.featured ? "Unfeature" : "Feature"}
            className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-yellow-500 transition-colors">
            {blog.featured
              ? <Star size={15} fill="currentColor" className="text-yellow-500" />
              : <StarOff size={15} />}
          </button>

          <button onClick={() => quickUpdate({ published: !blog.published })}
            title={blog.published ? "Unpublish" : "Publish"}
            className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-green-500 transition-colors">
            {blog.published
              ? <Eye size={15} className="text-green-500" />
              : <EyeOff size={15} />}
          </button>

          <button onClick={loadComments} title="Comments"
            className={`p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
              showCmts ? "text-accent" : "text-neutral-400 hover:text-accent"
            }`}>
            {cmtLoad
              ? <Loader2 size={15} className="animate-spin" />
              : showCmts ? <ChevronUp size={15} /> : <MessageCircle size={15} />}
          </button>

          <button onClick={() => onEdit(blog)}
            className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-accent transition-colors">
            <Pencil size={15} />
          </button>

          <button onClick={handleDelete} disabled={deleting}
            className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-50">
            {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          </button>
        </div>
      </div>

      {/* Inline comments panel */}
      {showCmts && (
        <div className="border-t border-neutral-100 dark:border-neutral-800 p-4 space-y-3 bg-neutral-50 dark:bg-neutral-800/30">
          <p className="text-xs font-500 text-neutral-400 uppercase tracking-wider">
            Comments ({comments.length})
          </p>

          {comments.length === 0 ? (
            <p className="text-xs text-neutral-400 py-2">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c._id}
                className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">

                {/* Avatar */}
                {c.avatar ? (
                  <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-700 shrink-0">
                    {c.name?.[0]?.toUpperCase()}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <span className="text-xs font-600">{c.name}</span>
                    <span className="text-xs text-neutral-400">{c.email}</span>
                    {c.approved
                      ? <span className="text-xs text-green-500 font-500">✓ Approved</span>
                      : <span className="text-xs text-orange-400 font-500">⏳ Pending</span>}
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {c.content}
                  </p>
                  {c.replies?.length > 0 && (
                    <p className="text-xs text-neutral-400 mt-1">
                      {c.replies.length} {c.replies.length === 1 ? "reply" : "replies"}
                    </p>
                  )}
                </div>

                {/* Moderation */}
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => approveComment(c._id)}
                    title={c.approved ? "Hide comment" : "Approve comment"}
                    className={`p-1.5 rounded-lg transition-colors ${
                      c.approved
                        ? "text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        : "text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                    }`}>
                    <CheckCircle size={14} />
                  </button>
                  <button onClick={() => deleteComment(c._id)} title="Delete comment"
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <XCircle size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}