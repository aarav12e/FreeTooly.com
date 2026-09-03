"use client";

import { useEffect, useState } from "react";
import { recordRecentTool, isFavorite, toggleFavorite } from "@/components/FavoritesBar";

function StarIcon({ filled }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "#f59e0b" : "none"}
      stroke={filled ? "#f59e0b" : "currentColor"}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-150"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function ToolPageTracker({ slug, name }) {
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    // Record into recently viewed
    recordRecentTool(slug);

    // Initial favorite check
    setStarred(isFavorite(slug));

    const handleFavsUpdate = () => {
      setStarred(isFavorite(slug));
    };

    window.addEventListener("favsUpdated", handleFavsUpdate);
    return () => window.removeEventListener("favsUpdated", handleFavsUpdate);
  }, [slug]);

  const handleToggle = () => {
    toggleFavorite(slug, name);
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
        starred
          ? "bg-amber-100 dark:bg-amber-400/20 border-amber-300 dark:border-amber-400/40 text-amber-900 dark:text-amber-300 shadow-amber-500/10"
          : "bg-slate-100 dark:bg-[#192738] border-slate-200 dark:border-[#2b3e56] text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-300 hover:border-amber-300"
      }`}
      title={starred ? "Unpin from Front Section" : "Pin to Front Section"}
    >
      <StarIcon filled={starred} />
      <span>{starred ? "⭐ Pinned to Front Section" : "☆ Pin to Front Section"}</span>
    </button>
  );
}
