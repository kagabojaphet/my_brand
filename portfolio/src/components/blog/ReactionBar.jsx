// src/components/blog/ReactionBar.jsx
// Like / Dislike / stats row + ShareBar.
// Props:
//   blog          — blog object (needs .views)
//   reactions     — { liked, disliked, likes, dislikes, shares }
//   commentCount  — number of approved comments
//   onLike        — async callback
//   onDislike     — async callback
//   onShare       — async callback (passed to ShareBar)

import { Eye, ThumbsUp, ThumbsDown, Share2, MessageCircle } from "lucide-react";
import ShareBar from "./ShareBar";

export default function ReactionBar({ blog, reactions, commentCount, onLike, onDislike, onShare }) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-5 border-y border-neutral-200 dark:border-neutral-800">

      {/* Like */}
      <button
        onClick={onLike}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-500 transition-all ${
          reactions.liked
            ? "bg-accent text-white border-accent"
            : "border-neutral-200 dark:border-neutral-800 hover:border-accent hover:text-accent"
        }`}
      >
        <ThumbsUp size={14} />
        <span>{reactions.likes ?? 0}</span>
      </button>

      {/* Dislike */}
      <button
        onClick={onDislike}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-500 transition-all ${
          reactions.disliked
            ? "bg-neutral-700 text-white border-neutral-700"
            : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-500 hover:text-neutral-500"
        }`}
      >
        <ThumbsDown size={14} />
        <span>{reactions.dislikes ?? 0}</span>
      </button>

      {/* Stats */}
      <span className="flex items-center gap-1.5 text-xs text-neutral-400">
        <Eye size={13} /> {blog?.views ?? 0} views
      </span>
      <span className="flex items-center gap-1.5 text-xs text-neutral-400">
        <Share2 size={13} /> {reactions.shares ?? 0} shares
      </span>
      <span className="flex items-center gap-1.5 text-xs text-neutral-400">
        <MessageCircle size={13} /> {commentCount} comments
      </span>

      {/* Share buttons pushed to the right */}
      <div className="ml-auto">
        <ShareBar blog={blog} onShare={onShare} />
      </div>
    </div>
  );
}