// src/admin/pages/AdminBlog.jsx
import { useState, useEffect, useCallback } from "react";
import { Plus, Search, RefreshCw, MessageCircle, Loader2 } from "lucide-react";
import { blogApi } from "../components/blog/blogApi.jsx";
import BlogRow         from "../components/blog/BlogRow";
import BlogModal       from "../components/blog/BlogModal";
import PendingComments from "../components/blog/PendingComments";

export default function AdminBlog() {
  const [blogs,       setBlogs]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [search,      setSearch]      = useState("");
  const [filterPub,   setFilterPub]   = useState("all"); // all | published | draft
  const [modal,       setModal]       = useState(null);  // null | "new" | blog object
  const [pendingOpen, setPendingOpen] = useState(false);
  const [pagination,  setPagination]  = useState({ total: 0, page: 1, pages: 1 });

  const fetchBlogs = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, limit: "10" });
      if (search.trim())       params.set("search",    search.trim());
      if (filterPub !== "all") params.set("published", filterPub === "published" ? "true" : "false");

      const d = await blogApi(`/blogs/admin/all?${params}`);
      setBlogs(d.data || []);
      setPagination(d.pagination || { total: 0, page: 1, pages: 1 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, filterPub]);

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => fetchBlogs(1), search ? 400 : 0);
    return () => clearTimeout(id);
  }, [fetchBlogs, search]);

  const pendingTotal = blogs.reduce(
    (n, b) => n + (b.comments?.filter((c) => !c.approved).length ?? 0), 0
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-700 text-neutral-900 dark:text-white">Blog Posts</h1>
          <p className="text-neutral-400 text-sm mt-1">
            {pagination.total} post{pagination.total !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setPendingOpen(true)}
            className="relative flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 text-sm font-500 px-4 py-2.5 rounded-xl hover:border-accent hover:text-accent transition-colors"
          >
            <MessageCircle size={15} /> Pending
            {pendingTotal > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-700">
                {pendingTotal}
              </span>
            )}
          </button>
          <button
            onClick={() => setModal("new")}
            className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-sm font-500 px-5 py-2.5 rounded-xl transition-colors"
          >
            <Plus size={15} /> New Post
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="flex rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden text-sm">
          {[["all","All"],["published","Live"],["draft","Draft"]].map(([val, label]) => (
            <button key={val} onClick={() => setFilterPub(val)}
              className={`px-4 py-2.5 font-500 transition-colors ${
                filterPub === val
                  ? "bg-accent text-white"
                  : "bg-white dark:bg-neutral-900 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button onClick={() => fetchBlogs(1)}
          className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-accent text-neutral-400 hover:text-accent transition-colors">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-sm text-red-600 dark:text-red-400 flex items-center gap-3">
          <span className="flex-1">{error}</span>
          <button onClick={() => fetchBlogs(1)} className="flex items-center gap-1 hover:underline shrink-0">
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin text-accent" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 text-neutral-400">
          <p className="text-4xl mb-3">📝</p>
          <p className="font-display text-xl font-600 mb-1 text-neutral-900 dark:text-white">No posts yet</p>
          <p className="text-sm">Create your first blog post to get started.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {blogs.map((b) => (
            <BlogRow
              key={b._id}
              blog={b}
              onEdit={(blog) => setModal(blog)}
              onRefresh={() => fetchBlogs(pagination.page)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => fetchBlogs(p)}
              className={`w-9 h-9 rounded-xl text-sm font-500 transition-colors ${
                p === pagination.page
                  ? "bg-accent text-white"
                  : "border border-neutral-200 dark:border-neutral-700 hover:border-accent hover:text-accent"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Modals */}
      {modal && (
        <BlogModal
          blog={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchBlogs(pagination.page); }}
        />
      )}
      {pendingOpen && <PendingComments onClose={() => setPendingOpen(false)} />}
    </div>
  );
}