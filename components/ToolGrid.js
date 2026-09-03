"use client";

import { useMemo, useState, useEffect } from "react";
import ToolCard from "@/components/ToolCard";
import { categories, categoryLabels } from "@/lib/tools-registry";

const INITIAL_COUNT = 24;
const LOAD_MORE_COUNT = 24;

export default function ToolGrid({ tools }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [favSlugs, setFavSlugs] = useState([]);

  // Load and listen for favorites
  useEffect(() => {
    const loadFavs = () => {
      const stored = JSON.parse(localStorage.getItem("freetooly_favs") || "[]");
      setFavSlugs(stored);
    };
    loadFavs();
    window.addEventListener("favsUpdated", loadFavs);
    return () => window.removeEventListener("favsUpdated", loadFavs);
  }, []);

  // Listen for category & query change events from hero search bar & header
  useEffect(() => {
    const handleSetCategory = (e) => {
      setCategory(e.detail);
    };
    const handleSetQuery = (e) => {
      setQuery(e.detail);
    };
    window.addEventListener("setCategory", handleSetCategory);
    window.addEventListener("setQuery", handleSetQuery);
    return () => {
      window.removeEventListener("setCategory", handleSetCategory);
      window.removeEventListener("setQuery", handleSetQuery);
    };
  }, []);

  const favTools = useMemo(() => {
    return favSlugs
      .map((slug) => tools.find((t) => t.slug === slug))
      .filter(Boolean);
  }, [tools, favSlugs]);

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      let matchesCategory = false;
      if (category === "all") {
        matchesCategory = true;
      } else if (category === "favorites") {
        matchesCategory = favSlugs.includes(t.slug);
      } else {
        matchesCategory = t.category === category;
      }

      const matchesQuery =
        query.trim() === "" ||
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [tools, query, category, favSlugs]);

  // Sort filtered so that starred / pinned tools always appear first at the FRONT
  const sortedFiltered = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aFav = favSlugs.includes(a.slug);
      const bFav = favSlugs.includes(b.slug);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      if (aFav && bFav) {
        return favSlugs.indexOf(a.slug) - favSlugs.indexOf(b.slug);
      }
      return 0;
    });
  }, [filtered, favSlugs]);

  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [query, category]);

  const visibleTools = sortedFiltered.slice(0, visibleCount);

  const clearSearch = () => {
    setQuery("");
    setCategory("all");
  };

  return (
    <div id="tools" className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
          <span>✨ Browser Utility Suite</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Browse All Available Tools
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
          Search or filter by category to quickly locate the exact online tool you need.
        </p>
      </div>

      {/* Categories Navigation Pills */}
      <div className="space-y-4">
        <div id="categories" className="flex flex-wrap items-center justify-center gap-2 px-1 max-w-5xl mx-auto">
          {/* Starred Favorites Filter Tab */}
          <button
            onClick={() => setCategory("favorites")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              category === "favorites"
                ? "bg-amber-500 text-white shadow-xs"
                : "bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100"
            }`}
          >
            <span>⭐ Starred</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-200 text-amber-950">
              {favSlugs.length}
            </span>
          </button>

          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                category === c
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {categoryLabels[c] || c}
            </button>
          ))}
        </div>
      </div>

      {/* Counter and Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-200 pb-3 px-1">
        <div>
          Showing <span className="font-bold text-slate-900">{visibleTools.length}</span> of{" "}
          <span className="font-bold text-blue-600">{filtered.length}</span> free tools
          {query && (
            <span className="ml-1 text-slate-400">
              (Filter: <span className="text-blue-600 font-semibold">"{query}"</span>)
            </span>
          )}
        </div>
        {(query || category !== "all") && (
          <button onClick={clearSearch} className="text-blue-600 hover:underline font-semibold cursor-pointer text-left sm:text-right">
            Clear all filters
          </button>
        )}
      </div>

      {/* Responsive Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto shadow-xs">
          <div className="text-4xl mb-3">
            {category === "favorites" ? "⭐" : "🔍"}
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-1">
            {category === "favorites" ? "No Starred Tools Yet" : "No tools found"}
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            {category === "favorites"
              ? "Click the ★ star button on any tool card to save it here!"
              : "Try searching for a different keyword or explore another category."}
          </p>
          <button onClick={clearSearch} className="ct-btn-primary text-xs">
            View All Tools
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {visibleTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filtered.length && (
        <div className="text-center pt-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}
            className="ct-btn-secondary text-xs"
          >
            Load More Tools ({filtered.length - visibleCount} remaining) ↓
          </button>
        </div>
      )}
    </div>
  );
}
