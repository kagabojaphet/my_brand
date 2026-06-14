// src/admin/components/blog/BlogModal.jsx
import { useState } from "react";
import { X, Image, Loader2 } from "lucide-react";
import { BASE, TOKEN, CATEGORIES, Field, inputCls } from "./blogApi.jsx";

export default function BlogModal({ blog, onClose, onSaved }) {
  const editing = !!blog;

  const [form, setForm] = useState({
    title:           blog?.title            || "",
    excerpt:         blog?.excerpt          || "",
    content:         blog?.content          || "",
    category:        blog?.category         || "General",
    tags:            blog?.tags?.join(", ") || "",
    author:          blog?.author           || "Japhet",
    metaDescription: blog?.metaDescription  || "",
    featured:        blog?.featured         ?? false,
    published:       blog?.published        ?? false,
    coverImage:      null,
  });
  const [preview,   setPreview]   = useState(blog?.coverImage?.url || "");
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  const [serverErr, setServerErr] = useState("");

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    set("coverImage")(file);
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())   e.title   = "Title is required";
    if (!form.excerpt.trim()) e.excerpt = "Excerpt is required";
    if (!form.content.trim()) e.content = "Content is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setServerErr("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v === null || v === undefined) return;
        // Booleans must be strings for multipart/form-data
        fd.append(k, typeof v === "boolean" ? String(v) : v);
      });

      const url    = editing
        ? `${BASE}/blogs/admin/${blog._id}`
        : `${BASE}/blogs/admin/create`;
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        // FIX: do NOT set Content-Type — browser must set multipart boundary
        headers: { Authorization: `Bearer ${TOKEN()}` },
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);

      onSaved();
    } catch (err) {
      setServerErr(err.message || "Save failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-neutral-200 dark:border-neutral-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <h2 className="font-display text-lg font-700">
            {editing ? "Edit Post" : "New Post"}
          </h2>
          <button onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {serverErr && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
              ⚠ {serverErr}
            </div>
          )}

          <Field label="Title *" error={errors.title}>
            <input value={form.title} onChange={(e) => set("title")(e.target.value)}
              placeholder="Post title" className={inputCls(errors.title)} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select value={form.category} onChange={(e) => set("category")(e.target.value)}
                className={inputCls()}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Author">
              <input value={form.author} onChange={(e) => set("author")(e.target.value)}
                className={inputCls()} />
            </Field>
          </div>

          <Field label="Tags (comma separated)">
            <input value={form.tags} onChange={(e) => set("tags")(e.target.value)}
              placeholder="react, hooks, frontend" className={inputCls()} />
          </Field>

          <Field label="Excerpt *" error={errors.excerpt}>
            <textarea value={form.excerpt} onChange={(e) => set("excerpt")(e.target.value)}
              rows={2} placeholder="Short description shown on card"
              className={`${inputCls(errors.excerpt)} resize-none`} />
          </Field>

          <Field label="Content (HTML) *" error={errors.content}>
            <textarea value={form.content} onChange={(e) => set("content")(e.target.value)}
              rows={12} placeholder="<h2>Introduction</h2><p>Your content here…</p>"
              className={`${inputCls(errors.content)} resize-none font-mono text-xs`} />
          </Field>

          <Field label="Meta Description (SEO · max 160 chars)">
            <input value={form.metaDescription}
              onChange={(e) => set("metaDescription")(e.target.value)}
              maxLength={160} className={inputCls()} />
            <p className="text-xs text-neutral-400 mt-1 text-right">
              {form.metaDescription.length}/160
            </p>
          </Field>

          {/* Cover image */}
          <Field label="Cover Image">
            <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 cursor-pointer hover:border-accent transition-colors">
              <Image size={16} className="text-neutral-400 shrink-0" />
              <span className="text-sm text-neutral-400 truncate">
                {form.coverImage ? form.coverImage.name : "Click to upload image (JPG, PNG, WebP)"}
              </span>
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
            {preview && (
              <div className="mt-3 relative">
                <img src={preview} alt="preview"
                  className="w-full max-h-44 object-cover rounded-xl" />
                <button type="button"
                  onClick={() => { set("coverImage")(null); setPreview(""); }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg hover:bg-black/80 transition-colors">
                  <X size={13} />
                </button>
              </div>
            )}
          </Field>

          {/* Toggles */}
          <div className="flex gap-6">
            {[
              { key: "featured",  label: "Featured"  },
              { key: "published", label: "Published" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer select-none"
                onClick={() => set(key)(!form[key])}>
                <div className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${
                  form[key] ? "bg-accent" : "bg-neutral-300 dark:bg-neutral-700"
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    form[key] ? "translate-x-5" : "translate-x-0"
                  }`} />
                </div>
                <span className="text-sm font-500">{label}</span>
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <button type="submit" disabled={loading}
              className="flex-1 bg-accent hover:bg-accent/90 text-white font-500 py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
              {loading && <Loader2 size={14} className="animate-spin" />}
              {editing ? "Save Changes" : "Create Post"}
            </button>
            <button type="button" onClick={onClose}
              className="px-6 border border-neutral-200 dark:border-neutral-700 text-sm font-500 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}