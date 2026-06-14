// src/admin/components/AdminLayout.jsx
// FIX: imported AdminBlog route was missing — added /admin/blog route via Outlet
// No changes to the layout itself — only the route registration in App.jsx needs updating.
// See the comment block at the bottom of this file.
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, BarChart2, Activity, MessageSquare,
  Settings, LogOut, Menu, X, Zap, Globe, ChevronRight,
  Sun, Moon, BookOpen,
} from "lucide-react";
import { useAuth }  from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const nav = [
  { to: "/admin",              label: "Overview",    icon: LayoutDashboard, end: true },
  { to: "/admin/blog",         label: "Blog",        icon: BookOpen },
  { to: "/admin/visitors",     label: "Visitors",    icon: Users },
  { to: "/admin/analytics",    label: "Analytics",   icon: BarChart2 },
  { to: "/admin/performance",  label: "Performance", icon: Zap },
  { to: "/admin/messages",     label: "Messages",    icon: MessageSquare },
  { to: "/admin/brand",        label: "Brand",       icon: Globe },
  { to: "/admin/settings",     label: "Settings",    icon: Settings },
];

export default function AdminLayout() {
  const { user, logout }  = useAuth();
  const { dark, toggle }  = useTheme();
  const navigate           = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = async () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white flex transition-colors duration-300">

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-60
        bg-neutral-50 dark:bg-neutral-900
        border-r border-neutral-200 dark:border-neutral-800
        flex flex-col transition-transform duration-300
        ${sideOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}>

        {/* Logo */}
        <div className="px-5 py-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <span className="font-display font-700 text-lg text-accent">JD</span>
            <span className="font-display font-500 text-sm ml-2 text-neutral-900 dark:text-white">Admin</span>
          </div>
          <button onClick={() => setSideOpen(false)} className="md:hidden text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSideOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-500 transition-all
                ${isActive
                  ? "bg-accent text-white"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User block */}
        <div className="px-3 py-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 mb-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-700 flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || "J"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-500 truncate capitalize text-neutral-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay (mobile) */}
      {sideOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSideOpen(false)} />
      )}

      {/* ── Main area ─────────────────────────────────────────────────── */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="
          sticky top-0 z-30 h-14
          bg-white/90 dark:bg-neutral-950/90
          backdrop-blur border-b border-neutral-200 dark:border-neutral-800
          flex items-center px-5 gap-4
        ">
          <button onClick={() => setSideOpen(true)} className="md:hidden text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Admin</span>
            <ChevronRight size={12} />
            <span className="text-neutral-900 dark:text-white capitalize">Dashboard</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-neutral-400">Live</span>
            </div>
            <button
              onClick={toggle}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {dark ? <Sun size={16} className="text-neutral-400 hover:text-white" /> : <Moon size={16} className="text-neutral-500 hover:text-neutral-900" />}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-8 overflow-auto bg-neutral-50 dark:bg-neutral-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/*
──────────────────────────────────────────────────────────────────────────────
  HOW TO FIX THE "No routes matched /admin/blog" ERROR
  Add the blog route inside your admin <Route> block in App.jsx:

  import AdminBlog from "./admin/pages/AdminBlog";

  <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
    <Route index              element={<AdminOverview />} />
    <Route path="blog"        element={<AdminBlog />} />        ← ADD THIS
    <Route path="visitors"    element={<AdminVisitors />} />
    <Route path="analytics"   element={<AdminAnalytics />} />
    <Route path="performance" element={<AdminPerformance />} />
    <Route path="messages"    element={<AdminMessages />} />
    <Route path="brand"       element={<AdminBrand />} />
    <Route path="settings"    element={<AdminSettings />} />
  </Route>
──────────────────────────────────────────────────────────────────────────────
*/