"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import CommandPalette from "@/components/CommandPalette";
import { useTheme } from "@/components/ThemeProvider";
import { tools } from "@/lib/tools-registry";

function LogoIcon() {
  return (
<<<<<<< HEAD
    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs flex-shrink-0">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
=======
    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 flex-shrink-0">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M12 12v9" />
        <path d="m8 17 4 4 4-4" />
      </svg>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 transition-opacity">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
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

const NAV_DROPDOWNS = [
  {
    label: "PDF",
    categorySlug: "pdf-tools",
    items: [
      { name: "Merge PDF", slug: "merge-pdf" },
      { name: "Word to PDF", slug: "word-to-pdf" },
      { name: "PDF to Word", slug: "pdf-to-word" },
      { name: "Compress PDF", slug: "compress-pdf" },
      { name: "Protect PDF", slug: "protect-pdf" },
    ],
  },
  {
    label: "Image",
    categorySlug: "image-tools",
    items: [
      { name: "Crop JPG Image", slug: "crop-jpg" },
      { name: "Image to PDF", slug: "image-to-pdf" },
      { name: "Image to Base64", slug: "image-to-base64" },
      { name: "Online Image Editor", slug: "online-image-editor" },
    ],
  },
  {
    label: "Write",
    categorySlug: "editing",
    items: [
      { name: "Word Counter", slug: "word-counter" },
      { name: "Case Converter", slug: "case-converter" },
      { name: "Find & Replace", slug: "find-replace" },
      { name: "Remove Duplicate Lines", slug: "remove-duplicate-lines" },
      { name: "Remove Empty Lines", slug: "remove-empty-lines" },
    ],
  },
  {
    label: "File",
    categorySlug: "word-tools",
    items: [
      { name: "Merge Word Files", slug: "merge-word" },
      { name: "JSON to CSV", slug: "json-to-csv" },
      { name: "Excel to PDF", slug: "excel-to-pdf" },
      { name: "PPT to PDF", slug: "ppt-to-pdf" },
    ],
  },
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [favOpen, setFavOpen] = useState(false);
  const [favSlugs, setFavSlugs] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadFavs = () => {
      const stored = JSON.parse(localStorage.getItem("freetooly_favs") || "[]");
      setFavSlugs(stored);
    };
    loadFavs();
    window.addEventListener("favsUpdated", loadFavs);
    return () => window.removeEventListener("favsUpdated", loadFavs);
  }, []);

<<<<<<< HEAD
  // Lock body scrolling when drawer is open & handle Escape key
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    if (drawerOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawerOpen]);

=======
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
  const favTools = tools.filter((t) => favSlugs.includes(t.slug));

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCategorySelect = (categorySlug) => {
    setActiveDropdown(null);
    window.dispatchEvent(new CustomEvent("setCategory", { detail: categorySlug }));
    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
  };

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent("openCommandPalette"));
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0d141f]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#1f2d3d] text-slate-800 dark:text-white transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
<<<<<<< HEAD
          {/* Left: Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                <path d="M12 12v9" />
                <path d="m8 17 4 4 4-4" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-lg sm:text-xl tracking-tight text-slate-900 flex items-center gap-1 leading-none">
                FreeTooly
              </span>
              <span className="text-[9px] font-semibold text-blue-600 tracking-wider uppercase leading-tight hidden xs:block">
                Online Utility Workbench
=======
          {/* Left: TinyWow Style Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0 min-w-0">
            <LogoIcon />
            <div className="flex flex-col">
              <span className="font-heading font-black text-base sm:text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1 leading-none">
                FreeTooly
              </span>
              <span className="text-[8px] sm:text-[9px] font-semibold text-blue-600 dark:text-cyan-400 tracking-wider uppercase leading-tight hidden xs:block">
                by FreeTooly.com
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
              </span>
            </div>
          </Link>

          {/* Middle: Category Dropdown Nav Links (Desktop) */}
