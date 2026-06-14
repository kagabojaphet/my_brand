// src/pages/Projects.jsx
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, X, Loader2, RefreshCw } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PageWrapper from "../components/PageWrapper";

const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

const CATEGORIES = ["All", "React Apps", "Web Design", "Mobile", "Branding", "Full Stack", "Other"];

// ── Fallback gradient if no coverImage ────────────────────────────────────
const COLORS = [
  "from-blue-400/20 to-purple-400/20",
  "from-green-400/20 to-teal-400/20",
  "from-orange-400/20 to-red-400/20",
  "from-pink-400/20 to-rose-400/20",
  "from-yellow-400/20 to-orange-400/20",
  "from-cyan-400/20 to-blue-400/20",
  "from-purple-400/20 to-pink-400/20",
];

// ── Skeleton card ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white/50 dark:bg-neutral-900/50 animate-pulse">
      <div className="aspect-video bg-neutral-200 dark:bg-neutral-700" />
      <div className="p-6 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
          <div className="h-5 w-20 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
        </div>
        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
        <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded" />
      </div>
    </div>
  );
}

export default function Projects() {
  const [active,   setActive]   = useState("All");
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [selected, setSelected] = useState(null);

  // ── Fetch from backend ───────────────────────────────────────────────────
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (active !== "All") params.set("category", active);

      const res  = await fetch(`${BASE}/projects?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load projects.");
      setProjects(data.data || []);
    } catch (err) {
      setError(err.message || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }, [active]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  // Close modal on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <PageWrapper>
      <Helmet><title>Projects | Japhet</title></Helmet>

      <div className="pt-28 section-pad">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <span className="text-accent text-sm font-500 uppercase tracking-widest">Selected work</span>
            <h1 className="font-display text-5xl md:text-6xl font-700 mt-2">My Work</h1>
          </motion.div>

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

          {/* Error */}
          {error && (
            <div className="mb-10 flex items-center gap-4 p-5 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <p className="flex-1 text-sm text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={fetchProjects}
                className="flex items-center gap-1.5 text-sm font-500 text-red-600 dark:text-red-400 hover:underline shrink-0"
              >
                <RefreshCw size={13} /> Retry
              </button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : projects.length === 0 && !error ? (
            /* Empty */
            <div className="text-center py-24 text-neutral-400">
              <p className="text-5xl mb-4">🗂️</p>
              <p className="font-display text-2xl font-600 mb-2">No projects yet</p>
              <p className="text-sm">Check back soon — work is coming!</p>
            </div>
          ) : (
            /* Grid */
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {projects.map((p, i) => {
                  const color = p.color || COLORS[i % COLORS.length];
                  return (
                    <motion.div
                      key={p._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: Math.min(i * 0.06, 0.3) }}
                      onClick={() => setSelected({ ...p, color })}
                      className="group cursor-pointer rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white/50 dark:bg-neutral-900/50 hover:border-accent/50 hover:-translate-y-1 transition-all"
                    >
                      {/* Cover */}
                      {p.coverImage?.url ? (
                        <img
                          src={p.coverImage.url}
                          alt={p.title}
                          className="w-full aspect-video object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className={`aspect-video bg-gradient-to-br ${color} flex items-center justify-center`}>
                          <span className="font-display text-4xl font-700 text-white/30">
                            {p.title?.[0]}
                          </span>
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {p.tags?.map((t) => (
                            <span key={t} className="text-xs bg-neutral-100 dark:bg-neutral-800 px-3 py-0.5 rounded-full font-mono">
                              {t}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-display text-xl font-600 mb-2">{p.title}</h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 leading-relaxed line-clamp-2">
                          {p.shortDesc || p.description}
                        </p>
                        <div className="flex items-center justify-between">
                          {p.result && (
                            <span className="text-xs text-accent font-500 line-clamp-1">
                              📈 {p.result}
                            </span>
                          )}
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                            {p.demoUrl && (
                              <a
                                href={p.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-accent hover:text-white transition-all"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                            {p.githubUrl && (
                              <a
                                href={p.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-accent hover:text-white transition-all"
                              >
                                <Github size={14} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

        </div>
      </div>

      {/* ── Detail Modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative border border-neutral-200 dark:border-neutral-800"
            >
              {/* Close */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X size={18} />
              </button>

              {/* Cover */}
              {selected.coverImage?.url ? (
                <img
                  src={selected.coverImage.url}
                  alt={selected.title}
                  className="w-full aspect-video object-cover rounded-t-3xl"
                />
              ) : (
                <div className={`aspect-video rounded-t-3xl bg-gradient-to-br ${selected.color}`} />
              )}

              <div className="p-8">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {selected.tags?.map((t) => (
                    <span key={t} className="text-xs bg-neutral-100 dark:bg-neutral-800 px-3 py-0.5 rounded-full font-mono">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Category badge */}
                <span className="inline-block text-xs bg-accent/10 text-accent px-3 py-0.5 rounded-full font-500 mb-3">
                  {selected.category}
                </span>

                {/* Title */}
                <h2 className="font-display text-2xl font-700 mb-3">{selected.title}</h2>

                {/* Description — full version in modal */}
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-4">
                  {selected.description}
                </p>

                {/* Result */}
                {selected.result && (
                  <div className="p-4 bg-accent/10 rounded-xl mb-6">
                    <p className="text-sm font-500 text-accent">📈 Result: {selected.result}</p>
                  </div>
                )}

                {/* Gallery (extra images) */}
                {selected.images?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {selected.images.map((img) => (
                      <img
                        key={img._id}
                        src={img.url}
                        alt={img.caption || selected.title}
                        className="w-full aspect-video object-cover rounded-xl"
                      />
                    ))}
                  </div>
                )}

                {/* CTA buttons */}
                <div className="flex gap-3">
                  {selected.demoUrl ? (
                    <a
                      href={selected.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-accent text-white font-500 py-2.5 rounded-full text-sm hover:bg-accent-dark transition-colors"
                    >
                      Live Demo →
                    </a>
                  ) : (
                    <span className="flex-1 text-center bg-neutral-100 dark:bg-neutral-800 text-neutral-400 font-500 py-2.5 rounded-full text-sm cursor-not-allowed">
                      No Demo
                    </span>
                  )}
                  {selected.githubUrl ? (
                    <a
                      href={selected.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center border border-neutral-200 dark:border-neutral-700 font-500 py-2.5 rounded-full text-sm hover:border-accent hover:text-accent transition-colors"
                    >
                      View Code
                    </a>
                  ) : (
                    <span className="flex-1 text-center border border-neutral-200 dark:border-neutral-700 text-neutral-400 font-500 py-2.5 rounded-full text-sm cursor-not-allowed">
                      Private Repo
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}