// src/admin/pages/AdminOverview.jsx
import { useEffect, useState, useCallback } from "react";
import { api } from "../api";
import {
  Users, Eye, TrendingUp, TrendingDown,
  MessageSquare, Activity, Clock, MousePointer,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, change, icon: Icon, color = "accent", suffix = "" }) {
  const up = change >= 0;

  const iconBg = {
    accent: "bg-orange-500/10",
    green:  "bg-green-500/10",
    blue:   "bg-blue-500/10",
    purple: "bg-purple-500/10",
  }[color] || "bg-orange-500/10";

  const iconColor = {
    accent: "text-orange-400",
    green:  "text-green-400",
    blue:   "text-blue-400",
    purple: "text-purple-400",
  }[color] || "text-orange-400";

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={18} className={iconColor} />
        </div>
        {change !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-500 px-2 py-1 rounded-full ${up ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"}`}>
            {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <div className="font-display text-3xl font-700 text-neutral-900 dark:text-white">
        {value}{suffix}
      </div>
      <div className="text-xs text-neutral-500 mt-1">{label}</div>
    </div>
  );
}

// ── Chart tooltip ──────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs shadow-lg">
      <p className="text-neutral-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function AdminOverview() {
  const [overview,   setOverview]   = useState(null);
  const [timeseries, setTimeseries] = useState([]);
  const [topPages,   setTopPages]   = useState([]);
  const [realtime,   setRealtime]   = useState({ activeVisitors: 0, recentPages: [] });
  const [range,      setRange]      = useState("30d");
  const [loading,    setLoading]    = useState(true);

  const load = useCallback(async () => {
    try {
      const [ov, ts, pg, rt] = await Promise.all([
        api.overview(range),
        api.timeseries(range),
        api.pages(range),
        api.realtime(),
      ]);
      setOverview(ov.overview);
      setTimeseries((ts.timeseries || []).map((d) => ({ ...d, date: d.date.slice(5) })));
      setTopPages((pg.pages || []).slice(0, 8));
      setRealtime(rt);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    load();
    const t = setInterval(() => {
      api.realtime().then((r) => setRealtime(r)).catch(() => {});
    }, 30000);
    return () => clearInterval(t);
  }, [load]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const ranges = [
    { v: "24h", l: "24h" },
    { v: "7d",  l: "7 days" },
    { v: "30d", l: "30 days" },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-700 text-neutral-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-0.5">
            Welcome back, Japhet 👋
          </p>
        </div>
        <div className="flex gap-2">
          {ranges.map((r) => (
            <button
              key={r.v}
              onClick={() => setRange(r.v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-500 transition-all ${
                range === r.v
                  ? "bg-accent text-white"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {r.l}
            </button>
          ))}
        </div>
      </div>

      {/* Realtime strip */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-5 py-3 flex items-center gap-6 transition-colors">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-neutral-500 dark:text-neutral-400">Active right now:</span>
          <span className="font-display text-xl font-700 text-neutral-900 dark:text-white">
            {realtime.activeVisitors ?? 0}
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto">
          {(realtime.recentPages || []).slice(0, 5).map((p, i) => (
            <span
              key={i}
              className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 px-3 py-1 rounded-full whitespace-nowrap"
            >
              {p.page}
            </span>
          ))}
        </div>
      </div>

      {/* KPI row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Visitors"  value={overview?.totalVisitors?.toLocaleString()  || 0} change={overview?.visitorChange}  icon={Users}        color="accent" />
        <StatCard label="Unique Visitors" value={overview?.uniqueVisitors?.toLocaleString() || 0} change={overview?.uniqueChange}   icon={Eye}          color="blue"   />
        <StatCard label="Page Views"      value={overview?.totalPageViews?.toLocaleString() || 0} change={overview?.pageViewChange} icon={Activity}     color="green"  />
        <StatCard label="Messages"        value={overview?.totalMessages  || 0}                                                     icon={MessageSquare} color="purple" />
      </div>

      {/* KPI row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Bounce Rate"     value={overview?.bounceRate  || 0} suffix="%" icon={MousePointer}  color="accent" />
        <StatCard label="Avg. Session"    value={overview?.avgDuration || 0} suffix="s" icon={Clock}         color="blue"   />
        <StatCard label="Unread Messages" value={overview?.unreadMessages || 0}          icon={MessageSquare} color="purple" />
        <StatCard label="Active Pages"    value={topPages.length}                        icon={Activity}      color="green"  />
      </div>

      {/* Visitor trend chart */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 transition-colors">
        <h3 className="font-display font-600 text-neutral-900 dark:text-white mb-5">
          Visitor Trend
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={timeseries}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-neutral-800" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="visitors"      name="Visitors" stroke="#FF4D00" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="uniqueVisitors" name="Unique"  stroke="#60a5fa" strokeWidth={2}   dot={false} strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top pages */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 transition-colors">
        <h3 className="font-display font-600 text-neutral-900 dark:text-white mb-4">
          Top Pages
        </h3>
        {topPages.length === 0 ? (
          <p className="text-sm text-neutral-400 text-center py-6">No page data yet.</p>
        ) : (
          <div className="space-y-3">
            {topPages.map((p, i) => {
              const max = topPages[0]?.views || 1;
              return (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-xs text-neutral-400 w-4">{i + 1}</span>
                  <span className="text-sm text-neutral-600 dark:text-neutral-300 w-24 truncate font-mono">
                    {p.page}
                  </span>
                  <div className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all"
                      style={{ width: `${(p.views / max) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-neutral-900 dark:text-white font-500 w-12 text-right">
                    {p.views}
                  </span>
                  <span className="text-xs text-neutral-400 w-16 text-right">
                    {p.avgLoad}ms
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}