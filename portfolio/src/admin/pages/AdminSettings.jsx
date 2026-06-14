import { useState } from "react";
import { api } from "../api";
import { Lock, Save } from "lucide-react";

export default function AdminSettings() {
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const changePassword = async () => {
    setMsg(null); setErr(null);
    if (pw.newPassword !== pw.confirm) { setErr("Passwords do not match"); return; }
    if (pw.newPassword.length < 8) { setErr("Password must be at least 8 characters"); return; }
    try {
      await api.changePassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      setMsg("Password changed successfully!");
      setPw({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (e) { setErr(e.message); }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="font-display text-2xl font-700 text-white">Settings</h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-600 text-white flex items-center gap-2">
          <Lock size={15} className="text-accent" /> Change Password
        </h2>
        {[
          { key: "currentPassword", label: "Current Password" },
          { key: "newPassword", label: "New Password" },
          { key: "confirm", label: "Confirm New Password" },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="text-xs text-neutral-400 uppercase tracking-widest block mb-1.5">{label}</label>
            <input type="password" value={pw[key]} onChange={(e) => setPw((p) => ({ ...p, [key]: e.target.value }))}
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-accent transition-colors" />
          </div>
        ))}
        {err && <p className="text-red-400 text-xs bg-red-900/20 px-4 py-2 rounded-lg">{err}</p>}
        {msg && <p className="text-green-400 text-xs bg-green-900/20 px-4 py-2 rounded-lg">{msg}</p>}
        <button onClick={changePassword}
          className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-sm font-500 px-5 py-2.5 rounded-xl transition-colors">
          <Save size={14} /> Update Password
        </button>
      </div>

      {/* API Keys info */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h2 className="font-display font-600 text-white mb-3">Backend API</h2>
        <div className="space-y-2 text-sm">
          {[
            ["Base URL", "http://localhost:5000/api"],
            ["Auth", "POST /auth/login"],
            ["Analytics", "GET /analytics/overview"],
            ["Visitors", "GET /visitors"],
            ["Messages", "GET /contact"],
            ["Brand", "GET /brand · PUT /brand"],
            ["Performance", "GET /performance/summary"],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-3">
              <span className="text-neutral-500 w-28 flex-shrink-0">{k}</span>
              <span className="text-neutral-300 font-mono text-xs">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
