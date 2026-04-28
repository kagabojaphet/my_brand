import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Download, Code2, Palette, Layers } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PageWrapper from "../components/PageWrapper";

const roles = ["Developer", "Designer", "Freelancer", "Creator"];

const stats = [
  { value: "50+", label: "Projects Done" },
  { value: "30+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
];

const clients = ["Stripe", "Notion", "Linear", "Vercel", "Figma"];

const services = [
  { icon: Code2, title: "Web Development", desc: "React, Next.js, Node.js — fast, scalable, production-ready." },
  { icon: Palette, title: "UI/UX Design", desc: "Beautiful interfaces that convert visitors into clients." },
  { icon: Layers, title: "Brand Identity", desc: "Cohesive visual systems that make brands unforgettable." },
];

export default function Home() {
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setRoleIdx((i) => (i + 1) % roles.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <PageWrapper>
      <Helmet>
        <title>Japhet Iradukunda — Full-Stack Developer & Designer</title>
        <meta name="description" content="Portfolio of John Doe — building bold digital experiences." />
      </Helmet>

      {/* HERO */}
      <section className="min-h-screen flex items-center pt-24 section-pad relative overflow-hidden">
        {/* bg decoration */}
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-accent/10 text-accent text-sm font-500 px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Available for work
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-700 leading-[1.05] mb-6">
              Hi, I'm Japhet — I Build Things for the{" "}
              <span className="text-gradient">Web</span>
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mb-4">
              <span className="text-neutral-500 dark:text-neutral-400 text-lg">I'm a</span>
              <span className="font-display text-xl font-600 text-accent border-b-2 border-accent min-w-[120px]">
                {roles[roleIdx]}
              </span>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-10 max-w-md">
              Helping brands grow through clean code and bold design. I turn complex problems into elegant digital solutions.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4">
              <Link to="/projects" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-500 px-7 py-3.5 rounded-full transition-all hover:scale-105">
                View My Work <ArrowRight size={16} />
              </Link>
              <a href="/resume.pdf" download className="inline-flex items-center gap-2 border border-neutral-300 dark:border-neutral-700 hover:border-accent text-neutral-700 dark:text-neutral-300 font-500 px-7 py-3.5 rounded-full transition-all hover:text-accent">
                <Download size={16} /> Download CV
              </a>
            </motion.div>
          </div>

          {/* Avatar */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-3xl bg-gradient-to-br from-accent/20 to-orange-400/20 border-2 border-accent/30 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center">
                  <span className="font-display text-7xl font-700 text-neutral-400 dark:text-neutral-500">JI</span>
                </div>
              </div>
              {/* floating chips */}
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2 rounded-xl shadow-lg">
                <span className="font-display text-sm font-600">5+ yrs exp</span>
              </div>
              <div className="absolute -top-4 -right-4 bg-accent text-white px-4 py-2 rounded-xl shadow-lg">
                <span className="font-display text-sm font-600">50+ projects</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="py-12 px-6 border-y border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs font-500 uppercase tracking-widest text-neutral-400 mb-8">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {clients.map((c) => (
              <span key={c} className="font-display text-xl font-700 text-neutral-300 dark:text-neutral-700 hover:text-accent transition-colors cursor-default">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section-pad">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6 mb-24">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-4xl md:text-5xl font-700 text-gradient">{s.value}</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* SERVICES PREVIEW */}
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-700 mb-12">What I Do</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-accent/50 transition-all hover:-translate-y-1 bg-white/50 dark:bg-neutral-900/50">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                  <Icon size={22} className="text-accent" />
                </div>
                <h3 className="font-display text-lg font-600 mb-2">{title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/services" className="inline-flex items-center gap-2 text-accent font-500 hover:gap-3 transition-all">
              See all services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
