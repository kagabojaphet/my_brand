// src/pages/BlogDetail.jsx
// Main page — only handles data fetching and state.
// All UI is delegated to the components in src/components/blog/.

import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Clock, Eye, MessageCircle, Calendar, Tag } from "lucide-react";

import PageWrapper   from "../components/PageWrapper";
import { blogService } from "../services/blogService";

// ── Split components ───────────────────────────────────────────────────────
import BlogSkeleton  from "../components/blog/BlogSkeleton";
import ReactionBar   from "../components/blog/ReactionBar";
import CommentItem   from "../components/blog/CommentItem";
import CommentForm   from "../components/blog/CommentForm";

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blog,      setBlog]      = useState(null);
  const [comments,  setComments]  = useState([]);
  const [reactions, setReactions] = useState({
    liked: false, disliked: false, likes: 0, dislikes: 0, shares: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // ── 1. Fetch blog post ─────────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    blogService.getBlog(slug)
      .then((res) => {
        if (!res.success || !res.data) { setError("Post not found."); return; }
        setBlog(res.data);
        // Seed counts from post immediately so UI doesn't flash zeros
        setReactions((prev) => ({
          ...prev,
          likes:    res.data.likes    ?? 0,
          dislikes: res.data.dislikes ?? 0,
          shares:   res.data.shares   ?? 0,
        }));
      })
      .catch(() => setError("Post not found or server error."))
      .finally(() => setLoading(false));
  }, [slug]);

  // ── 2. Fetch per-IP reaction state once blog._id is known ─────────────
  useEffect(() => {
    if (!blog?._id) return;
    blogService.getReactions(blog._id)
      .then((res) => { if (res.success) setReactions(res); })
      .catch(() => {});
  }, [blog?._id]);

  // ── 3. Fetch approved comments ─────────────────────────────────────────
  const fetchComments = useCallback(() => {
    if (!blog?._id) return;
    blogService.getComments(blog._id)
      .then((res) => setComments(res.data || []))
      .catch(() => {});
  }, [blog?._id]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  // ── Reaction handlers ──────────────────────────────────────────────────
  const handleLike = async () => {
    if (!blog?._id) return;
    try {
      const res = await blogService.likeBlog(blog._id);
      setReactions((prev) => ({
        ...prev,
        liked:    res.liked,
        disliked: res.liked ? false : prev.disliked,
        likes:    res.likes,
        dislikes: res.dislikes,
      }));
    } catch (_) {}
  };

  const handleDislike = async () => {
    if (!blog?._id) return;
    try {
      const res = await blogService.dislikeBlog(blog._id);
      setReactions((prev) => ({
        ...prev,
        disliked: res.disliked,
        liked:    res.disliked ? false : prev.liked,
        likes:    res.likes,
        dislikes: res.dislikes,
      }));
    } catch (_) {}
  };

  const handleShare = async () => {
    if (!blog?._id) return;
    try {
      const res = await blogService.shareBlog(blog._id);
      setReactions((prev) => ({ ...prev, shares: res.shares }));
    } catch (_) {}
  };

  // ── Loading ────────────────────────────────────────────────────────────
  if (loading) return <PageWrapper><BlogSkeleton /></PageWrapper>;

  // ── Not found / error ──────────────────────────────────────────────────
  if (error || !blog) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-32">
          <p className="text-7xl mb-6">📄</p>
          <h1 className="font-display text-3xl font-700 mb-3">Post not found</h1>
          <p className="text-neutral-400 text-sm mb-8 max-w-sm">
            {error || "This article doesn't exist or may have been removed."}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-sm hover:border-accent hover:text-accent transition-colors"
            >
              <ArrowLeft size={14} /> Go back
            </button>
            <Link to="/blog" className="px-5 py-2.5 bg-accent text-white rounded-full text-sm font-500 hover:bg-accent/90 transition-colors">
              Browse blog
            </Link>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // ── Full post ──────────────────────────────────────────────────────────
  return (
    <PageWrapper>
      <Helmet>
        <title>{blog.title} — Japhet</title>
        <meta name="description"        content={blog.metaDescription || blog.excerpt} />
        <meta property="og:title"       content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:type"        content="article" />
        {blog.coverImage?.url && <meta property="og:image" content={blog.coverImage.url} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <article className="pt-28 pb-24 section-pad">
        <div className="max-w-3xl mx-auto">

          {/* ── Back button ── */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-neutral-500 hover:text-accent transition-colors group"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to blog
            </button>
          </motion.div>

          {/* ── Header ── */}
          <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

            {/* Category + featured badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full font-500">
                {blog.category}
              </span>
              {blog.featured && (
                <span className="text-xs bg-accent text-white px-3 py-1 rounded-full font-500">
                  Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-700 leading-tight mb-4">
              {blog.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
              {blog.excerpt}
            </p>

            {/* Author + meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-400 pb-6 border-b border-neutral-100 dark:border-neutral-800">
              <span className="flex items-center gap-2">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(blog.author || "Japhet")}&background=FF4D00&color=fff&size=28&rounded=true`}
                  alt={blog.author}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-neutral-600 dark:text-neutral-300 font-500">
                  {blog.author || "Japhet"}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "long", day: "numeric", year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5"><Clock size={13} /> {blog.readTime}</span>
              <span className="flex items-center gap-1.5"><Eye   size={13} /> {blog.views ?? 0} views</span>
              <span className="flex items-center gap-1.5">
                <MessageCircle size={13} /> {comments.length} comments
              </span>
            </div>
          </motion.header>

          {/* ── Cover image ── */}
          {blog.coverImage?.url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="my-8 rounded-2xl overflow-hidden aspect-video shadow-lg"
            >
              <img src={blog.coverImage.url} alt={blog.title} className="w-full h-full object-cover" />
            </motion.div>
          )}

          {/* ── Content (rendered HTML) ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="
              prose prose-neutral dark:prose-invert prose-lg max-w-none mb-10
              prose-headings:font-display prose-headings:font-700 prose-headings:tracking-tight
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline
              prose-code:text-accent prose-code:bg-accent/10 prose-code:px-1.5 prose-code:py-0.5
              prose-code:rounded prose-code:text-sm prose-code:font-normal
              prose-pre:bg-neutral-950 prose-pre:rounded-2xl prose-pre:border prose-pre:border-neutral-800
              prose-img:rounded-xl prose-img:w-full prose-img:shadow-md
              prose-blockquote:border-l-accent prose-blockquote:bg-accent/5
              prose-blockquote:rounded-r-xl prose-blockquote:py-1
              prose-hr:border-neutral-200 dark:prose-hr:border-neutral-800"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* ── Tags ── */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <Tag size={13} className="text-neutral-400" />
              {blog.tags.map((tag) => (
                <span key={tag}
                  className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-3 py-1 rounded-full hover:bg-accent/10 hover:text-accent transition-colors cursor-default">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* ── Reactions ── */}
          <ReactionBar
            blog={blog}
            reactions={reactions}
            commentCount={comments.length}
            onLike={handleLike}
            onDislike={handleDislike}
            onShare={handleShare}
          />

          {/* ── Comments section ── */}
          <section className="mt-14">
            <h2 className="font-display text-2xl font-700 mb-8 flex items-center gap-2">
              <MessageCircle size={22} className="text-accent" />
              Comments
              <span className="text-neutral-400 dark:text-neutral-500 font-400 text-base">
                ({comments.length})
              </span>
            </h2>

            {comments.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 text-neutral-400 mb-10">
                <MessageCircle size={32} className="mx-auto mb-3 opacity-25" />
                <p className="font-500 text-sm">No comments yet</p>
                <p className="text-xs mt-1">Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-6 mb-12">
                {comments.map((c) => (
                  <CommentItem
                    key={c._id}
                    comment={c}
                    blogId={blog._id}
                    onReplyAdded={fetchComments}
                  />
                ))}
              </div>
            )}

            {/* New comment form */}
            <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
              <CommentForm blogId={blog._id} onSubmitted={fetchComments} />
            </div>
          </section>

        </div>
      </article>
    </PageWrapper>
  );
}