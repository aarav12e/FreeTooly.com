"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ToolIllustration from "@/components/ToolIllustration";
import { isFavorite, toggleFavorite } from "@/components/FavoritesBar";

function StarIcon({ filled }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill={filled ? "#f59e0b" : "none"}
      stroke={filled ? "#f59e0b" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-150"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

const CATEGORY_STYLES = {
  "pdf-tools": "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30",
  "word-tools": "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30",
  "image-tools": "bg-orange-50 dark:bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-500/30",
  "text-analysis": "bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30",
  editing: "bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30",
  web: "bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-500/30",
  cryptography: "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30",
  "unit-conversion": "bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-500/30",
  "random-generator": "bg-pink-50 dark:bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-500/30",
  programming: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
  converter: "bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30",
  css: "bg-violet-50 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-500/30",
  default: "bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30",
};

export default function ToolCard({ tool }) {
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    setStarred(isFavorite(tool.slug));
    const handleUpdate = () => setStarred(isFavorite(tool.slug));
    window.addEventListener("favsUpdated", handleUpdate);
    return () => window.removeEventListener("favsUpdated", handleUpdate);
  }, [tool.slug]);

  const handleStar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool.slug, tool.name);
  };

  const badgeStyle = CATEGORY_STYLES[tool.category] || CATEGORY_STYLES.default;

  return (
    <div
<<<<<<< HEAD
      className={`group relative bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-full ${
        starred
          ? "border-amber-300 ring-2 ring-amber-400/20"
          : "border-slate-200 hover:border-blue-500"
      }`}
    >
      <Link href={`/tools/${tool.slug}`} className="block flex-1">
        {/* Tool Icon & Badge Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl text-slate-800 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
            {tool.icon || "🔧"}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 capitalize">
              {tool.category?.replace(/-/g, " ")}
            </span>
            <button
              onClick={handleStar}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                starred
                  ? "bg-amber-100 text-amber-500 border border-amber-300"
                  : "bg-slate-50 text-slate-400 hover:text-amber-500 border border-slate-200"
              }`}
              title={starred ? "Remove from favorites" : "Add to favorites"}
            >
              <StarIcon filled={starred} />
            </button>
          </div>
        </div>

        {/* Tool Name Title */}
        <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-1.5 line-clamp-1">
=======
      className={`group relative bg-white dark:bg-[#131d2b] border rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between h-full ${
        starred
          ? "border-amber-300 dark:border-amber-400/50 ring-2 ring-amber-400/30 dark:ring-amber-400/20 hover:border-amber-400 dark:hover:border-amber-400 hover:shadow-amber-500/10"
          : "border-slate-200 dark:border-[#223247] hover:border-blue-500 dark:hover:border-cyan-500/50 hover:shadow-slate-200/80 dark:hover:shadow-cyan-950/40"
      }`}
    >
      <Link href={`/tools/${tool.slug}`} className="block flex-1">
        {/* Differentiation Factor: Picture / Illustration Banner space */}
        <div className="w-full aspect-square rounded-xl overflow-hidden mb-5 border border-slate-100 dark:border-[#202f43] bg-slate-50 dark:bg-[#0c131d] group-hover:scale-[1.02] transition-transform duration-200 relative shadow-inner flex items-center justify-center">
          <ToolIllustration slug={tool.slug} name={tool.name} category={tool.category} />

          {/* Pinned Front Section Badge */}
          {starred && (
            <span className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md tracking-wider">
              <span>⭐</span>
              <span>PINNED</span>
            </span>
          )}

          {/* Star Favorite Button */}
          <button
            onClick={handleStar}
            className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 shadow-sm ${
              starred
                ? "bg-amber-100 dark:bg-amber-400/20 text-amber-500 dark:text-amber-400 border border-amber-300 dark:border-amber-400/40 hover:scale-110"
                : "bg-white/80 dark:bg-black/50 text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-black/70 border border-slate-200 dark:border-white/10"
            }`}
            title={starred ? "Unpin from Front Section" : "Pin to Front Section"}
          >
            <StarIcon filled={starred} />
          </button>
        </div>

        {/* Category Pill */}
        <div className="mb-2.5 flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${badgeStyle} capitalize`}>
            {tool.category?.replace(/-/g, " ")}
          </span>
          {starred && (
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
              <span>•</span>
              <span>Front Section</span>
            </span>
          )}
        </div>

        {/* Tool Name Title */}
        <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors leading-snug mb-2 line-clamp-1">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
          {tool.name}
        </h3>

        {/* Tool Description */}
<<<<<<< HEAD
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
=======
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-4">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
          {tool.description}
        </p>
      </Link>

      {/* Card Action Footer */}
<<<<<<< HEAD
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
=======
      <div className="pt-3 border-t border-slate-100 dark:border-[#1f2e41] flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-cyan-400" />
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
          100% Free
        </span>
        <Link
          href={`/tools/${tool.slug}`}
<<<<<<< HEAD
          className="inline-flex items-center gap-1 font-semibold text-blue-600 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all"
=======
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-blue-600 dark:text-cyan-400 group-hover:text-blue-700 dark:group-hover:text-cyan-300 group-hover:translate-x-1 transition-all"
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
        >
          <span>Use Tool</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
