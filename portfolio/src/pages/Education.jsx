// src/pages/Education.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, MapPin, Calendar, Award,
  ChevronDown, ChevronUp, RefreshCw, BookOpen,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import PageWrapper from "../components/PageWrapper";

const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

// ── Fallback data shown while API loads or if no data yet ─────────────────
const FALLBACK = [
  {
    _id:         "f1",
    institution: "University of Technology",
    degree:      "Bachelor of Science",
    field:       "Computer Science",
    startYear:   "2018",
    endYear:     "2022",
    current:     false,
    description: "Studied software engineering, algorithms, data structures and system design. Final project: AI-based academic advisor system.",
    grade:       "GPA 3.8 / 4.0",
    location:    "Kigali, Rwanda",
    logo:        "",
  },
  {
    _id:         "f2",
    institution: "Google / Coursera",
    degree:      "Professional Certificate",
    field:       "UX Design",
    startYear:   "2022",
    endYear:     "2022",
    current:     false,
    description: "6-month programme covering user research, wireframing, prototyping and usability testing.",
    grade:       "Completed with Distinction",
    location:    "Online",
    logo:        "",
  },
  {
    _id:         "f3",
    institution: "Meta / Coursera",
    degree:      "Professional Certificate",
    field:       "Front-End Development",
    startYear:   "2023",
    endYear:     "Present",
    current:     true,
    description: "Advanced React, state management, performance optimisation and modern tooling.",
    grade:       "In Progress",
    location:    "Online",
    logo:        "",
  },
];

// ── Skeleton card ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse flex gap-5 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
      <div className="w-14 h-14 rounded-xl bg-neutral-200 dark:bg-neutral-700 shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-700 rounded" />
        <div className="h-5 w-56 bg-neutral-200 dark:bg-neutral-700 rounded" />
        <div className="h-4 w-40 bg-neutral-200 dark:bg-neutral-700 rounded" />
        <div className="h-3 w-full  bg-neutral-200 dark:bg-neutral-700 rounded" />
        <div className="h-3 w-3/4  bg-neutral-200 dark:bg-neutral-700 rounded" />
      </div>
    </div>
  );
}

