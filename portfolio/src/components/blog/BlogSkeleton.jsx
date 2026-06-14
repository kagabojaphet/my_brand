// src/components/blog/BlogSkeleton.jsx
// Shown while the blog post is loading.

export default function BlogSkeleton() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse pt-32 px-6 space-y-6">
      <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
      <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
      <div className="h-5 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded" />
      <div className="h-4 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
      <div className="aspect-video w-full bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
      {[...Array(8)].map((_, i) => (
        <div key={i}
          className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded"
          style={{ width: `${60 + (i % 3) * 15}%` }}
        />
      ))}
    </div>
  );
}