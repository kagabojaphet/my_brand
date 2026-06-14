// src/pages/Contact.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail, Phone, MapPin, Github, Linkedin,
  Twitter, Send, Loader2, Check, Instagram, Facebook
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import PageWrapper from "../components/PageWrapper";

const BASE     = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const SUBJECTS = ["Project Inquiry", "Collaboration", "Job Opportunity", "General Question", "Other"];

const validateForm = ({ name, email, subject, message }) => {
  const e = {};
  if (!name.trim())                               e.name    = "Name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email   = "Valid email required";
  if (!subject)                                   e.subject = "Please select a subject";
  if (!message.trim() || message.length < 20)     e.message = "Message must be at least 20 characters";
  return e;
};

export default function Contact() {
  // ── Brand (overlays fallbacks when loaded) ────────────────────────────
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    fetch(`${BASE}/brand`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setBrand(d.data); })
      .catch(() => {}); // silently fall back to hardcoded values
  }, []);

  // Brand values with hardcoded fallbacks so the left side is always visible
  const email            = brand?.email            || "iradukundajaphet59@gmail.com";
  const phone            = brand?.phone            || "+250 789 862 479";
  const location         = brand?.location         || "Kigali, Rwanda";
  const githubUrl        = brand?.socials?.github   || "https://github.com/kagabojaphet/";
  const linkedinUrl      = brand?.socials?.linkedin || "https://www.linkedin.com/in/japhet-iradukunda-81961630a/";
  const twitterUrl       = brand?.socials?.twitter  || "https://x.com/JaphetIradukund";
  const instagramrUrl       = brand?.socials?.instagram  || "https://www.instagram.com/iradukunda_japhet/";
  const facebookUrl       = brand?.socials?.facebook  || "https://web.facebook.com/profile.php?id=61560794400397";
  const available        = brand?.availability      ?? true;
  const availabilityNote = brand?.availabilityNote  || "Currently accepting freelance and contract work.";

  // ── Form state ────────────────────────────────────────────────────────
  const [form,      setForm]      = useState({ name: "", email: "", subject: "", message: "" });
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  const [sent,      setSent]      = useState(false);
  const [serverErr, setServerErr] = useState("");

  const set = (k) => (v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
    setServerErr("");
  };

  const handleSubmit = async () => {
    const e = validateForm(form);
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    setServerErr("");
    try {
      const res  = await fetch(`${BASE}/contact`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong.");
      setSent(true);
    } catch (err) {
      setServerErr(err.message || "Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Helmet>
        <title>Contact | Japhet</title>
        <meta name="description" content="Get in touch for project inquiries, collaborations, or job opportunities." />
      </Helmet>

      <div className="pt-28 section-pad">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <span className="text-accent text-sm font-500 uppercase tracking-widest">Get in touch</span>
            <h1 className="font-display text-5xl md:text-6xl font-700 mt-2">Let's Work Together</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-4 text-lg max-w-md">
              Have a project in mind? I'd love to hear about it. Send me a message and I'll get back within 24 hours.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16">

            {/* ── LEFT: info (always visible) ────────────────────────── */}
            <div>
              {/* Contact details */}
              <div className="space-y-6 mb-10">
                {[
                  { icon: Mail,   label: "Email",    value: email,    href: `mailto:${email}` },
                  { icon: Phone,  label: "Phone",    value: phone,    href: `tel:${phone}` },
                  { icon: MapPin, label: "Location", value: location, href: null },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-accent/10 rounded-xl flex items-center justify-center">
                      <Icon size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 uppercase tracking-widest">{label}</p>
                      {href ? (
                        <a href={href} className="font-500 hover:text-accent transition-colors">{value}</a>
                      ) : (
                        <p className="font-500">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social icons */}
              <div className="flex gap-3 mb-10">
                {[
                  { icon: Github,   href: githubUrl,   label: "GitHub" },
                  { icon: Linkedin, href: linkedinUrl, label: "LinkedIn" },
                  { icon: Twitter,  href: twitterUrl,  label: "Twitter" },
                  { icon: Instagram, href: instagramrUrl, label: "Instagram"},
                  { icon: Facebook, href: facebookUrl, label: "Facebook"},
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="w-10 h-10 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center hover:border-accent hover:text-accent transition-all"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>

              {/* Availability badge */}
              <div className="p-5 rounded-2xl bg-accent/10 border border-accent/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${available ? "bg-green-400 animate-pulse" : "bg-neutral-400"}`} />
                  <span className="text-sm font-600">
                    {available ? "Available for new projects" : "Currently unavailable"}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{availabilityNote}</p>
              </div>
            </div>

            {/* ── RIGHT: form ───────────────────────────────────────── */}
            <div>
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-10 rounded-3xl border border-accent/30 bg-accent/5"
                >
                  <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-4">
                    <Check size={24} className="text-white" />
                  </div>
                  <h3 className="font-display text-2xl font-700 mb-2">Message Sent!</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm">I'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-6 text-sm text-accent hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-5">

                  {/* Server error banner */}
                  {serverErr && (
                    <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-sm text-red-600 dark:text-red-400">
                      {serverErr}
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-neutral-400 mb-2 block">Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => set("name")(e.target.value)}
                      placeholder="Your full name"
                      className={`w-full px-5 py-3.5 rounded-xl border ${errors.name ? "border-red-400" : "border-neutral-200 dark:border-neutral-800"} bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-accent transition-colors`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-neutral-400 mb-2 block">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email")(e.target.value)}
                      placeholder="your@email.com"
                      className={`w-full px-5 py-3.5 rounded-xl border ${errors.email ? "border-red-400" : "border-neutral-200 dark:border-neutral-800"} bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-accent transition-colors`}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-neutral-400 mb-2 block">Subject</label>
                    <select
                      value={form.subject}
                      onChange={(e) => set("subject")(e.target.value)}
                      className={`w-full px-5 py-3.5 rounded-xl border ${errors.subject ? "border-red-400" : "border-neutral-200 dark:border-neutral-800"} bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-accent transition-colors`}
                    >
                      <option value="">Select a subject</option>
                      {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-neutral-400 mb-2 block">
                      Message
                      <span className="ml-2 normal-case font-400 text-neutral-300 dark:text-neutral-600">
                        ({form.message.length}/5000)
                      </span>
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => set("message")(e.target.value)}
                      rows={5}
                      maxLength={5000}
                      placeholder="Tell me about your project..."
                      className={`w-full px-5 py-3.5 rounded-xl border ${errors.message ? "border-red-400" : "border-neutral-200 dark:border-neutral-800"} bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-accent transition-colors resize-none`}
                    />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-accent hover:bg-accent-dark text-white font-500 py-4 rounded-xl text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-60 disabled:scale-100"
                  >
                    {loading
                      ? <><Loader2 size={15} className="animate-spin" /> Sending…</>
                      : <>Send Message <Send size={15} /></>
                    }
                  </button>

                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </PageWrapper>
  );
}