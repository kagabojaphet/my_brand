import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, X } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PageWrapper from "../components/PageWrapper";

const categories = ["All", "React Apps", "Web Design", "Mobile", "Branding"];

const projects = [
  { id: 1, title: "SaaS Dashboard", category: "React Apps", tags: ["React", "TypeScript", "Tailwind"], desc: "A comprehensive analytics dashboard with real-time data visualization.", result: "Reduced client reporting time by 70%", demo: "#", github: "#", color: "from-blue-400/20 to-purple-400/20" },
  { id: 2, title: "E-Commerce Platform", category: "React Apps", tags: ["Next.js", "Stripe", "Prisma"], desc: "Full-stack e-commerce with cart, checkout, and inventory management.", result: "Increased conversion rate by 40%", demo: "#", github: "#", color: "from-green-400/20 to-teal-400/20" },
  { id: 3, title: "Brand Identity System", category: "Branding", tags: ["Figma", "Illustrator"], desc: "Complete visual identity for a fintech startup — logo, colors, typography.", result: "Brand recognition up 3× post-launch", demo: "#", github: "#", color: "from-orange-400/20 to-red-400/20" },
  { id: 4, title: "Travel App UI", category: "Mobile", tags: ["React Native", "Expo"], desc: "iOS/Android travel companion with offline maps and trip planning.", result: "4.8★ on App Store, 10k+ downloads", demo: "#", github: "#", color: "from-pink-400/20 to-rose-400/20" },
  { id: 5, title: "Agency Website", category: "Web Design", tags: ["Next.js", "Framer Motion"], desc: "High-performance marketing site with scroll animations and CMS.", result: "Page speed score 98, leads up 55%", demo: "#", github: "#", color: "from-yellow-400/20 to-orange-400/20" },
  { id: 6, title: "Portfolio Builder", category: "React Apps", tags: ["React", "Node.js", "MongoDB"], desc: "A drag-and-drop portfolio builder for creatives.", result: "500+ portfolios created in beta", demo: "#", github: "#", color: "from-cyan-400/20 to-blue-400/20" },
];

export default function Projects() {
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <PageWrapper>
      <Helmet><title>Projects — John Doe</title></Helmet>

      <div className="pt-28 section-pad">
        <div className="max-w-7xl mx-auto">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <span className="text-accent text-sm font-500 uppercase tracking-widest">Selected work</span>
            <h1 className="font-display text-5xl md:text-6xl font-700 mt-2">My Work</h1>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((c) => (
              <button key={c} onClick={() => setActive(c)}
                className={`px-5 py-2 rounded-full text-sm font-500 transition-all ${active === c ? "bg-accent text-white" : "border border-neutral-200 dark:border-neutral-800 hover:border-accent hover:text-accent"}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((p) => (
                <motion.div key={p.id} layout
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setSelected(p)}
                  className="group cursor-pointer rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white/50 dark:bg-neutral-900/50 hover:border-accent/50 hover:-translate-y-1 transition-all">
                  {/* Cover */}
                  <div className={`aspect-video bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                    <span className="font-display text-4xl font-700 text-white/30">{p.title[0]}</span>
                  </div>
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {p.tags.map((t) => (
                        <span key={t} className="text-xs bg-neutral-100 dark:bg-neutral-800 px-3 py-0.5 rounded-full font-mono">{t}</span>
                      ))}
                    </div>
                    <h3 className="font-display text-xl font-600 mb-2">{p.title}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 leading-relaxed">{p.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-accent font-500">📈 {p.result}</span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={p.demo} onClick={(e) => e.stopPropagation()} className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-accent hover:text-white transition-all"><ExternalLink size={14} /></a>
                        <a href={p.github} onClick={(e) => e.stopPropagation()} className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-accent hover:text-white transition-all"><Github size={14} /></a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-8 relative border border-neutral-200 dark:border-neutral-800">
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"><X size={18} /></button>
              <div className={`aspect-video rounded-2xl bg-gradient-to-br ${selected.color} mb-6`} />
              <div className="flex flex-wrap gap-2 mb-3">
                {selected.tags.map((t) => <span key={t} className="text-xs bg-neutral-100 dark:bg-neutral-800 px-3 py-0.5 rounded-full font-mono">{t}</span>)}
              </div>
              <h2 className="font-display text-2xl font-700 mb-3">{selected.title}</h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-4">{selected.desc}</p>
              <div className="p-4 bg-accent/10 rounded-xl mb-6">
                <p className="text-sm font-500 text-accent">📈 Result: {selected.result}</p>
              </div>
              <div className="flex gap-3">
                <a href={selected.demo} className="flex-1 text-center bg-accent text-white font-500 py-2.5 rounded-full text-sm hover:bg-accent-dark transition-colors">Live Demo →</a>
                <a href={selected.github} className="flex-1 text-center border border-neutral-200 dark:border-neutral-700 font-500 py-2.5 rounded-full text-sm hover:border-accent hover:text-accent transition-colors">View Code</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
