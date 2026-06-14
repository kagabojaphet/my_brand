// src/components/blog/ShareBar.jsx
// Copy-link + social share buttons.
// Props:
//   blog     — the full blog object (needs .title, .slug)
//   onShare  — callback fired after share count is incremented

import { useState } from "react";
import { Link2, Check, Twitter, Facebook, Linkedin } from "lucide-react";

export default function ShareBar({ blog, onShare }) {
  const [copied, setCopied] = useState(false);

  const pageUrl   = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(blog?.title || "Check this out");
  const shareUrl  = encodeURIComponent(pageUrl);

  const shareLinks = [
    {
      label: "Twitter",
      icon:  Twitter,
      href:  `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
    },
    {
      label: "Facebook",
      icon:  Facebook,
      href:  `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    },
    {
      label: "LinkedIn",
      icon:  Linkedin,
      href:  `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShare?.();
    } catch (_) {}
  };

  return (
    <div className="flex items-center gap-2">
      {/* Copy link */}
      <button
        onClick={handleCopy}
        title="Copy link"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-xs font-500 hover:border-accent hover:text-accent transition-colors"
      >
        {copied
          ? <><Check size={12} className="text-green-500" /> Copied!</>
          : <><Link2 size={12} /> Copy link</>}
      </button>

      {/* Social icons */}
      {shareLinks.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={`Share on ${label}`}
          onClick={() => onShare?.()}
          className="p-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-400 hover:border-accent hover:text-accent transition-colors"
        >
          <Icon size={13} />
        </a>
      ))}
    </div>
  );
}