// ── Single education card ─────────────────────────────────────────────────
function EduCard({ item, index }) {
  const [open, setOpen] = useState(false);

  const period = item.current
    ? `${item.startYear} — Present`
    : `${item.startYear} — ${item.endYear}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.08, 0.4) }}
      className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 overflow-hidden hover:border-accent/40 transition-colors"
    >
      {/* ── Main row ── */}
      <div className="flex items-start gap-5 p-6">

        {/* Logo or initials */}
        <div className="shrink-0">
          {item.logo ? (
            <img
              src={item.logo}
              alt={item.institution}
              className="w-14 h-14 rounded-xl object-cover border border-neutral-200 dark:border-neutral-800"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
              <GraduationCap size={24} className="text-accent" />
            </div>
          )}
        </div>

        {/* Core info */}
        <div className="flex-1 min-w-0">

          {/* Period + current badge */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
              <Calendar size={11} /> {period}
            </span>
            {item.current && (
              <span className="text-xs bg-green-400/15 text-green-500 dark:text-green-400 px-2.5 py-0.5 rounded-full font-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Current
              </span>
            )}
          </div>

          {/* Degree + field */}
          <h3 className="font-display text-lg font-700 leading-tight">
            {item.degree}
            {item.field && (
              <span className="text-accent"> — {item.field}</span>
            )}
          </h3>

          {/* Institution */}
          <p className="text-sm font-500 text-neutral-600 dark:text-neutral-300 mt-0.5">
            {item.institution}
          </p>

          {/* Location + grade row */}
          <div className="flex flex-wrap items-center gap-4 mt-2">
            {item.location && (
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <MapPin size={11} /> {item.location}
              </span>
            )}
            {item.grade && (
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <Award size={11} /> {item.grade}
              </span>
            )}
          </div>
        </div>

        {/* Expand toggle — only if there's a description */}
        {item.description && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="shrink-0 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-accent transition-all"
            aria-label={open ? "Collapse" : "Read more"}
          >
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>

      {/* ── Expandable description ── */}
      <AnimatePresence initial={false}>
        {open && item.description && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0 border-t border-neutral-100 dark:border-neutral-800">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
                {item.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function Education() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchEducation = () => {
    setLoading(true);
    setError(null);
    fetch(`${BASE}/education`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setItems(d.data || []);
        else throw new Error(d.message || "Failed to load.");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEducation(); }, []);

  // Use API data when available, fallback when empty or errored
  const displayItems = (!loading && items.length === 0) ? FALLBACK : items;

  // Split into education vs certifications for two sections
  // Heuristic: degree contains "Certificate" or "Certification" → certification
  const isCert = (item) =>
    /certif/i.test(item.degree) || /certif/i.test(item.field);

  const eduItems  = displayItems.filter((i) => !isCert(i));
  const certItems = displayItems.filter((i) =>  isCert(i));

  return (
    <PageWrapper>
      <Helmet>
        <title>Education | Japhet</title>
        <meta name="description" content="Academic background, degrees, and certifications." />
      </Helmet>

      <div className="pt-28 section-pad">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
            <span className="text-accent text-sm font-500 uppercase tracking-widest">My background</span>
            <h1 className="font-display text-5xl md:text-6xl font-700 mt-2">Education</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-4 text-lg max-w-lg">
              Formal degrees and professional certifications that shaped my skills.
            </p>
          </motion.div>

          {/* Error banner */}
          {error && (
            <div className="mb-10 flex items-center gap-4 p-5 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <p className="flex-1 text-sm text-red-600 dark:text-red-400">{error} — showing sample data.</p>
              <button
                onClick={fetchEducation}
                className="flex items-center gap-1.5 text-sm font-500 text-red-600 dark:text-red-400 hover:underline shrink-0"
              >
                <RefreshCw size={13} /> Retry
              </button>
            </div>
          )}

          {/* Loading skeletons */}
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <>
              {/* ── Degrees ── */}
              {eduItems.length > 0 && (
                <section className="mb-14">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                      <GraduationCap size={18} className="text-accent" />
                    </div>
                    <h2 className="font-display text-2xl font-700">Degrees</h2>
                  </div>
                  <div className="space-y-4">
                    {eduItems.map((item, i) => (
                      <EduCard key={item._id} item={item} index={i} />
                    ))}
                  </div>
                </section>
              )}

              {/* ── Certifications ── */}
              {certItems.length > 0 && (
                <section className="mb-14">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                      <BookOpen size={18} className="text-accent" />
                    </div>
                    <h2 className="font-display text-2xl font-700">Certifications</h2>
                  </div>
                  <div className="space-y-4">
                    {certItems.map((item, i) => (
                      <EduCard key={item._id} item={item} index={i} />
                    ))}
                  </div>
                </section>
              )}

              {/* Empty state (API returned empty AND fallback is also empty somehow) */}
              {displayItems.length === 0 && (
                <div className="text-center py-24 text-neutral-400">
                  <GraduationCap size={40} className="mx-auto mb-4 opacity-30" />
                  <p className="font-display text-xl font-600 mb-1">No entries yet</p>
                  <p className="text-sm">Education records will appear here once added.</p>
                </div>
              )}
            </>
          )}

          {/* ── Stats bar ── */}
          {!loading && displayItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-4 mt-4"
            >
              {[
                { label: "Institutions",     value: displayItems.length },
                { label: "Years of Study",   value: `${Math.min(...displayItems.map((i) => Number(i.startYear) || 9999))}+` },
                { label: "Certifications",   value: certItems.length },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-center"
                >
                  <p className="font-display text-3xl font-700 text-accent">{value}</p>
                  <p className="text-xs text-neutral-400 mt-1">{label}</p>
                </div>
              ))}
            </motion.div>
          )}

        </div>
      </div>
    </PageWrapper>
  );
}