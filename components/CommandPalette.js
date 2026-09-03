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
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 bg-slate-50">
          <SearchIcon />
          <input
            type="text"
            autoFocus
            placeholder="Type tool name (e.g. Word to PDF, SHA512, JSON Formatter)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base text-slate-900 bg-transparent outline-none placeholder-slate-400 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-700"
            >
              <XIcon />
            </button>
          )}
          <button
            onClick={() => setOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 text-xs font-semibold px-2 py-1 rounded bg-slate-200/60"
          >
            ESC
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              No matching tools found for "{query}"
            </div>
          ) : (
            filtered.map((t) => (
              <button
                key={t.slug}
                onClick={() => handleSelect(t.slug)}
                className="w-full text-left flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl flex-shrink-0">{t.icon || "🔧"}</span>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 truncate flex items-center gap-1.5">
                      <span>{t.name}</span>
                      {favSlugs.includes(t.slug) && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                          ⭐ Pinned
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 truncate">{t.description}</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 uppercase flex-shrink-0 ml-2">
                  {t.category}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Click any tool to open instantly</span>
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-sans">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
