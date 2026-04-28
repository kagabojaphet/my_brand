import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3 bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-neutral-200/50 dark:border-neutral-800/50 shadow-sm" : "py-5 bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-display font-700 text-xl tracking-tight">
            <span className="text-gradient">JI</span>
            <span className="ml-2 text-neutral-900 dark:text-white">Japhet Iradukunda  </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `text-sm font-body font-500 transition-colors duration-200 ${isActive ? "text-accent" : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"}`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/contact" className="hidden md:inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-sm font-500 px-5 py-2 rounded-full transition-colors duration-200">
              Hire Me
            </Link>
            <button onClick={() => setOpen(true)} className="md:hidden p-2">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-surface-light dark:bg-surface-dark flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="font-display font-700 text-xl text-gradient">JD</span>
              <button onClick={() => setOpen(false)}><X size={24} /></button>
            </div>
            <ul className="flex flex-col gap-2 px-6 mt-8">
              {links.map((l, i) => (
                <motion.li key={l.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <NavLink
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block font-display text-3xl font-600 py-2 hover:text-accent transition-colors"
                  >
                    {l.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
            <div className="px-6 mt-8">
              <Link to="/contact" onClick={() => setOpen(false)} className="inline-flex bg-accent text-white text-base font-500 px-8 py-3 rounded-full">
                Hire Me →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
