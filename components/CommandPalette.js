"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { tools } from "@/lib/tools-registry";

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [favSlugs, setFavSlugs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadFavs = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("freetooly_favs") || "[]");
        setFavSlugs(stored);
      } catch (e) {
        setFavSlugs([]);
      }
    };
    loadFavs();
    window.addEventListener("favsUpdated", loadFavs);
    return () => window.removeEventListener("favsUpdated", loadFavs);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    const handleOpenCommandPalette = () => {
      setOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("openCommandPalette", handleOpenCommandPalette);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("openCommandPalette", handleOpenCommandPalette);
    };
  }, [open]);

  const filtered = useMemo(() => {
    let pool = tools;
    if (query.trim()) {
      pool = tools.filter((t) =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    // Sort pool so pinned / front-section tools are at the top
    return [...pool]
      .sort((a, b) => {
        const aFav = favSlugs.includes(a.slug);
        const bFav = favSlugs.includes(b.slug);
        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;
        if (aFav && bFav) {
          return favSlugs.indexOf(a.slug) - favSlugs.indexOf(b.slug);
        }
        return 0;
      })
      .slice(0, 12);
  }, [query, favSlugs]);

  const handleSelect = (slug) => {
    setOpen(false);
    setQuery("");
    router.push(`/tools/${slug}`);
  };

  if (!open) return null;

  return (
    <div
<<<<<<< HEAD
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 bg-slate-50">
=======
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-white dark:bg-[#121c29] border border-slate-200 dark:border-[#223348] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-[#1f2d3d] bg-slate-50/50 dark:bg-[#0d141f]">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
          <SearchIcon />
          <input
            type="text"
            autoFocus
            placeholder="Type tool name (e.g. Word to PDF, SHA512, JSON Formatter)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
<<<<<<< HEAD
            className="w-full text-base text-slate-900 bg-transparent outline-none placeholder-slate-400 font-medium"
=======
            className="w-full text-base text-slate-900 dark:text-white bg-transparent outline-none placeholder-slate-400"
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
          />
          {query && (
            <button
              onClick={() => setQuery("")}
<<<<<<< HEAD
              className="p-1 text-slate-400 hover:text-slate-700"
=======
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
            >
              <XIcon />
            </button>
          )}
          <button
            onClick={() => setOpen(false)}
<<<<<<< HEAD
            className="p-1 text-slate-400 hover:text-slate-700 text-xs font-semibold px-2 py-1 rounded bg-slate-200/60"
=======
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-semibold px-2 py-1 rounded bg-slate-200/60 dark:bg-[#1e2a3b]"
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
          >
            ESC
          </button>
        </div>

        {/* Results list */}
<<<<<<< HEAD
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-100">
=======
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-[#1a2636]">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              No matching tools found for "{query}"
            </div>
          ) : (
            filtered.map((t) => (
              <button
                key={t.slug}
                onClick={() => handleSelect(t.slug)}
<<<<<<< HEAD
                className="w-full text-left flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition-colors group cursor-pointer"
=======
                className="w-full text-left flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-cyan-500/15 transition-colors group cursor-pointer"
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl flex-shrink-0">{t.icon || "🔧"}</span>
                  <div className="min-w-0">
<<<<<<< HEAD
                    <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 truncate flex items-center gap-1.5">
                      <span>{t.name}</span>
                      {favSlugs.includes(t.slug) && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
=======
                    <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 truncate flex items-center gap-1.5">
                      <span>{t.name}</span>
                      {favSlugs.includes(t.slug) && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-400/40">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                          ⭐ Pinned
                        </span>
                      )}
                    </div>
<<<<<<< HEAD
                    <div className="text-xs text-slate-500 truncate">{t.description}</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 uppercase flex-shrink-0 ml-2">
=======
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{t.description}</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#1a2738] text-slate-600 dark:text-cyan-300 uppercase flex-shrink-0 ml-2">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                  {t.category}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
<<<<<<< HEAD
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Click any tool to open instantly</span>
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-sans">Esc</kbd> to close</span>
=======
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#0c131d] border-t border-slate-100 dark:border-[#1f2d3d] flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Click any tool to open instantly</span>
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#1c293a] border border-slate-200 dark:border-[#2b3d52] font-sans">Esc</kbd> to close</span>
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
        </div>
      </div>
    </div>
  );
}
