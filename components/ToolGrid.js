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
<<<<<<< HEAD
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
=======
    <div id="tools" className="space-y-6 sm:space-y-10">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-blue-50 dark:bg-cyan-500/10 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-cyan-500/20">
          <span>✨ 130+ Free In-Browser Online Tools</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore All Categories & Tools
        </h2>
      </div>

      {/* Categories Navigation Pills with ⭐ Starred Option */}
      <div className="space-y-4">
        <div id="categories" className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-1 max-w-5xl mx-auto">
          {/* Starred Favorites Filter Tab */}
          <button
            onClick={() => setCategory("favorites")}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              category === "favorites"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105"
                : "bg-amber-50 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/30 text-amber-900 dark:text-amber-300 hover:bg-amber-100"
            }`}
          >
            <span>⭐ Starred</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-200 dark:bg-amber-400/30 text-amber-950 dark:text-amber-200">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
              {favSlugs.length}
            </span>
          </button>

          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
<<<<<<< HEAD
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                category === c
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-slate-300 hover:bg-slate-50"
=======
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                category === c
                  ? "bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-lg shadow-blue-500/25 dark:shadow-cyan-500/25 scale-105"
                  : "bg-white dark:bg-[#131d2b] border border-slate-200 dark:border-[#223247] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:border-blue-300 dark:hover:border-cyan-500/40 hover:bg-slate-50 dark:hover:bg-[#192738]"
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
              }`}
            >
              {categoryLabels[c] || c}
            </button>
          ))}
        </div>
      </div>

      {/* Counter and Filter Bar */}
<<<<<<< HEAD
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-200 pb-3 px-1">
        <div>
          Showing <span className="font-bold text-slate-900">{visibleTools.length}</span> of{" "}
          <span className="font-bold text-blue-600">{filtered.length}</span> free tools
          {query && (
            <span className="ml-1 text-slate-400">
              (Filter: <span className="text-blue-600 font-semibold">"{query}"</span>)
=======
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-[#1f2e42] pb-3 sm:pb-4 px-1">
        <div>
          Showing <span className="font-bold text-slate-900 dark:text-white">{visibleTools.length}</span> of{" "}
          <span className="font-bold text-blue-600 dark:text-cyan-400">{filtered.length}</span> free tools
          {query && (
            <span className="ml-1 text-slate-400">
              (Filter: <span className="text-cyan-400 font-semibold">"{query}"</span>)
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
            </span>
          )}
        </div>
        {(query || category !== "all") && (
<<<<<<< HEAD
          <button onClick={clearSearch} className="text-blue-600 hover:underline font-semibold cursor-pointer text-left sm:text-right">
=======
          <button onClick={clearSearch} className="text-blue-600 dark:text-cyan-400 hover:underline font-semibold cursor-pointer text-left sm:text-right">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
            Clear all filters
          </button>
        )}
      </div>

<<<<<<< HEAD
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
=======
      {/* Responsive Grid with illustration banners */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#121c29] border border-slate-200 dark:border-[#223247] rounded-2xl sm:rounded-3xl p-8 sm:p-16 text-center max-w-md mx-auto shadow-xl">
          <div className="text-4xl sm:text-5xl mb-3">
            {category === "favorites" ? "⭐" : "🔍"}
          </div>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
            {category === "favorites" ? "No Starred Tools Yet" : "No tools found"}
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">
            {category === "favorites"
              ? "Click the ★ star button on any tool card to add it to your favorites list!"
              : "Try searching for a different keyword or explore another category."}
          </p>
          <button onClick={clearSearch} className="px-5 py-2.5 bg-blue-600 dark:bg-cyan-500 hover:bg-blue-700 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
            View All Tools
          </button>
        </div>
      ) : (
<<<<<<< HEAD
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
=======
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
          {visibleTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filtered.length && (
<<<<<<< HEAD
        <div className="text-center pt-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}
            className="ct-btn-secondary text-xs"
=======
        <div className="text-center pt-4 sm:pt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}
            className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-[#131d2b] border border-slate-200 dark:border-[#233348] hover:border-blue-500 dark:hover:border-cyan-400 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
          >
            Load More Tools ({filtered.length - visibleCount} remaining) ↓
          </button>
        </div>
      )}
    </div>
  );
}
