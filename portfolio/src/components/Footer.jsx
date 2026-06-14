import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Instagram, Facebook, Dribbble, ArrowUp } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];
  
const socials = [
  { icon: Github, href: "https://github.com/kagabojaphet/", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/japhet-iradukunda-81961630a/", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com/JaphetIradukund", label: "Twitter" },
  { icon: Instagram, href: "https://www.instagram.com/iradukunda_japhet/", label: "Instagram"},
  { icon: Facebook, href: "https://web.facebook.com/profile.php?id=61560794400397", label: "Facebook"},
  { icon: Dribbble, href: "https://dribbble.com", label: "Dribbble" },
  
];

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 pt-16 pb-8 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="font-display text-2xl font-700 text-white">
              Japhet <span className="text-accent">Iradukunda</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed">
              Building bold digital experiences — one pixel at a time.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="font-display text-white text-sm font-600 mb-4 uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm hover:text-accent transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-white text-sm font-600 mb-4 uppercase tracking-widest">Find Me</h4>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-800 hover:border-accent hover:text-accent transition-all">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <span>© {new Date().getFullYear()} Japhet Iradukunda. Built with React & Tailwind CSS.</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 hover:text-accent transition-colors">
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
