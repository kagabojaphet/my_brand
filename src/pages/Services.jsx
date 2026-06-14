import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, Palette, Layers, Check, ChevronDown } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PageWrapper from "../components/PageWrapper";

const services = [
  { icon: Code2, title: "Web Development", desc: "Fast, scalable web applications built with modern frameworks like React, Next.js, and Node.js. From simple sites to complex SaaS products." },
  { icon: Palette, title: "UI/UX Design", desc: "User interfaces that are both beautiful and intuitive. I design in Figma and deliver pixel-perfect components ready for development." },
  { icon: Layers, title: "Brand Identity", desc: "Cohesive visual systems — logo, color palette, typography, and brand guidelines — that make your brand instantly recognizable." },
];

const plans = [
  {
    name: "Starter", price: "$999", desc: "Perfect for individuals and small businesses.", popular: false,
    features: ["1 landing page", "Mobile responsive", "Basic SEO setup", "Contact form", "2 revision rounds", "1 week delivery"],
  },
  {
    name: "Pro", price: "$2,499", desc: "The most popular choice for growing brands.", popular: true,
    features: ["Up to 5 pages", "Custom design system", "React + CMS setup", "Blog integration", "Performance optimization", "5 revision rounds", "2–3 week delivery"],
  },
  {
    name: "Agency", price: "$5,999+", desc: "Full-scale products and ongoing partnerships.", popular: false,
    features: ["Unlimited pages", "Full-stack development", "Design + dev included", "Admin dashboard", "Analytics setup", "Priority support", "Custom timeline"],
  },
];

const faqs = [
  { q: "What's your typical turnaround time?", a: "Starter projects take ~1 week, Pro projects 2–3 weeks, and Agency-scale work depends on scope. I always give a detailed timeline upfront." },
  { q: "Do you offer revisions?", a: "Yes. Each plan includes a set number of revision rounds. Additional revisions beyond that are billed at an hourly rate." },
  { q: "What do I need to provide to get started?", a: "A brief describing your project goals, any brand assets you have (logo, colors), and content if available. I can guide you through the rest." },
  { q: "Do you work with international clients?", a: "Absolutely. I work with clients worldwide. Most communication happens async via email and Slack, with video calls for major milestones." },
  { q: "Can you maintain my site after launch?", a: "Yes! I offer monthly maintenance retainers for updates, security patches, and small feature additions." },
];

export default function Services() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <PageWrapper>
      <Helmet><title>Services — John Doe</title></Helmet>

      <div className="pt-28 section-pad">
        <div className="max-w-7xl mx-auto">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <span className="text-accent text-sm font-500 uppercase tracking-widest">What I offer</span>
            <h1 className="font-display text-5xl md:text-6xl font-700 mt-2">Services</h1>
          </motion.div>

          {/* Service cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-24">
            {services.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-accent/50 bg-white/50 dark:bg-neutral-900/50 hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-white transition-all">
                  <Icon size={22} className="text-accent group-hover:text-white" />
                </div>
                <h3 className="font-display text-xl font-600 mb-3">{title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Pricing */}
          <div className="mb-24">
            <h2 className="font-display text-3xl md:text-4xl font-700 mb-12 text-center">Pricing</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((p, i) => (
                <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`relative p-8 rounded-2xl border transition-all ${p.popular ? "border-accent bg-accent/5 scale-105" : "border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50"}`}>
                  {p.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-600 px-4 py-1 rounded-full">Most Popular</span>
                  )}
                  <h3 className="font-display text-xl font-600 mb-1">{p.name}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">{p.desc}</p>
                  <div className="font-display text-4xl font-700 mb-6">{p.price}</div>
                  <ul className="space-y-3 mb-8">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm">
                        <Check size={15} className="text-accent flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact"
                    className={`block text-center font-500 py-3 rounded-full text-sm transition-all ${p.popular ? "bg-accent hover:bg-accent-dark text-white" : "border border-neutral-300 dark:border-neutral-700 hover:border-accent hover:text-accent"}`}>
                    Get Started
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-24">
            <h2 className="font-display text-3xl font-700 mb-8">Frequently Asked</h2>
            <div className="space-y-3 max-w-2xl">
              {faqs.map((f, i) => (
                <div key={i} className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left font-display font-600 hover:text-accent transition-colors">
                    {f.q}
                    <ChevronDown size={18} className={`flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{f.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="rounded-3xl bg-neutral-950 p-10 md:p-16 text-center border border-neutral-800">
            <h2 className="font-display text-3xl md:text-4xl font-700 text-white mb-3">Ready to work together?</h2>
            <p className="text-neutral-400 mb-8">Let's talk about your project. No commitment, just a conversation.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-500 px-8 py-4 rounded-full text-base transition-all hover:scale-105">
              Book a Free Call →
            </Link>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
