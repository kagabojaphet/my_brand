import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Briefcase, GraduationCap } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PageWrapper from "../components/PageWrapper";
import profile from "../assets/Group-Picture.jpg";

const skills = [
  // Frontend
  "React.js", "Next.js", "TypeScript", "Tailwind CSS", "Flutter", "React Native",
  // Backend
  "Node.js", "PHP", "Python", "REST APIs",
  // CMS & LMS
  "WordPress", "Moodle", "Odoo", "WooCommerce",
  // Server & DevOps
  "Nginx", "Apache", "Docker", "Kubernetes", "Linux",
  // Cloud
  "AWS", "Contabo", "Hostinger", "NameCheap", "Combell",
  // DB
  "MySQL", "PostgreSQL", "MongoDB",
];

const experience = [
  {
    role: "Full-Stack Developer & Server Engineer",
    company: "Freelance / Independent",
    period: "2020 – Present",
    desc: "Building and deploying full-stack web and mobile applications for clients worldwide. Managing server infrastructure on NameCheap, Contabo, Combell, AWS, and Hostinger. Setting up and maintaining Nginx/Apache, Docker containers, and Kubernetes clusters.",
  },
  {
    role: "LMS & WordPress Developer",
    company: "Various Clients",
    period: "2019 – Present",
    desc: "Delivered 20+ LMS platforms using Moodle and Odoo for schools and businesses. Built and customized WordPress and WooCommerce websites with performance-optimized configurations.",
  },
  {
    role: "Mobile Developer",
    company: "Projects & Contracts",
    period: "2021 – Present",
    desc: "Built cross-platform mobile applications using React Native and Flutter. Integrated REST APIs, push notifications, and cloud storage into production mobile apps.",
  },
];

const education = [
  { degree: "Computer Science & Software Engineering", school: "University (DSE)", year: "2024", detail: "Practical assessments in software architecture, system design, and application development." },
  { degree: "Self-taught DevOps & Cloud Engineering", school: "Online / Practice", year: "Ongoing", detail: "Kubernetes, Docker, Nginx, Apache, cloud deployment across multiple providers." },
];

export default function About() {
  return (
    <PageWrapper>
      <Helmet><title>About | Japhet</title></Helmet>

      <div className="pt-28 section-pad">
        <div className="max-w-7xl mx-auto">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <span className="text-accent text-sm font-500 uppercase tracking-widest">Who I am</span>
            <h1 className="font-display text-5xl md:text-6xl font-700 mt-2">About Me</h1>
          </motion.div>

          {/* Bio */}
          <div className="grid md:grid-cols-2 gap-16 items-start mb-24">
           <motion.div
  initial={{ opacity: 0, x: -30 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.2 }}
>
  <div className="relative aspect-square max-w-sm">

    {/* Decorative background ring */}
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/20 to-orange-400/10 border border-accent/20 dark:border-accent/30" />

    {/* Offset decorative block */}
    <div className="absolute -bottom-3 -right-3 w-full h-full rounded-3xl border border-neutral-200 dark:border-neutral-800 -z-10" />

    {/* Photo */}
    <img
      src={profile}
      alt="Japhet Iradukunda"
      className="relative w-full h-full object-cover object-center rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl"
    />

    {/* Availability badge */}
    <div className="absolute -bottom-4 -left-4 flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2.5 rounded-2xl shadow-lg">
      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      <span className="text-xs font-500 text-neutral-700 dark:text-neutral-300">Available for work</span>
    </div>
  </div>
</motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-5">
                I'm Japhet Iradukunda — a full-stack developer and server engineer with a passion for building things that actually work in production, not just in demos.
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-5">
                I work across the entire product lifecycle: from designing and coding React or Flutter interfaces, to setting up the servers, configuring Nginx and Apache, containerizing with Docker, and orchestrating with Kubernetes. My hosting experience spans NameCheap, Contabo, Combell, AWS, and Hostinger.
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-8">
                I also specialize in learning platforms — having built LMS solutions with Moodle and Odoo, and e-commerce and content sites with WordPress. Whether you need a landing page or a full server infrastructure, I deliver it clean and on time.
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
                  <p className="text-xs text-neutral-400 mt-2">{e.detail}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