<<<<<<< HEAD
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-700">
=======
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
            {NAV_DROPDOWNS.map((nav) => (
              <div
                key={nav.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(nav.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => handleCategorySelect(nav.categorySlug)}
<<<<<<< HEAD
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-100 transition-colors group cursor-pointer"
=======
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-[#162130] transition-colors group cursor-pointer"
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                >
                  <span>{nav.label}</span>
                  <ChevronDown />
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === nav.label && (
<<<<<<< HEAD
                  <div className="absolute left-0 top-full pt-1 w-56 z-50 animate-in fade-in duration-150">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-2 space-y-0.5">
                      <div className="px-3 py-1 text-[10px] uppercase font-bold text-blue-600 border-b border-slate-100 mb-1">
=======
                  <div className="absolute left-0 top-full pt-1 w-56 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="bg-white dark:bg-[#121b27] border border-slate-200 dark:border-[#233346] rounded-xl shadow-2xl p-2 space-y-0.5">
                      <div className="px-3 py-1 text-[10px] uppercase font-bold text-blue-600 dark:text-cyan-400 border-b border-slate-100 dark:border-[#1f2d3d] mb-1">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                        Popular {nav.label} Tools
                      </div>
                      {nav.items.map((item) => (
                        <Link
                          key={item.slug}
                          href={`/tools/${item.slug}`}
                          onClick={() => setActiveDropdown(null)}
<<<<<<< HEAD
                          className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all truncate"
=======
                          className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-cyan-500/15 transition-all truncate"
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                        >
                          {item.name}
                        </Link>
                      ))}
                      <button
                        onClick={() => handleCategorySelect(nav.categorySlug)}
<<<<<<< HEAD
                        className="w-full text-left px-3 py-1.5 text-[11px] font-bold text-blue-600 hover:underline pt-2 border-t border-slate-100 mt-1"
=======
                        className="w-full text-left px-3 py-1.5 text-[11px] font-bold text-blue-600 dark:text-cyan-400 hover:underline pt-2 border-t border-slate-100 dark:border-[#1f2d3d] mt-1"
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                      >
                        All {nav.label} Tools →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

<<<<<<< HEAD
          {/* Right: Search, Favorites, Share & Explore CTA */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search Button */}
            <button
              onClick={openSearch}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 text-xs font-semibold transition-all cursor-pointer hover:bg-slate-200/60"
=======
          {/* Right: Search, Favorites, Theme Toggle, Share & Explore CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            {/* Sleek Search Button */}
            <button
              onClick={openSearch}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#162232] border border-slate-200 dark:border-[#233348] text-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-cyan-400 hover:text-blue-600 dark:hover:text-cyan-300 text-xs font-bold transition-all cursor-pointer shadow-xs hover:bg-slate-200/70 dark:hover:bg-[#1f2d3f]"
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
              title="Search all tools (⌘K)"
            >
              <SearchIcon />
              <span className="hidden sm:inline">Search</span>
<<<<<<< HEAD
              <kbd className="hidden md:inline-block px-1.5 py-0.2 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-500">
=======
              <kbd className="hidden md:inline-block px-1.5 py-0.2 rounded bg-white dark:bg-[#1f2c3c] border border-slate-200 dark:border-[#2a3c50] text-[9px] font-bold text-slate-500 dark:text-slate-300">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                ⌘K
              </kbd>
            </button>

<<<<<<< HEAD
            {/* Starred Favorites Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setFavOpen(!favOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer text-xs font-semibold ${
                  favTools.length > 0
                    ? "bg-amber-50 border-amber-300 text-amber-900 shadow-xs"
                    : "bg-slate-100 border-slate-200 text-slate-600 hover:text-amber-600 hover:bg-slate-200/60"
=======
            {/* ⭐ Starred Favorites Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setFavOpen(!favOpen)}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border transition-all cursor-pointer text-xs font-bold ${
                  favTools.length > 0
                    ? "bg-amber-100 dark:bg-amber-400/20 border-amber-300 dark:border-amber-400/40 text-amber-900 dark:text-amber-300 shadow-xs"
                    : "bg-slate-100 dark:bg-[#162232] border-slate-200 dark:border-[#233348] text-slate-600 dark:text-slate-300 hover:text-amber-500"
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                }`}
                title="View Starred Favorites"
              >
                <span>⭐</span>
                <span className="hidden md:inline">Favorites</span>
                {favTools.length > 0 && (
<<<<<<< HEAD
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
=======
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-500 text-white text-[9px] sm:text-[10px] font-extrabold flex items-center justify-center">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                    {favTools.length}
                  </span>
                )}
              </button>

              {/* Favorites Dropdown Menu */}
              {favOpen && (
<<<<<<< HEAD
                <div className="fixed inset-x-3 sm:inset-x-auto sm:absolute sm:right-0 top-14 sm:top-full mt-1 sm:w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3.5 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
=======
                <div className="fixed inset-x-3 sm:inset-x-auto sm:absolute sm:right-0 top-14 sm:top-full mt-1 sm:w-80 bg-white dark:bg-[#121b27] border border-slate-200 dark:border-[#233348] rounded-2xl shadow-2xl p-3.5 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-[#1f2d3d] mb-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                      <span>⭐</span> Saved Favorites ({favTools.length})
                    </span>
                    <button
                      onClick={() => setFavOpen(false)}
<<<<<<< HEAD
                      className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
=======
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1e2c3e]"
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                    >
                      <XIcon />
                    </button>
                  </div>

                  {favTools.length === 0 ? (
<<<<<<< HEAD
                    <div className="py-6 text-center text-xs text-slate-400 space-y-1">
                      <div className="text-2xl mb-1">⭐</div>
                      <p className="font-semibold text-slate-700">No favorites saved yet</p>
                      <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto">
                        Click the ★ star button on any tool card to save it here.
=======
                    <div className="py-8 text-center text-xs text-slate-400 space-y-1.5">
                      <div className="text-3xl mb-1">⭐</div>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">No favorites saved yet</p>
                      <p className="text-[11px] text-slate-500 max-w-[220px] mx-auto">
                        Click the ★ star button on any tool card to quickly access it here!
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                        {favTools.map((t) => (
                          <div
                            key={t.slug}
<<<<<<< HEAD
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-amber-50 text-xs font-medium text-slate-800 transition-colors group"
=======
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-400/10 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors group"
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                          >
                            <Link
                              href={`/tools/${t.slug}`}
                              onClick={() => setFavOpen(false)}
<<<<<<< HEAD
                              className="flex items-center gap-2 min-w-0 flex-1"
                            >
                              <span className="text-base flex-shrink-0">{t.icon || "🔧"}</span>
                              <div className="min-w-0 flex-1">
                                <span className="block truncate group-hover:text-amber-700 font-semibold">
=======
                              className="flex items-center gap-2.5 min-w-0 flex-1"
                            >
                              <span className="text-base flex-shrink-0">{t.icon || "🔧"}</span>
                              <div className="min-w-0 flex-1">
                                <span className="block truncate group-hover:text-amber-600 dark:group-hover:text-amber-400">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                                  {t.name}
                                </span>
                              </div>
                            </Link>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const stored = JSON.parse(localStorage.getItem("freetooly_favs") || "[]");
                                const updated = stored.filter((s) => s !== t.slug);
                                localStorage.setItem("freetooly_favs", JSON.stringify(updated));
                                window.dispatchEvent(new Event("favsUpdated"));
                              }}
<<<<<<< HEAD
                              className="p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors ml-1"
=======
                              className="p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors ml-1"
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                              title="Remove from favorites"
                            >
                              <XIcon />
                            </button>
                          </div>
                        ))}
                      </div>

<<<<<<< HEAD
                      <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
=======
                      <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-[#1f2d3d] flex items-center justify-between text-[11px]">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                        <button
                          onClick={() => {
                            localStorage.setItem("freetooly_favs", "[]");
                            window.dispatchEvent(new Event("favsUpdated"));
                          }}
<<<<<<< HEAD
                          className="text-slate-500 hover:text-red-600 font-semibold cursor-pointer"
                        >
                          Clear All
=======
                          className="text-slate-500 dark:text-slate-400 hover:text-red-500 hover:underline font-semibold cursor-pointer"
                        >
                          Clear All Favorites
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                        </button>
                        <button
                          onClick={() => {
                            setFavOpen(false);
                            window.dispatchEvent(new CustomEvent("setCategory", { detail: "favorites" }));
                            document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
                          }}
<<<<<<< HEAD
                          className="text-amber-700 font-bold hover:underline"
                        >
                          View Grid →
=======
                          className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
                        >
                          View in Grid →
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

<<<<<<< HEAD
            {/* Share Button (Desktop) */}
            <button
              onClick={handleShare}
              className="hidden sm:flex w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-blue-600 items-center justify-center hover:bg-slate-200/60 transition-all cursor-pointer relative"
=======
            {/* Live Theme Toggle Button (Light/Dark) */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 dark:bg-[#162232] border border-slate-200 dark:border-[#233348] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-[#1f2d3f] transition-all cursor-pointer shadow-xs"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Share Button (Desktop) */}
            <button
              onClick={handleShare}
              className="hidden sm:flex w-9 h-9 rounded-full bg-slate-100 dark:bg-[#162232] border border-slate-200 dark:border-[#233348] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white items-center justify-center hover:bg-slate-200 dark:hover:bg-[#1f2d3f] transition-all cursor-pointer relative shadow-xs"
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
              title="Share Website"
            >
              <ShareIcon />
              {copied && (
<<<<<<< HEAD
                <span className="absolute -bottom-8 right-0 bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-md whitespace-nowrap">
=======
                <span className="absolute -bottom-8 right-0 bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded shadow-md whitespace-nowrap">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                  Copied!
                </span>
              )}
            </button>

            {/* Primary Action Button (Desktop) */}
            <button
              onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
<<<<<<< HEAD
              className="ct-btn-primary hidden sm:inline-flex text-xs"
=======
              className="hidden md:inline-flex px-4 sm:px-5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
            >
              Explore Tools
            </button>

            {/* Mobile Menu Button */}
            <button
<<<<<<< HEAD
              type="button"
              aria-label="Open navigation"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors"
=======
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-[#162232] border border-slate-200 dark:border-[#233348] text-slate-700 dark:text-slate-300"
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

<<<<<<< HEAD
      {/* Mobile Drawer & Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="w-full max-w-xs sm:w-80 h-full bg-white border-l border-slate-200 text-slate-900 shadow-2xl flex flex-col justify-between p-5 overflow-y-auto animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                    FT
                  </div>
                  <span className="font-heading font-black text-lg text-slate-900">FreeTooly</span>
                </div>
                <button
                  type="button"
                  aria-label="Close navigation"
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <XIcon />
                </button>
              </div>

              {/* Search inside drawer */}
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  openSearch();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                <span className="flex items-center gap-2">
                  <SearchIcon />
                  <span>Search tools...</span>
                </span>
                <kbd className="px-1.5 py-0.5 rounded bg-white border text-[10px]">⌘K</kbd>
              </button>

              {/* Starred Favorites in Drawer */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider px-1 flex items-center justify-between">
                  <span>⭐ Starred Favorites</span>
                  <span className="font-bold">{favTools.length}</span>
                </span>
                {favTools.length === 0 ? (
                  <p className="px-2 text-xs text-slate-400">No starred tools yet. Click the ★ on any card.</p>
                ) : (
                  <div className="space-y-1">
                    {favTools.map((t) => (
                      <Link
                        key={t.slug}
                        href={`/tools/${t.slug}`}
                        onClick={() => setDrawerOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-all truncate"
                      >
                        <span>{t.icon || "🔧"}</span>
                        <span className="truncate">{t.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories list */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider px-1">Tool Categories</span>
                <div className="space-y-1">
                  {NAV_DROPDOWNS.map((nav) => (
                    <button
                      key={nav.label}
                      onClick={() => {
                        setDrawerOpen(false);
                        handleCategorySelect(nav.categorySlug);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300"
                    >
                      <span>{nav.label} Tools</span>
                      <span className="text-xs text-slate-400">→</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Explore Button inside mobile drawer */}
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="ct-btn-primary w-full py-3 text-sm"
              >
                Explore All Tools
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
              <Link href="/privacy-policy" onClick={() => setDrawerOpen(false)}>Privacy</Link>
              <Link href="/terms" onClick={() => setDrawerOpen(false)}>Terms</Link>
              <span>© 2026 FreeTooly</span>
            </div>
          </div>
        </div>
      )}
=======
      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end drawer-backdrop ${
          drawerOpen ? "drawer-open" : "drawer-closed"
        }`}
        onClick={() => setDrawerOpen(false)}
      >
        <div
          className={`w-full max-w-xs sm:w-80 h-full bg-white dark:bg-[#0d141f] border-l border-slate-200 dark:border-[#223348] text-slate-900 dark:text-white shadow-2xl flex flex-col justify-between p-5 overflow-y-auto drawer-panel ${
            drawerOpen ? "drawer-panel-open" : "drawer-panel-closed"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#1f2d3d]">
              <div className="flex items-center gap-2">
                <LogoIcon />
                <span className="font-heading font-black text-lg text-slate-900 dark:text-white">FreeTooly</span>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <XIcon />
              </button>
            </div>

            {/* Search inside drawer */}
            <button
              onClick={() => {
                setDrawerOpen(false);
                openSearch();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-[#141e2b] border border-slate-200 dark:border-[#233348] text-slate-600 dark:text-slate-300 text-xs font-semibold"
            >
              <span className="flex items-center gap-2">
                <SearchIcon />
                <span>Search 130+ tools...</span>
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#1f2c3c] border text-[10px]">⌘K</kbd>
            </button>

            {/* Starred Favorites in Drawer */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider px-1 flex items-center justify-between">
                <span>⭐ Starred Favorites</span>
                <span className="font-bold">{favTools.length}</span>
              </span>
              {favTools.length === 0 ? (
                <p className="px-2 text-xs text-slate-400">No starred tools yet. Click the ★ on any card.</p>
              ) : (
                <div className="space-y-1">
                  {favTools.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/tools/${t.slug}`}
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all truncate"
                    >
                      <span>{t.icon || "🔧"}</span>
                      <span className="truncate">{t.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Categories list */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#1f2d3d]">
              <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider px-1">Tool Categories</span>
              <div className="space-y-1">
                {NAV_DROPDOWNS.map((nav) => (
                  <button
                    key={nav.label}
                    onClick={() => {
                      setDrawerOpen(false);
                      handleCategorySelect(nav.categorySlug);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131d2a] border border-slate-200 dark:border-[#1f2d3d] text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 hover:border-cyan-500/40"
                  >
                    <span>{nav.label} Tools</span>
                    <span className="text-xs text-slate-400">→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Explore Button inside mobile drawer */}
            <button
              onClick={() => {
                setDrawerOpen(false);
                document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full py-3 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-sm shadow-md transition-all text-center"
            >
              Explore All 130+ Tools
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-[#1f2d3d] text-[11px] text-slate-500 flex justify-between">
            <Link href="/privacy-policy" onClick={() => setDrawerOpen(false)}>Privacy</Link>
            <Link href="/terms" onClick={() => setDrawerOpen(false)}>Terms</Link>
            <span>© 2026 FreeTooly</span>
          </div>
        </div>
      </div>
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6

      <CommandPalette />
    </>
  );
}
