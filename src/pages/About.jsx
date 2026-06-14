import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Briefcase, GraduationCap } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PageWrapper from "../components/PageWrapper";

const skills = ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", "Figma", "PostgreSQL", "GraphQL", "AWS", "Docker", "Python", "Framer Motion"];

const experience = [
  { role: "Senior Frontend Engineer", company: "TechCorp Inc.", period: "2022 – Present", desc: "Led development of a SaaS dashboard used by 200k+ users. Improved performance by 60% through code splitting and lazy loading." },
  { role: "UI/UX Developer", company: "Digital Studio", period: "2020 – 2022", desc: "Designed and built 20+ client websites and web apps. Introduced design systems that reduced development time by 40%." },
  { role: "Junior Developer", company: "StartupXYZ", period: "2018 – 2020", desc: "Built core product features using React and Node.js. Collaborated directly with founders and product designers." },
];

const education = [
  { degree: "B.Sc. Computer Science", school: "University of Technology", year: "2018" },
  { degree: "UI/UX Design Certification", school: "Google + Coursera", year: "2020" },
];

export default function About() {
  return (
    <PageWrapper>
      <Helmet><title>About — John Doe</title></Helmet>

      <div className="pt-28 section-pad">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <span className="text-accent text-sm font-500 uppercase tracking-widest">Who I am</span>
            <h1 className="font-display text-5xl md:text-6xl font-700 mt-2">About Me</h1>
          </motion.div>

          {/* Bio */}
          <div className="grid md:grid-cols-2 gap-16 items-start mb-24">
            {/* Photo */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="aspect-square max-w-sm rounded-3xl bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center border border-neutral-200 dark:border-neutral-800">
                <span className="font-display text-8xl font-700 text-neutral-400 dark:text-neutral-500">JD</span>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-5">
                I'm a full-stack developer and designer based in New York, with 5+ years of experience building digital products that are both beautiful and performant.
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-5">
                My approach combines technical precision with design thinking. I believe the best products are those where you can't tell where engineering ends and design begins — they feel seamless, inevitable.
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-8">
                When I'm not coding, I'm hiking, playing jazz piano, or exploring how emerging tech can solve real human problems.
              </p>
              <a href="/resume.pdf" download className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-500 px-7 py-3.5 rounded-full transition-all hover:scale-105">
                <Download size={16} /> Download Resume
              </a>
            </motion.div>
          </div>

          {/* Skills */}
          <div className="mb-24">
            <h2 className="font-display text-3xl font-700 mb-8">Skills & Tools</h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((s) => (
                <span key={s} className="px-5 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full text-sm font-500 hover:border-accent hover:text-accent transition-all cursor-default">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="mb-24">
            <h2 className="font-display text-3xl font-700 mb-8 flex items-center gap-3">
              <Briefcase size={24} className="text-accent" /> Experience
            </h2>
            <div className="space-y-8">
              {experience.map((e, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex gap-6 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
                  <div className="w-3 h-3 mt-2 rounded-full bg-accent flex-shrink-0" />
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="font-display text-lg font-600">{e.role}</h3>
                      <span className="text-xs bg-accent/10 text-accent px-3 py-0.5 rounded-full">{e.period}</span>
                    </div>
                    <p className="text-accent text-sm font-500 mb-2">{e.company}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{e.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="font-display text-3xl font-700 mb-8 flex items-center gap-3">
              <GraduationCap size={24} className="text-accent" /> Education
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {education.map((e, i) => (
                <div key={i} className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
                  <p className="text-xs text-accent font-500 uppercase tracking-widest mb-1">{e.year}</p>
                  <h3 className="font-display text-lg font-600">{e.degree}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{e.school}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
