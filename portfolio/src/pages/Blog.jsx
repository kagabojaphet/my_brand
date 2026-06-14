// src/pages/Blog.jsx
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Clock, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PageWrapper from "../components/PageWrapper";
import { blogService } from "../services/blogService";

// ─── Constants ────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "React", "Design", "Career", "Tutorials", "Node.js", "DevOps", "General"];

// Gradient fallback colours — cycle when post has no cover image
const COLORS = [
  "from-blue-400/20 to-purple-400/20",
  "from-orange-400/20 to-red-400/20",
  "from-green-400/20 to-teal-400/20",
  "from-pink-400/20 to-rose-400/20",
  "from-cyan-400/20 to-blue-400/20",
  "from-yellow-400/20 to-orange-400/20",
];

// ─── Skeleton loader — same card dimensions as real cards ─────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white/50 dark:bg-neutral-900/50 animate-pulse">
      <div className="aspect-video bg-neutral-200 dark:bg-neutral-700" />
      <div className="p-6 space-y-3">
        <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
        <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded" />
        <div className="h-4 w-2/3 bg-neutral-200 dark:bg-neutral-700 rounded" />
      </div>
    </div>
  );
}

// ─── Single post card — identical markup to original static version ────────
function PostCard({ post, index }) {
  const color = COLORS[index % COLORS.length];
  const date  = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <motion.article
      key={post._id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="group cursor-pointer rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-accent/50 hover:-translate-y-1 transition-all bg-white/50 dark:bg-neutral-900/50"
    >
      {/* Cover image or gradient fallback */}
      <Link to={`/blog/${post.slug}`}>
        {post.coverImage?.url ? (
          <img
            src={post.coverImage.url}
            alt={post.title}
            className="w-full aspect-video object-cover"
            loading="lazy"
          />
        ) : (
          <div className={`aspect-video bg-gradient-to-br ${color}`} />
        )}
      </Link>

      <div className="p-6">
        <span className="text-xs bg-accent/10 text-accent px-3 py-0.5 rounded-full font-500">
          {post.category}
        </span>

        <Link to={`/blog/${post.slug}`}>
          <h3 className="font-display text-lg font-600 mt-3 mb-2 group-hover:text-accent transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>{date}</span>
          <span className="flex items-center gap-1">
            <Clock size={11} /> {post.readTime}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────
export default function Blog() {
  const [active,   setActive]   = useState("All");
  const [query,    setQuery]    = useState("");
  const [posts,    setPosts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  // Fetch from API whenever category or search changes
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: 50 });
      if (active !== "All") params.set("category", active);
      if (query.trim())     params.set("search",   query.trim());

      const res = await blogService.getBlogs(`?${params.toString()}`);
      if (res.success) {
        setPosts(res.data || []);
      } else {
        setError(res.message || "Failed to load posts.");
      }
    } catch (err) {
      setError("Could not connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [active, query]);

  useEffect(() => {
    // Debounce search input by 400 ms; fire immediately for category changes
    const id = setTimeout(fetchPosts, query ? 400 : 0);
    return () => clearTimeout(id);
  }, [fetchPosts, query]);

  const featured = posts.find((p) => p.featured);
  const rest     = posts.filter((p) => !p.featured);

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <PageWrapper>
      <Helmet>
        <title>Blog | Japhet</title>
        <meta name="description" content="Thoughts and tutorials on React, design, career, and more." />
      </Helmet>

      <div className="pt-28 section-pad">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <span className="text-accent text-sm font-500 uppercase tracking-widest">
              Thoughts & tutorials
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-700 mt-2">Blog & Articles</h1>
          </motion.div>

          {/* Search */}
          <div className="relative max-w-md mb-8">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-5 py-2 rounded-full text-sm font-500 transition-all ${
                  active === c
                    ? "bg-accent text-white"
                    : "border border-neutral-200 dark:border-neutral-800 hover:border-accent hover:text-accent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Error state */}
          {error && (
            <div className="mb-8 p-4 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Loading skeletons */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : posts.length === 0 && !error ? (
            /* Empty state */
            <div className="text-center py-20 text-neutral-400">
              <p className="text-4xl mb-3">✍️</p>
              <p className="font-display text-xl font-600 mb-1">No articles yet</p>
              <p className="text-sm">Check back soon — posts are coming!</p>
            </div>
          ) : (
            <>
              {/* Featured post — shown only on "All" with no search query */}
              {featured && active === "All" && !query && (
                <div className="mb-12">
                  <Link
                    to={`/blog/${featured.slug}`}
                    className={`block rounded-3xl bg-gradient-to-br ${
                      COLORS[0]
                    } border border-neutral-200 dark:border-neutral-800 overflow-hidden grid md:grid-cols-2 gap-0 hover:border-accent/50 transition-all`}
                  >
                    {/* Cover / gradient */}
                    {featured.coverImage?.url ? (
                      <img
                        src={featured.coverImage.url}
                        alt={featured.title}
                        className="w-full aspect-video md:aspect-auto object-cover min-h-48"
                      />
                    ) : (
                      <div className={`aspect-video md:aspect-auto min-h-48 bg-gradient-to-br ${COLORS[0]}`} />
                    )}

                    <div className="p-8 flex flex-col justify-center">
                      <span className="text-xs bg-accent text-white px-3 py-1 rounded-full w-fit mb-4">
                        Featured
                      </span>
                      <h2 className="font-display text-2xl md:text-3xl font-700 mb-3">
                        {featured.title}
                      </h2>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-6">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-neutral-400">
                          <span>
                            {featured.createdAt
                              ? new Date(featured.createdAt).toLocaleDateString("en-US", {
                                  month: "short", day: "numeric", year: "numeric",
                                })
                              : ""}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {featured.readTime}
                          </span>
                        </div>
                        <span className="flex items-center gap-2 text-accent text-sm font-500">
                          Read <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Post grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                {rest.map((p, i) => (
                  <PostCard key={p._id} post={p} index={i} />
                ))}
              </div>
            </>
          )}

          {/* Newsletter section — unchanged */}
          <div className="rounded-3xl bg-neutral-950 dark:bg-neutral-900 border border-neutral-800 p-10 md:p-16 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-700 text-white mb-3">
              Get articles in your inbox
            </h2>
            <p className="text-neutral-400 mb-8">
              No spam. Quality writing on React, design, and building a freelance career.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-5 py-3 rounded-full bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-accent"
              />
              <button className="bg-accent hover:bg-accent-dark text-white font-500 px-7 py-3 rounded-full text-sm transition-colors whitespace-nowrap">
                Subscribe →
              </button>
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
