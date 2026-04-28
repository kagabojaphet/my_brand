import { motion } from "framer-motion";
import { Download, Briefcase, GraduationCap, Award } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PageWrapper from "../components/PageWrapper";

const experience = [
  { role: "Senior Frontend Engineer", company: "TechCorp Inc.", period: "2022 – Present", points: ["Led migration from CRA to Next.js 14, cutting build times by 60%", "Built a component library used across 5 product teams", "Mentored 3 junior engineers"] },
  { role: "UI/UX Developer", company: "Digital Studio", period: "2020 – 2022", points: ["Delivered 20+ client projects on time and within budget", "Introduced Storybook-based design system", "Improved Core Web Vitals to 95+ for all projects"] },
  { role: "Junior Developer", company: "StartupXYZ", period: "2018 – 2020", points: ["Built and shipped core product features in React/Node.js", "Collaborated directly with founders on product direction", "Integrated Stripe payments and Twilio notifications"] },
];

const education = [
  { degree: "B.Sc. Computer Science", school: "University of Technology", year: "2018", detail: "Graduated with Honours. Focus on software engineering and HCI." },
  { degree: "UI/UX Design Certificate", school: "Google x Coursera", year: "2020", detail: "Completed professional certification in user experience research and design." },
];

const skills = [
  { name: "React / Next.js", level: 95 },
  { name: "TypeScript", level: 88 },
  { name: "Node.js / Express", level: 82 },
  { name: "Figma / Design", level: 85 },
  { name: "Python", level: 70 },
];

const certs = [
  { name: "AWS Certified Developer", org: "Amazon Web Services", year: "2023" },
  { name: "Google UX Design", org: "Google / Coursera", year: "2020" },
  { name: "Meta Frontend Dev", org: "Meta / Coursera", year: "2022" },
];

export default function Resume() {
  return (
    <PageWrapper>
      <Helmet><title>Resume — John Doe</title></Helmet>

      <div className="pt-28 section-pad">
        <div className="max-w-4xl mx-auto">

          <div className="flex flex-wrap items-start justify-between gap-6 mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-accent text-sm font-500 uppercase tracking-widest">Career overview</span>
              <h1 className="font-display text-5xl md:text-6xl font-700 mt-2">Resume</h1>
            </motion.div>
            <a href="/resume.pdf" download className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-500 px-6 py-3 rounded-full transition-all hover:scale-105 text-sm">
              <Download size={15} /> Download PDF
            </a>
          </div>

          {/* Experience */}
          <section className="mb-16">
            <h2 className="font-display text-2xl font-700 flex items-center gap-3 mb-8">
              <Briefcase size={22} className="text-accent" /> Work Experience
            </h2>
            <div className="relative pl-6 border-l-2 border-neutral-200 dark:border-neutral-800 space-y-10">
              {experience.map((e, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="relative">
                  <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-accent border-4 border-surface-light dark:border-surface-dark" />
                  <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="font-display text-lg font-600">{e.role}</h3>
                      <span className="text-xs bg-accent/10 text-accent px-3 py-0.5 rounded-full">{e.period}</span>
                    </div>
                    <p className="text-accent text-sm font-500 mb-3">{e.company}</p>
                    <ul className="space-y-1">
                      {e.points.map((p, j) => (
                        <li key={j} className="text-sm text-neutral-500 dark:text-neutral-400 flex items-start gap-2">
                          <span className="text-accent mt-1.5 text-xs">▸</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="mb-16">
            <h2 className="font-display text-2xl font-700 flex items-center gap-3 mb-8">
              <GraduationCap size={22} className="text-accent" /> Education
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {education.map((e, i) => (
                <div key={i} className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
                  <p className="text-xs text-accent font-500 uppercase tracking-widest mb-1">{e.year}</p>
                  <h3 className="font-display text-lg font-600 mb-1">{e.degree}</h3>
                  <p className="text-sm text-accent mb-2">{e.school}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{e.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section className="mb-16">
            <h2 className="font-display text-2xl font-700 mb-8">Skills</h2>
            <div className="space-y-5">
              {skills.map((s, i) => (
                <div key={s.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-500">{s.name}</span>
                    <span className="text-sm text-neutral-400 font-mono">{s.level}%</span>
                  </div>
                  <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.level}%` }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-accent to-orange-400 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section className="mb-16">
            <h2 className="font-display text-2xl font-700 flex items-center gap-3 mb-8">
              <Award size={22} className="text-accent" /> Certifications
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {certs.map((c, i) => (
                <div key={i} className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-center">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Award size={18} className="text-accent" />
                  </div>
                  <h3 className="font-display text-sm font-600 mb-1">{c.name}</h3>
                  <p className="text-xs text-neutral-400">{c.org}</p>
                  <p className="text-xs text-accent mt-1">{c.year}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Languages */}
          <section>
            <h2 className="font-display text-2xl font-700 mb-6">Languages</h2>
            <div className="flex gap-4 flex-wrap">
              {[{ lang: "English", level: "Fluent" }, { lang: "French", level: "Intermediate" }, { lang: "Spanish", level: "Basic" }].map((l) => (
                <div key={l.lang} className="px-5 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
                  <span className="font-display font-600 text-sm">{l.lang}</span>
                  <span className="text-xs text-neutral-400 ml-2">{l.level}</span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </PageWrapper>
  );
}
