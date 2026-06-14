import { useEffect, useState } from "react";
import { api } from "../api";
import { Monitor, Smartphone, Tablet, Globe, Chrome } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#FF4D00", "#60a5fa", "#34d399", "#a78bfa", "#f59e0b", "#ec4899"];

const DeviceIcon = ({ d }) => d === "mobile" ? <Smartphone size={13} /> : d === "tablet" ? <Tablet size={13} /> : <Monitor size={13} />;

export default function AdminVisitors() {
  const [summary, setSummary] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [range, setRange] = useState("7d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [s, v, h] = await Promise.all([api.visitorSummary(range), api.visitors({ range, limit: 30 }), api.hourly()]);
        setSummary(s);
        setVisitors(v.visitors);
        setHourly(h.hourly);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, [range]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;

  const ranges = [{ v: "24h", l: "24h" }, { v: "7d", l: "7 days" }, { v: "30d", l: "30 days" }];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-700 text-white">Visitors</h1>
        <div className="flex gap-2">
          {ranges.map((r) => (
            <button key={r.v} onClick={() => setRange(r.v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-500 transition-all ${range === r.v ? "bg-accent text-white" : "bg-neutral-800 text-neutral-400 hover:text-white"}`}>
              {r.l}
            </button>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Devices */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <h3 className="font-display font-600 text-white mb-4">Devices</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={summary?.devices || []} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={60} label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {(summary?.devices || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ background: "#262626", border: "none", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Browsers */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <h3 className="font-display font-600 text-white mb-4">Browsers</h3>
          <div className="space-y-3 mt-2">
            {(summary?.browsers || []).sort((a, b) => b.count - a.count).map((b, i) => {
              const max = Math.max(...(summary?.browsers || []).map((x) => x.count));
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-neutral-400 w-16 truncate">{b._id}</span>
                  <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(b.count / max) * 100}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                  <span className="text-xs text-white w-6 text-right">{b.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* OS */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <h3 className="font-display font-600 text-white mb-4">Operating System</h3>
          <div className="space-y-3 mt-2">
            {(summary?.os || []).sort((a, b) => b.count - a.count).map((o, i) => {
              const max = Math.max(...(summary?.os || []).map((x) => x.count));
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-neutral-400 w-16 truncate">{o._id}</span>
                  <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(o.count / max) * 100}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                  <span className="text-xs text-white w-6 text-right">{o.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hourly traffic */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        <h3 className="font-display font-600 text-white mb-4">Traffic by Hour (last 7 days)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={hourly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
            <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} tick={{ fill: "#737373", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#737373", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#262626", border: "none", borderRadius: 8 }} labelFormatter={(h) => `${h}:00 – ${h + 1}:00`} />
            <Bar dataKey="count" name="Visitors" fill="#FF4D00" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent visitors table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        <h3 className="font-display font-600 text-white mb-4">Recent Sessions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800">
                {["Page", "Device", "Browser", "OS", "Duration", "Bounced", "Time"].map((h) => (
                  <th key={h} className="text-left text-xs text-neutral-500 pb-3 pr-4 font-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visitors.map((v) => (
                <tr key={v._id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                  <td className="py-2.5 pr-4 font-mono text-xs text-neutral-300">{v.page}</td>
                  <td className="py-2.5 pr-4 text-neutral-400"><DeviceIcon d={v.device} /></td>
                  <td className="py-2.5 pr-4 text-neutral-400 text-xs">{v.browser}</td>
                  <td className="py-2.5 pr-4 text-neutral-400 text-xs">{v.os}</td>
                  <td className="py-2.5 pr-4 text-neutral-300 text-xs">{v.duration}s</td>
                  <td className="py-2.5 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${v.bounced ? "bg-red-900/30 text-red-400" : "bg-green-900/30 text-green-400"}`}>
                      {v.bounced ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-2.5 text-neutral-500 text-xs">{new Date(v.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {visitors.length === 0 && <p className="text-center text-neutral-500 text-sm py-8">No visitor data yet — install the tracker on your frontend.</p>}
        </div>
      </div>
    </div>
  );
}
