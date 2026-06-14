import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Moon, Sun, Menu, X, LogIn, LogOut, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/education", label: "education" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const { user, logout, setShowLogin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

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
          <Link to="/" className="font-display font-700 text-xl tracking-tight flex items-center gap-2">
            <span className="text-gradient">JI</span>
            <span className="text-neutral-900 dark:text-white">Japhet</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === "/"}
                  className={({ isActive }) =>
                    `text-sm font-500 transition-colors duration-200 ${isActive ? "text-accent" : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"}`
                  }>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="relative hidden md:block">
                <button onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 hover:border-accent transition-all">
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-700">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-500 capitalize">{user.name}</span>
                  <ChevronDown size={14} className={`transition-transform ${userMenu ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                        <p className="text-xs text-neutral-400">Signed in as</p>
                        <p className="text-sm font-500 truncate">{user.email}</p>
                      </div>
                      <button onClick={() => { logout(); setUserMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)}
                className="hidden md:inline-flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 hover:border-accent text-neutral-700 dark:text-neutral-300 hover:text-accent text-sm font-500 px-4 py-2 rounded-full transition-all">
                <LogIn size={14} /> Login
              </button>
            )}

            <Link to="/contact"
              className="hidden md:inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-sm font-500 px-5 py-2 rounded-full transition-colors duration-200">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-surface-light dark:bg-surface-dark flex flex-col">
            <div className="flex items-center justify-between px-6 py-5">
              <span className="font-display font-700 text-xl text-gradient">JD</span>
              <button onClick={() => setOpen(false)}><X size={24} /></button>
            </div>
            <ul className="flex flex-col gap-2 px-6 mt-8">
              {links.map((l, i) => (
                <motion.li key={l.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <NavLink to={l.to} onClick={() => setOpen(false)}
                    className="block font-display text-3xl font-600 py-2 hover:text-accent transition-colors">
                    {l.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
            <div className="px-6 mt-8 flex flex-col gap-3">
              {user ? (
                <button onClick={() => { logout(); setOpen(false); }}
                  className="inline-flex items-center gap-2 text-red-500 font-500 text-base">
                  <LogOut size={16} /> Sign Out
                </button>
              ) : (
                <button onClick={() => { setShowLogin(true); setOpen(false); }}
                  className="inline-flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 text-sm font-500 px-6 py-3 rounded-full w-fit">
                  <LogIn size={14} /> Login
                </button>
              )}
              <Link to="/contact" onClick={() => setOpen(false)}
                className="inline-flex bg-accent text-white text-base font-500 px-8 py-3 rounded-full w-fit">
                Hire Me →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
