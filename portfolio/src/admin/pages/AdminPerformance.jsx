import { useEffect, useState } from "react";
import { api } from "../api";
import { Zap, CheckCircle, AlertCircle, XCircle } from "lucide-react";

function score(metric, value) {
  if (metric === "lcp") return value <= 2500 ? "good" : value <= 4000 ? "needs" : "poor";
  if (metric === "fid") return value <= 100 ? "good" : value <= 300 ? "needs" : "poor";
  if (metric === "cls") return value <= 0.1 ? "good" : value <= 0.25 ? "needs" : "poor";
  if (metric === "ttfb") return value <= 800 ? "good" : value <= 1800 ? "needs" : "poor";
  if (metric === "fcp") return value <= 1800 ? "good" : value <= 3000 ? "needs" : "poor";
  return "good";
}

const ScoreIcon = ({ s }) =>
  s === "good" ? <CheckCircle size={14} className="text-green-400" /> :
  s === "needs" ? <AlertCircle size={14} className="text-yellow-400" /> :
  <XCircle size={14} className="text-red-400" />;

const scoreBg = { good: "bg-green-900/30 text-green-400", needs: "bg-yellow-900/30 text-yellow-400", poor: "bg-red-900/30 text-red-400" };

function VitalCard({ label, value, metric, unit = "ms", threshold }) {
  const s = score(metric, value);
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-neutral-400 uppercase tracking-widest">{label}</span>
        <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-500 ${scoreBg[s]}`}>
          <ScoreIcon s={s} /> {s === "good" ? "Good" : s === "needs" ? "Improve" : "Poor"}
        </span>
      </div>
      <div className="font-display text-3xl font-700 text-white">{value ?? "—"}<span className="text-base text-neutral-400 ml-1">{unit}</span></div>
      <div className="text-xs text-neutral-500 mt-2">{threshold}</div>
    </div>
  );
}

export default function AdminPerformance() {
  const [data, setData] = useState(null);
  const [range, setRange] = useState("7d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { const r = await api.perfSummary(range); setData(r); }
      catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, [range]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;

  const ov = data?.overall || {};
  const ranges = [{ v: "24h", l: "24h" }, { v: "7d", l: "7 days" }, { v: "30d", l: "30 days" }];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-700 text-white">Performance</h1>
          <p className="text-neutral-400 text-sm mt-0.5">Core Web Vitals across all pages</p>
        </div>
        <div className="flex gap-2">
          {ranges.map((r) => (
            <button key={r.v} onClick={() => setRange(r.v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-500 transition-all ${range === r.v ? "bg-accent text-white" : "bg-neutral-800 text-neutral-400 hover:text-white"}`}>
              {r.l}
            </button>
          ))}
        </div>
      </div>

      {/* Overall vitals */}
      <div>
        <h2 className="text-sm text-neutral-400 uppercase tracking-widest mb-4">Site-wide averages</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <VitalCard label="LCP" value={ov.avgLCP} metric="lcp" threshold="Good: ≤ 2500ms" />
          <VitalCard label="FID" value={ov.avgFID} metric="fid" threshold="Good: ≤ 100ms" />
          <VitalCard label="CLS" value={ov.avgCLS} metric="cls" unit="" threshold="Good: ≤ 0.1" />
          <VitalCard label="TTFB" value={ov.avgTTFB} metric="ttfb" threshold="Good: ≤ 800ms" />
          <VitalCard label="FCP" value={ov.avgFCP} metric="fcp" threshold="Good: ≤ 1800ms" />
        </div>
      </div>

      {/* Per-page table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        <h3 className="font-display font-600 text-white mb-4">Per-page Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800">
                {["Page", "LCP", "FID", "CLS", "TTFB", "FCP", "Avg Load", "Samples"].map((h) => (
                  <th key={h} className="text-left text-xs text-neutral-500 pb-3 pr-4 font-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data?.summary || []).map((p, i) => (
                <tr key={i} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                  <td className="py-2.5 pr-4 font-mono text-xs text-neutral-300">{p.page}</td>
                  {[
                    { v: p.avgLCP, m: "lcp" }, { v: p.avgFID, m: "fid" },
                    { v: p.avgCLS, m: "cls" }, { v: p.avgTTFB, m: "ttfb" }, { v: p.avgFCP, m: "fcp" },
                  ].map(({ v, m }) => (
                    <td key={m} className="py-2.5 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${scoreBg[score(m, v)]}`}>{v ?? "—"}</span>
                    </td>
                  ))}
                  <td className="py-2.5 pr-4 text-neutral-300 text-xs">{p.avgLoad}ms</td>
                  <td className="py-2.5 text-neutral-500 text-xs">{p.samples}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data?.summary?.length && (
            <p className="text-center text-neutral-500 text-sm py-8">No performance data yet. Add the performance tracker to your frontend.</p>
          )}
        </div>
      </div>

      {/* How to track */}
      <div className="bg-neutral-900 border border-accent/30 rounded-2xl p-5">
        <h3 className="font-display font-600 text-white mb-3 flex items-center gap-2"><Zap size={16} className="text-accent" /> How to send performance data</h3>
        <p className="text-sm text-neutral-400 mb-3">Add this to your React app's main entry point:</p>
        <pre className="text-xs bg-neutral-950 rounded-xl p-4 overflow-x-auto text-green-400">
{`import { api } from './admin/api';

// After page load
window.addEventListener('load', () => {
  const nav = performance.getEntriesByType('navigation')[0];
  api.trackPerf({
    page: window.location.pathname,
    loadTime: Math.round(nav.loadEventEnd - nav.startTime),
    ttfb: Math.round(nav.responseStart - nav.requestStart),
    fcp: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0),
    device: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
  });
});`}
        </pre>
      </div>
    </div>
  );
}
