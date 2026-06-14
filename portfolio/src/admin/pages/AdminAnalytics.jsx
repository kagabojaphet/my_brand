import { useEffect, useState } from "react";
import { api } from "../api";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs">
      <p className="text-neutral-400 mb-1">{label}</p>
      {payload.map((p) => <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
    </div>
  );
};

export default function AdminAnalytics() {
  const [timeseries, setTimeseries] = useState([]);
  const [pages, setPages] = useState([]);
  const [range, setRange] = useState("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [ts, pg] = await Promise.all([api.timeseries(range), api.pages(range)]);
        setTimeseries(ts.timeseries.map((d) => ({ ...d, date: d.date.slice(5) })));
        setPages(pg.pages);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, [range]);

  const ranges = [{ v: "24h", l: "24h" }, { v: "7d", l: "7 days" }, { v: "30d", l: "30 days" }];

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-700 text-white">Analytics</h1>
        <div className="flex gap-2">
          {ranges.map((r) => (
            <button key={r.v} onClick={() => setRange(r.v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-500 transition-all ${range === r.v ? "bg-accent text-white" : "bg-neutral-800 text-neutral-400 hover:text-white"}`}>
              {r.l}
            </button>
          ))}
        </div>
      </div>

      {/* Area chart */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        <h3 className="font-display font-600 text-white mb-5">Total vs Unique Visitors</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={timeseries}>
            <defs>
              <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF4D00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF4D00" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
            <XAxis dataKey="date" tick={{ fill: "#737373", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#737373", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="visitors" name="Total" stroke="#FF4D00" fill="url(#gv)" strokeWidth={2} />
            <Area type="monotone" dataKey="uniqueVisitors" name="Unique" stroke="#60a5fa" fill="url(#gu)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Page views bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        <h3 className="font-display font-600 text-white mb-5">Page Views by Route</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={pages.slice(0, 10)} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#737373", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="page" tick={{ fill: "#a3a3a3", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip contentStyle={{ background: "#262626", border: "none", borderRadius: 8 }} />
            <Bar dataKey="views" name="Views" fill="#FF4D00" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        <h3 className="font-display font-600 text-white mb-4">All Pages</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left text-xs text-neutral-500 pb-3 pr-4 font-500">Page</th>
              <th className="text-left text-xs text-neutral-500 pb-3 pr-4 font-500">Views</th>
              <th className="text-left text-xs text-neutral-500 pb-3 font-500">Avg Load</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p, i) => (
              <tr key={i} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                <td className="py-2.5 pr-4 font-mono text-xs text-neutral-300">{p.page}</td>
                <td className="py-2.5 pr-4 text-white font-500">{p.views}</td>
                <td className="py-2.5 text-neutral-400 text-xs">{p.avgLoad ?? "—"}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
