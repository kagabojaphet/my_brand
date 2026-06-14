// src/components/blog/CommentItem.jsx
// Renders one approved comment with its reply list and inline reply form.
// Props:
//   comment      — comment object from backend
//   blogId       — blog._id (needed for replyToComment API call)
//   onReplyAdded — callback to refresh comment list after a reply is posted

import { useState } from "react";
import { CornerDownRight, ChevronDown, ChevronUp, Send, Loader2 } from "lucide-react";
import { blogService } from "../../services/blogService";

export default function CommentItem({ comment, blogId, onReplyAdded }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies,   setShowReplies]   = useState(false);
  const [name,    setName]    = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState("");

  const avatar = comment.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.name)}&background=FF4D00&color=fff&size=40&rounded=true`;

  const submitReply = async (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setLoading(true);
    setMsg("");
    try {
      await blogService.replyToComment(blogId, comment._id, { name, content });
      setMsg("✓ Reply added!");
      setName("");
      setContent("");
      setShowReplyForm(false);
      setShowReplies(true);
      onReplyAdded?.();
    } catch (err) {
      setMsg(err.message || "Failed to add reply.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <img
        src={avatar}
        alt={comment.name}
        className="w-9 h-9 rounded-full flex-shrink-0 object-cover ring-2 ring-white dark:ring-neutral-900"
      />

      <div className="flex-1 min-w-0">
        {/* Comment bubble */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl rounded-tl-sm px-4 py-3">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-600 text-sm">{comment.name}</span>
            <span className="text-xs text-neutral-400">
              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              })}
            </span>
          </div>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {comment.content}
          </p>
        </div>

        {/* Action row */}
        <div className="flex items-center gap-4 mt-1.5 ml-1">
          <button
            onClick={() => setShowReplyForm((v) => !v)}
            className="text-xs text-neutral-400 hover:text-accent transition-colors flex items-center gap-1 font-500"
          >
            <CornerDownRight size={11} /> Reply
          </button>

          {comment.replies?.length > 0 && (
            <button
              onClick={() => setShowReplies((v) => !v)}
              className="text-xs text-neutral-400 hover:text-accent transition-colors flex items-center gap-1"
            >
              {showReplies ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>

        {/* Replies list */}
        {showReplies && comment.replies?.length > 0 && (
          <div className="mt-3 space-y-2 pl-3 border-l-2 border-neutral-100 dark:border-neutral-800">
            {comment.replies.map((r, i) => {
              const rAvatar = r.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=555&color=fff&size=32&rounded=true`;
              return (
                <div key={r._id || i} className="flex gap-2">
                  <img
                    src={rAvatar}
                    alt={r.name}
                    className="w-7 h-7 rounded-full flex-shrink-0 object-cover"
                  />
                  <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-xl rounded-tl-sm px-3 py-2 flex-1">
                    <span className="font-600 text-xs mr-2">{r.name}</span>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {r.content}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reply form */}
        {showReplyForm && (
          <form onSubmit={submitReply} className="mt-3 pl-3 flex flex-col gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-accent transition-colors"
            />
            <div className="flex gap-2">
              <input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a reply…"
                className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-accent text-white rounded-xl text-sm font-500 hover:bg-accent/90 disabled:opacity-50 transition-colors flex-shrink-0"
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
              </button>
            </div>
            {msg && (
              <p className={`text-xs ${msg.startsWith("✓") ? "text-green-500" : "text-red-500"}`}>
                {msg}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}