// src/components/blog/CommentForm.jsx
// New comment submission form.
// Props:
//   blogId      — blog._id
//   onSubmitted — callback fired after a successful submission

import { useState } from "react";
import { Send, Loader2, MessageCircle } from "lucide-react";
import { blogService } from "../../services/blogService";

export default function CommentForm({ blogId, onSubmitted }) {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error,   setError]   = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!name.trim() || !email.trim() || !content.trim()) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await blogService.addComment(blogId, {
        name:    name.trim(),
        email:   email.trim(),
        content: content.trim(),
      });
      setSuccess(res.message || "Comment submitted for approval. Thank you!");
      setName("");
      setEmail("");
      setContent("");
      onSubmitted?.();
    } catch (err) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="font-display text-xl font-700 mb-6 flex items-center gap-2">
        <MessageCircle size={20} className="text-accent" />
        Leave a comment
      </h3>

      {success ? (
        <div className="p-5 rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm">
          <p className="font-600 mb-1">✓ Comment submitted!</p>
          <p className="text-green-600 dark:text-green-500 text-xs">{success}</p>
          <button
            onClick={() => setSuccess("")}
            className="mt-3 text-xs underline hover:no-underline"
          >
            Write another comment
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {/* Name + Email row */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-500 text-neutral-500 dark:text-neutral-400 mb-1.5">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-500 text-neutral-500 dark:text-neutral-400 mb-1.5">
                Email <span className="text-red-400">*</span>
                <span className="text-neutral-400 font-400 ml-1">(not published)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-500 text-neutral-500 dark:text-neutral-400 mb-1.5">
              Comment <span className="text-red-400">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Share your thoughts…"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-accent transition-colors resize-none"
            />
            <p className="text-xs text-neutral-400 mt-1">
              Your comment will appear after approval.
            </p>
          </div>

          {error && <p className="text-sm text-red-500">⚠ {error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-full text-sm font-500 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {loading ? "Submitting…" : "Post comment"}
          </button>
        </form>
      )}
    </div>
  );
}