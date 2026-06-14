import { useEffect, useState } from "react";
import { api } from "../api";
import { Save, Globe } from "lucide-react";

function Field({ label, value, onChange, type = "text", placeholder = "", textarea = false }) {
  return (
    <div>
      <label className="text-xs text-neutral-400 uppercase tracking-widest block mb-1.5">{label}</label>
      {textarea ? (
        <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-accent resize-none transition-colors" />
      ) : (
        <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-accent transition-colors" />
      )}
    </div>
  );
}

export default function AdminBrand() {
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBrand().then((r) => { setForm(r.brand); setLoading(false); }).catch(console.error);
  }, []);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));
  const setSocial = (key) => (val) => setForm((f) => ({ ...f, socials: { ...f.socials, [key]: val } }));
  const setSeo = (key) => (val) => setForm((f) => ({ ...f, seo: { ...f.seo, [key]: val } }));

  const save = async () => {
    try {
      await api.updateBrand(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { alert("Save failed: " + e.message); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-700 text-white">Brand Settings</h1>
          <p className="text-neutral-400 text-sm mt-0.5">Manage your personal brand info</p>
        </div>
        <button onClick={save}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-500 transition-all ${saved ? "bg-green-600 text-white" : "bg-accent hover:bg-accent-dark text-white"}`}>
          <Save size={15} /> {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Identity */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
        <h2 className="font-display font-600 text-white flex items-center gap-2"><Globe size={15} className="text-accent" /> Identity</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Full Name" value={form.name} onChange={set("name")} placeholder="Iradukunda Japhet" />
          <Field label="Tagline" value={form.tagline} onChange={set("tagline")} placeholder="Full-Stack Developer" />
          <Field label="Email" value={form.email} onChange={set("email")} type="email" placeholder="japhet@example.com" />
          <Field label="Phone" value={form.phone} onChange={set("phone")} placeholder="+250 000 000 000" />
          <Field label="Location" value={form.location} onChange={set("location")} placeholder="Kigali, Rwanda" />
        </div>
        <Field label="Bio" value={form.bio} onChange={set("bio")} textarea placeholder="Short description about yourself..." />
        <div>
          <label className="text-xs text-neutral-400 uppercase tracking-widest block mb-1.5">Accent Color</label>
          <div className="flex items-center gap-3">
            <input type="color" value={form.accentColor || "#FF4D00"} onChange={(e) => set("accentColor")(e.target.value)}
              className="w-10 h-10 rounded-lg border border-neutral-700 bg-neutral-800 cursor-pointer" />
            <span className="text-sm text-neutral-400">{form.accentColor}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => set("availability")(!form.availability)}
            className={`relative w-11 h-6 rounded-full transition-colors ${form.availability ? "bg-green-500" : "bg-neutral-700"}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.availability ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
          <span className="text-sm text-neutral-300">Available for new projects</span>
        </div>
        <Field label="Availability Note" value={form.availabilityNote} onChange={set("availabilityNote")} placeholder="Currently available for freelance" />
      </section>

      {/* Socials */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
        <h2 className="font-display font-600 text-white">Social Links</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {["github", "linkedin", "twitter", "dribbble", "website"].map((s) => (
            <Field key={s} label={s.charAt(0).toUpperCase() + s.slice(1)} value={form.socials?.[s]} onChange={setSocial(s)} placeholder={`https://${s}.com/...`} />
          ))}
        </div>
      </section>

      {/* SEO */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
        <h2 className="font-display font-600 text-white">SEO</h2>
        <Field label="Meta Title" value={form.seo?.title} onChange={setSeo("title")} placeholder="Iradukunda Japhet — Full-Stack Developer" />
        <Field label="Meta Description" value={form.seo?.description} onChange={setSeo("description")} textarea placeholder="Brief description for search engines..." />
        <Field label="Keywords" value={form.seo?.keywords} onChange={setSeo("keywords")} placeholder="react, nodejs, docker, web developer" />
      </section>

      <div className="flex justify-end">
        <button onClick={save}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-500 transition-all ${saved ? "bg-green-600 text-white" : "bg-accent hover:bg-accent-dark text-white"}`}>
          <Save size={15} /> {saved ? "Saved!" : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
