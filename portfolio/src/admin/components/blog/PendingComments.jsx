// src/admin/components/blog/PendingComments.jsx
import { useState, useEffect } from "react";
import { X, Loader2, CheckCircle, XCircle, MessageCircle } from "lucide-react";
import { blogApi } from "./blogApi.jsx";

export default function PendingComments({ onClose }) {
  const [comments, setComments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    blogApi("/blogs/admin/comments/pending")
      .then((d) => setComments(d.data || []))
      .catch((err) => setError(err.message || "Failed to load."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const approve = async (blogId, commentId) => {
    try {
      await blogApi(`/blogs/admin/${blogId}/comments/${commentId}/approve`, { method: "PATCH" });
      load();
    } catch (err) { alert(err.message); }
  };

  const remove = async (blogId, commentId) => {
    if (!confirm("Delete this comment permanently?")) return;
    try {
      await blogApi(`/blogs/admin/${blogId}/comments/${commentId}`, { method: "DELETE" });
      load();
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-xl max-h-[80vh] overflow-y-auto border border-neutral-200 dark:border-neutral-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <h2 className="font-display text-lg font-700 flex items-center gap-2">
            <MessageCircle size={18} className="text-accent" />
            Pending Comments
            {comments.length > 0 && (
              <span className="text-sm font-400 text-neutral-400">({comments.length})</span>
            )}
          </h2>
          <button onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 size={24} className="animate-spin text-accent" />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-400">
              <p className="text-sm">⚠ {error}</p>
              <button onClick={load} className="mt-3 text-xs underline hover:no-underline">Retry</button>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-10 text-neutral-400">
              <CheckCircle size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm font-500">All clear!</p>
              <p className="text-xs mt-1">No pending comments 🎉</p>
            </div>
          ) : (
            comments.map((c) => (
              <div key={c._id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="font-600 text-sm">
                      {c.name}{" "}
                      <span className="text-xs text-neutral-400 font-400">({c.email})</span>
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      on: <span className="text-accent font-500">{c.blogTitle}</span>
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {new Date(c.createdAt).toLocaleDateString("en-US", {
                        month:"short", day:"numeric", year:"numeric"
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => approve(c.blogId, c._id)} title="Approve"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-500 text-green-600 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 transition-colors">
                      <CheckCircle size={13} /> Approve
                    </button>
                    <button onClick={() => remove(c.blogId, c._id)} title="Delete"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-500 text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 transition-colors">
                      <XCircle size={13} /> Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed bg-white dark:bg-neutral-900 rounded-lg p-3">
                  {c.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}