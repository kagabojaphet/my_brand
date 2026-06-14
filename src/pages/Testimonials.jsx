import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PageWrapper from "../components/PageWrapper";

const stats = [
  { value: "50+", label: "Projects Completed" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "30+", label: "Clients Worldwide" },
];

const testimonials = [
  { name: "Sarah Chen", role: "CEO, TechNova", quote: "John transformed our outdated website into a conversion machine. Within 3 months, our leads doubled. I recommend him without hesitation.", rating: 5 },
  { name: "Marcus Reid", role: "Founder, BuildFast", quote: "Exceptional work ethic, clear communication, and the final product exceeded every expectation. He's the only developer I'll work with.", rating: 5 },
  { name: "Aisha Okonkwo", role: "Head of Design, Stripe", quote: "John has a rare combination of technical depth and design sensibility. He shipped our dashboard redesign on time and on budget.", rating: 5 },
  { name: "Tom Erikson", role: "CTO, Linkify", quote: "The codebase he delivered was clean, well-documented, and easy to hand off to our internal team. 10/10 professional.", rating: 5 },
  { name: "Priya Sharma", role: "Product Manager, Notion", quote: "We needed a quick turnaround on a high-visibility launch. John delivered in half the time we expected without sacrificing quality.", rating: 5 },
  { name: "Carlos Rivera", role: "Creative Director, BBDO", quote: "Not only does he code beautifully, he pushes back constructively when he thinks there's a better solution. That's invaluable.", rating: 5 },
];

const brands = ["Google", "Stripe", "Notion", "Vercel", "Linear", "Figma"];

export default function Testimonials() {
  return (
    <PageWrapper>
      <Helmet><title>Testimonials — John Doe</title></Helmet>

      <div className="pt-28 section-pad">
        <div className="max-w-7xl mx-auto">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <span className="text-accent text-sm font-500 uppercase tracking-widest">Social proof</span>
            <h1 className="font-display text-5xl md:text-6xl font-700 mt-2">What Clients Say</h1>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-20">
            {stats.map((s) => (
              <div key={s.label} className="text-center p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
                <div className="font-display text-4xl md:text-5xl font-700 text-gradient">{s.value}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonials grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 mb-20 space-y-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="break-inside-avoid p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 hover:border-accent/30 transition-all">
                <div className="flex gap-0.5 mb-4">
                  {Array(t.rating).fill(0).map((_, j) => <Star key={j} size={14} className="text-accent fill-accent" />)}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/30 to-orange-400/30 flex items-center justify-center font-display font-700 text-accent text-sm flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-display font-600 text-sm">{t.name}</p>
                    <p className="text-xs text-neutral-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Brand logos */}
          <div className="mb-20 py-10 border-y border-neutral-200 dark:border-neutral-800">
            <p className="text-center text-xs uppercase tracking-widest text-neutral-400 mb-8">Brands I've Worked With</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {brands.map((b) => (
                <span key={b} className="font-display text-xl font-700 text-neutral-300 dark:text-neutral-700 hover:text-accent transition-colors cursor-default">{b}</span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="font-display text-3xl md:text-4xl font-700 mb-4">Want results like these?</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mb-8">Let's build something you'll be proud to show off.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-500 px-8 py-4 rounded-full transition-all hover:scale-105">
              Hire Me →
            </Link>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
