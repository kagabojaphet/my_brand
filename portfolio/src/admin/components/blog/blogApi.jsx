// src/admin/components/blog/blogApi.jsx
export const BASE  = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
export const TOKEN = () => localStorage.getItem("admin_token") || "";

export const CATEGORIES = ["React", "Design", "Career", "Tutorials", "Node.js", "DevOps", "General"];

export async function blogApi(path, options = {}) {
  const { headers: extraHeaders, ...rest } = options;
  const res  = await fetch(`${BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${TOKEN()}`,
      ...extraHeaders,
    },
    ...rest,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

// Reusable field wrapper — JSX requires .jsx extension
export function Field({ label, error, children }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-500 text-neutral-400 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

export const inputCls = (err = false) =>
  `w-full px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border ${
    err ? "border-red-400" : "border-neutral-200 dark:border-neutral-700"
  } text-sm focus:outline-none focus:border-accent transition-colors`;