import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Send } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PageWrapper from "../components/PageWrapper";

const subjects = ["Project Inquiry", "Collaboration", "Job Opportunity", "General Question", "Other"];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!form.subject) e.subject = "Please select a subject";
    if (!form.message.trim() || form.message.length < 20) e.message = "Message must be at least 20 characters";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSent(true);
  };

  const set = (k) => (v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  return (
    <PageWrapper>
      <Helmet><title>Contact — John Doe</title></Helmet>

      <div className="pt-28 section-pad">
        <div className="max-w-7xl mx-auto">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <span className="text-accent text-sm font-500 uppercase tracking-widest">Get in touch</span>
            <h1 className="font-display text-5xl md:text-6xl font-700 mt-2">Let's Work Together</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-4 text-lg max-w-md">
              Have a project in mind? I'd love to hear about it. Send me a message and I'll get back within 24 hours.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Info */}
            <div>
              <div className="space-y-6 mb-10">
                {[
                  { icon: Mail, label: "Email", value: "hello@johndoe.com" },
                  { icon: Phone, label: "Phone", value: "+1 (555) 000-1234" },
                  { icon: MapPin, label: "Location", value: "New York, USA" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-accent/10 rounded-xl flex items-center justify-center">
                      <Icon size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 uppercase tracking-widest">{label}</p>
                      <p className="font-500">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mb-10">
                {[
                  { icon: Github, href: "https://github.com" },
                  { icon: Linkedin, href: "https://linkedin.com" },
                  { icon: Twitter, href: "https://twitter.com" },
                ].map(({ icon: Icon, href }) => (
                  <a key={href} href={href} target="_blank" rel="noreferrer"
                    className="w-10 h-10 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center hover:border-accent hover:text-accent transition-all">
                    <Icon size={16} />
                  </a>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-accent/10 border border-accent/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-600">Available for new projects</span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Currently accepting freelance and contract work.</p>
              </div>
            </div>

            {/* Form */}
            <div>
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-10 rounded-3xl border border-accent/30 bg-accent/5">
                  <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-4">
                    <Send size={24} className="text-white" />
                  </div>
                  <h3 className="font-display text-2xl font-700 mb-2">Message Sent!</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm">I'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-neutral-400 mb-2 block">Name</label>
                    <input value={form.name} onChange={(e) => set("name")(e.target.value)} placeholder="Your full name"
                      className={`w-full px-5 py-3.5 rounded-xl border ${errors.name ? "border-red-400" : "border-neutral-200 dark:border-neutral-800"} bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-accent transition-colors`} />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  {/* Email */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-neutral-400 mb-2 block">Email</label>
                    <input value={form.email} onChange={(e) => set("email")(e.target.value)} placeholder="your@email.com" type="email"
                      className={`w-full px-5 py-3.5 rounded-xl border ${errors.email ? "border-red-400" : "border-neutral-200 dark:border-neutral-800"} bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-accent transition-colors`} />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                  {/* Subject */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-neutral-400 mb-2 block">Subject</label>
                    <select value={form.subject} onChange={(e) => set("subject")(e.target.value)}
                      className={`w-full px-5 py-3.5 rounded-xl border ${errors.subject ? "border-red-400" : "border-neutral-200 dark:border-neutral-800"} bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-accent transition-colors`}>
                      <option value="">Select a subject</option>
                      {subjects.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                  </div>
                  {/* Message */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-neutral-400 mb-2 block">Message</label>
                    <textarea value={form.message} onChange={(e) => set("message")(e.target.value)} rows={5} placeholder="Tell me about your project..."
                      className={`w-full px-5 py-3.5 rounded-xl border ${errors.message ? "border-red-400" : "border-neutral-200 dark:border-neutral-800"} bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-accent transition-colors resize-none`} />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                  </div>
                  <button onClick={handleSubmit}
                    className="w-full bg-accent hover:bg-accent-dark text-white font-500 py-4 rounded-xl text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                    Send Message <Send size={15} />
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
