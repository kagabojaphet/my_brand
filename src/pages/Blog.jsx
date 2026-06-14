import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Clock, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PageWrapper from "../components/PageWrapper";

const categories = ["All", "React", "Design", "Career", "Tutorials"];

const posts = [
  { id: 1, title: "Building Scalable Design Systems in React", category: "React", excerpt: "How I structured a component library that scaled from startup to 200k users without breaking.", date: "Apr 12, 2025", readTime: "8 min", featured: true, color: "from-blue-400/20 to-purple-400/20" },
  { id: 2, title: "The Typography Rules I Follow in Every Project", category: "Design", excerpt: "Five typographic decisions that separate amateur designs from professional ones.", date: "Mar 28, 2025", readTime: "5 min", featured: false, color: "from-orange-400/20 to-red-400/20" },
  { id: 3, title: "How I Went From Employee to Freelancer in 90 Days", category: "Career", excerpt: "The exact steps, tools, and mindset shifts I used to build a freelance business.", date: "Mar 10, 2025", readTime: "10 min", featured: false, color: "from-green-400/20 to-teal-400/20" },
  { id: 4, title: "Framer Motion: The Animations Guide No One Wrote", category: "Tutorials", excerpt: "A deep dive into orchestrating complex animations without losing your mind.", date: "Feb 22, 2025", readTime: "12 min", featured: false, color: "from-pink-400/20 to-rose-400/20" },
  { id: 5, title: "Why I Switched from Redux to Zustand", category: "React", excerpt: "State management doesn't have to be complicated. Here's a lighter, faster approach.", date: "Feb 5, 2025", readTime: "6 min", featured: false, color: "from-cyan-400/20 to-blue-400/20" },
  { id: 6, title: "Design Tokens: The Secret to Consistent UI", category: "Design", excerpt: "Using design tokens to keep color, spacing, and typography in sync across teams.", date: "Jan 18, 2025", readTime: "7 min", featured: false, color: "from-yellow-400/20 to-orange-400/20" },
];

export default function Blog() {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const featured = posts.find((p) => p.featured);
  const rest = posts
    .filter((p) => !p.featured)
    .filter((p) => active === "All" || p.category === active)
    .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <PageWrapper>
      <Helmet><title>Blog — John Doe</title></Helmet>

      <div className="pt-28 section-pad">
        <div className="max-w-7xl mx-auto">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <span className="text-accent text-sm font-500 uppercase tracking-widest">Thoughts & tutorials</span>
            <h1 className="font-display text-5xl md:text-6xl font-700 mt-2">Blog & Articles</h1>
          </motion.div>

          {/* Search */}
          <div className="relative max-w-md mb-8">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-accent transition-colors" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((c) => (
              <button key={c} onClick={() => setActive(c)}
                className={`px-5 py-2 rounded-full text-sm font-500 transition-all ${active === c ? "bg-accent text-white" : "border border-neutral-200 dark:border-neutral-800 hover:border-accent hover:text-accent"}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Featured */}
          {featured && (
            <div className="mb-12">
              <div className={`rounded-3xl bg-gradient-to-br ${featured.color} border border-neutral-200 dark:border-neutral-800 overflow-hidden grid md:grid-cols-2 gap-0`}>
                <div className={`aspect-video md:aspect-auto min-h-48 bg-gradient-to-br ${featured.color}`} />
                <div className="p-8 flex flex-col justify-center">
                  <span className="text-xs bg-accent text-white px-3 py-1 rounded-full w-fit mb-4">Featured</span>
                  <h2 className="font-display text-2xl md:text-3xl font-700 mb-3">{featured.title}</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <span>{featured.date}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {featured.readTime}</span>
                    </div>
                    <button className="flex items-center gap-2 text-accent text-sm font-500 hover:gap-3 transition-all">
                      Read <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {rest.map((p, i) => (
              <motion.article key={p.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group cursor-pointer rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-accent/50 hover:-translate-y-1 transition-all bg-white/50 dark:bg-neutral-900/50">
                <div className={`aspect-video bg-gradient-to-br ${p.color}`} />
                <div className="p-6">
                  <span className="text-xs bg-accent/10 text-accent px-3 py-0.5 rounded-full font-500">{p.category}</span>
                  <h3 className="font-display text-lg font-600 mt-3 mb-2 group-hover:text-accent transition-colors">{p.title}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">{p.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>{p.date}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {p.readTime}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Newsletter */}
          <div className="rounded-3xl bg-neutral-950 dark:bg-neutral-900 border border-neutral-800 p-10 md:p-16 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-700 text-white mb-3">Get articles in your inbox</h2>
            <p className="text-neutral-400 mb-8">No spam. Quality writing on React, design, and building a freelance career.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="your@email.com"
                className="flex-1 px-5 py-3 rounded-full bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-accent" />
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
