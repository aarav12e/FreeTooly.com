"use client";

<<<<<<< HEAD
import React, { useState, useMemo } from "react";
import Link from "next/link";
import ToolGrid from "@/components/ToolGrid";
import { tools } from "@/lib/tools-registry";

function LightningIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
=======
import React, { useState, useEffect, useMemo } from "react";
import ToolGrid from "@/components/ToolGrid";
import { tools } from "@/lib/tools-registry";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
    </svg>
  );
}

function ArrowRight() {
  return (
<<<<<<< HEAD
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
=======
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
    </svg>
  );
}

<<<<<<< HEAD
const POPULAR_QUICK_LINKS = [
  {
    name: "Word Counter",
    href: "/tools/word-counter",
    icon: (
      <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 font-bold text-[11px] flex items-center justify-center border border-blue-100">
        T
      </span>
    ),
  },
  {
    name: "Word to PDF",
    href: "/tools/word-to-pdf",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
  },
  {
    name: "QR Code Generator",
    href: "/tools/qr-code-generator",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 17h3v3h-3z"/>
      </svg>
    ),
  },
  {
    name: "JSON Formatter",
    href: "/tools/json-formatter",
    icon: (
      <span className="w-5 h-5 rounded-md bg-purple-50 text-purple-600 font-bold text-[11px] flex items-center justify-center border border-purple-100">
        {"{}"}
      </span>
    ),
  },
  {
    name: "PNG to WEBP",
    href: "/tools/png-to-webp",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <path d="m21 15-5-5L5 21"/>
      </svg>
    ),
  },
];

const BENEFITS = [
  {
    title: "100% Free",
    description: "All tools are completely free to use.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
  },
  {
    title: "No Signup",
    description: "Use everything instantly. No signup.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    title: "Private & Secure",
    description: "Your files stay on your device.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Works Offline",
    description: "Most tools work without internet.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
      </svg>
    ),
=======
// 4 Rotating Target Words with custom color styling
const ROTATING_WORDS = [
  {
    text: "Business",
    style: "bg-emerald-100 dark:bg-[#064e3b]/85 text-emerald-800 dark:text-emerald-300 border-emerald-400/60 dark:border-emerald-500/60 shadow-emerald-950/20 dark:shadow-emerald-950/60",
  },
  {
    text: "Your Life",
    style: "bg-rose-100 dark:bg-[#881337]/85 text-rose-800 dark:text-rose-300 border-rose-400/60 dark:border-rose-500/60 shadow-rose-950/20 dark:shadow-rose-950/60",
  },
  {
    text: "Everything",
    style: "bg-amber-100 dark:bg-[#78350f]/85 text-amber-800 dark:text-amber-300 border-amber-400/60 dark:border-amber-500/60 shadow-amber-950/20 dark:shadow-amber-950/60",
  },
  {
    text: "Education",
    style: "bg-blue-100 dark:bg-[#1e3a8a]/85 text-blue-800 dark:text-sky-300 border-blue-400/60 dark:border-sky-500/60 shadow-sky-950/20 dark:shadow-sky-950/60",
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
  },
];

export default function HeroSection() {
<<<<<<< HEAD

  // Dynamic tool counts directly from registry
=======
  const [searchVal, setSearchVal] = useState("");
  const [wordIndex, setWordIndex] = useState(0);

  // Exact dynamic tool counts directly from registry
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
  const categoryCards = useMemo(() => {
    const pdfCount = tools.filter((t) => t.category === "pdf-tools").length;
    const imageCount = tools.filter((t) => t.category === "image-tools").length;
    const writeCount = tools.filter((t) => ["editing", "text-analysis", "writing"].includes(t.category)).length;
    const fileCount = tools.filter((t) => ["word-tools", "converter"].includes(t.category)).length;

    return [
      {
        title: "PDF Tools",
<<<<<<< HEAD
        description: "Merge, compress, convert and manage your PDF files easily.",
        count: `${pdfCount}+ tools`,
        btnText: "Explore PDF Tools",
        categorySlug: "pdf-tools",
        iconBg: "bg-blue-50 border-blue-100 text-blue-600",
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
=======
        subtitle: "Solve Your PDF Problems",
        count: `${pdfCount} tools`,
        featuredName: "Merge PDF",
        categorySlug: "pdf-tools",
        gradient: "from-[#6366f1] via-[#5558e6] to-[#4338ca]",
        shadow: "shadow-indigo-900/25",
        icon: (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
        ),
      },
      {
        title: "Image Tools",
<<<<<<< HEAD
        description: "Crop, resize, convert and edit your images instantly.",
        count: `${imageCount}+ tools`,
        btnText: "Explore Image Tools",
        categorySlug: "image-tools",
        iconBg: "bg-emerald-50 border-emerald-100 text-emerald-600",
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
        ),
      },
      {
        title: "AI Write & Edit",
        description: "Text analysis, word counter, formatting and more.",
        count: `${writeCount}+ tools`,
        btnText: "Explore Write Tools",
        categorySlug: "editing",
        iconBg: "bg-purple-50 border-purple-100 text-purple-600",
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
=======
        subtitle: "Solve Your Image Problems",
        count: `${imageCount} tools`,
        featuredName: "Crop JPG",
        categorySlug: "image-tools",
        gradient: "from-[#f97316] via-[#ea580c] to-[#c2410c]",
        shadow: "shadow-orange-900/25",
        icon: (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
          </div>
        ),
      },
      {
        title: "AI Write",
        subtitle: "Solve Your Text Problems",
        count: `${writeCount} tools`,
        featuredName: "Word Counter",
        categorySlug: "editing",
        gradient: "from-[#0284c7] via-[#0369a1] to-[#075985]",
        shadow: "shadow-sky-900/25",
        icon: (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
        ),
      },
      {
        title: "File Tools",
<<<<<<< HEAD
        description: "Convert, organize and work with your files efficiently.",
        count: `${fileCount}+ tools`,
        btnText: "Explore File Tools",
        categorySlug: "word-tools",
        iconBg: "bg-orange-50 border-orange-100 text-orange-600",
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z"/>
          </svg>
=======
        subtitle: "Solve Your File Problems",
        count: `${fileCount} tools`,
        featuredName: "JSON to CSV",
        categorySlug: "word-tools",
        gradient: "from-[#0d9488] via-[#0f766e] to-[#115e59]",
        shadow: "shadow-teal-900/25",
        icon: (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
        ),
      },
    ];
  }, []);

<<<<<<< HEAD
=======
  // Rotate rotating words every 2.4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const currentWord = ROTATING_WORDS[wordIndex];

>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
  const handleCategoryClick = (categorySlug) => {
    window.dispatchEvent(new CustomEvent("setCategory", { detail: categorySlug }));
    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
  };

<<<<<<< HEAD
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 transition-colors duration-200">
      {/* Hero Section matching exact attached reference design */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-16 px-4 sm:px-6 bg-gradient-to-b from-blue-50/40 via-white to-[#f8fafc]">
        
        {/* Ambient background decorations: dot grid + floating icon cards & dashed curves */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#dbeafe_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-60" />
        
        {/* Floating card 1: Top Left Document icon */}
        <div className="pointer-events-none hidden lg:flex absolute top-12 left-16 z-0 w-12 h-12 rounded-2xl bg-white border border-blue-100 shadow-lg shadow-blue-500/10 items-center justify-center text-blue-600">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>

        {/* Floating card 2: Top Right Image icon */}
        <div className="pointer-events-none hidden lg:flex absolute top-16 right-20 z-0 w-12 h-12 rounded-2xl bg-white border border-blue-100 shadow-lg shadow-blue-500/10 items-center justify-center text-purple-600">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="m21 15-5-5L5 21"/>
          </svg>
        </div>

        {/* Floating card 3: Center Right Pencil icon */}
        <div className="pointer-events-none hidden lg:flex absolute top-64 right-36 z-0 w-10 h-10 rounded-xl bg-white border border-blue-100 shadow-md shadow-blue-500/10 items-center justify-center text-purple-500">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </div>

        {/* Dashed ambient curve lines */}
        <svg className="pointer-events-none absolute inset-0 w-full h-full stroke-blue-200/60 z-0 hidden lg:block" fill="none">
          <path d="M 120 70 Q 200 180 320 150" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M 850 100 Q 950 180 980 260" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-200 text-blue-600 text-xs font-semibold tracking-wide mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>100+ Free Online Browser Tools</span>
          </div>

          {/* Main Headline with Blue Accent & Underline SVG */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.12] max-w-4xl">
            100+ Free Online Tools.<br />
            <span>Fast. Private. </span>
            <span className="relative inline-block text-blue-600">
              Zero signup.
              {/* Hand-drawn Underline SVG under "Zero signup." */}
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-blue-500 overflow-visible" viewBox="0 0 200 20" fill="none">
                <path d="M 5 12 C 50 4, 150 16, 195 8" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl font-medium leading-relaxed">
            Convert, calculate, generate, format and analyze — 100% directly in your browser. No sign-up required.
          </p>

          {/* Popular Right Now Pills Row */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5 max-w-4xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-blue-50 border border-blue-100 text-xs font-bold text-slate-800">
              <LightningIcon />
              <span>Popular right now</span>
            </div>

            {POPULAR_QUICK_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm text-xs font-semibold text-slate-700 transition-all"
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* 4 Category Cards Grid */}
          <div className="mt-12 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
=======
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      window.dispatchEvent(new CustomEvent("setQuery", { detail: searchVal }));
    }
    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d141e] text-slate-900 dark:text-white transition-colors duration-200">
      {/* -------------------------------------------------------------------- */}
      {/* TinyWow Inspired Hero Header with 3D Confetti Particles             */}
      {/* -------------------------------------------------------------------- */}
      <section className="relative overflow-hidden pt-8 sm:pt-16 pb-10 sm:pb-16 px-3.5 sm:px-6">
        {/* Floating 3D Geometric Confetti Accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute top-8 left-4 sm:left-10 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-lg transform rotate-45 opacity-80 animate-float-1 shadow-md" />
          <div className="absolute top-28 left-1/4 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-pink-400 rounded-sm transform rotate-12 opacity-70 animate-float-2" />
          <div className="absolute top-1/2 left-4 sm:left-8 w-0 h-0 border-l-[10px] sm:border-l-[12px] border-l-transparent border-r-[10px] sm:border-r-[12px] border-r-transparent border-b-[16px] sm:border-b-[20px] border-b-cyan-500 transform -rotate-12 opacity-80 animate-float-3" />
          <div className="absolute bottom-12 left-12 sm:left-24 w-5 h-5 sm:w-7 sm:h-7 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-md transform rotate-45 opacity-80 animate-float-1 shadow-md" />
          <div className="absolute top-10 right-6 sm:right-16 w-6 h-6 sm:w-9 sm:h-9 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-lg transform -rotate-12 opacity-80 animate-float-2 shadow-md" />
          <div className="absolute top-36 right-1/4 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-yellow-400 rounded-sm transform rotate-45 opacity-70 animate-float-1" />
          <div className="absolute top-3/4 right-6 sm:right-12 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg transform rotate-45 opacity-80 animate-float-3 shadow-md" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center">
          {/* Responsive Headline with 3D Rotating Flipping Word */}
          <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.3] max-w-4xl flex flex-wrap items-center justify-center gap-x-1.5 sm:gap-x-3 px-1">
            <span>Free Tools to Make</span>
            <span className="relative inline-flex items-center justify-center my-0.5 sm:my-1" style={{ perspective: "1000px" }}>
              <span
                key={currentWord.text}
                className={`animate-word-flip text-xl sm:text-3xl md:text-5xl lg:text-6xl px-3 sm:px-6 py-0.5 sm:py-2 rounded-xl sm:rounded-2xl border shadow-xl ${currentWord.style} whitespace-nowrap`}
              >
                {currentWord.text}
              </span>
            </span>
            <span>Simple</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3 sm:mt-5 text-xs sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl font-medium leading-relaxed px-2">
            We offer PDF, image, writing and other online tools to make your life easier
          </p>

          {/* Centered TinyWow Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-6 sm:mt-10 w-full max-w-xl relative flex items-center px-1"
          >
            <div className="w-full relative flex items-center bg-white dark:bg-[#111a27] border-2 border-slate-300 dark:border-[#233348] focus-within:border-cyan-500 rounded-full pl-3.5 sm:pl-5 pr-1.5 sm:pr-2 py-1.5 sm:py-2 shadow-xl shadow-slate-200/50 dark:shadow-black/60 transition-all">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search 130+ tools..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-base text-slate-900 dark:text-white placeholder-slate-400 outline-none pl-2 sm:pl-3 pr-2"
              />
              <button
                type="submit"
                className="px-4 sm:px-8 py-2 sm:py-2.5 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-600/40 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>

          {/* ---------------------------------------------------------------- */}
          {/* 4 Vibrant Hero Category Cards (Responsive: 1 col on mobile, 4 on desktop) */}
          {/* ---------------------------------------------------------------- */}
          <div className="mt-8 sm:mt-16 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
            {categoryCards.map((card) => (
              <div
                key={card.title}
                onClick={() => handleCategoryClick(card.categorySlug)}
<<<<<<< HEAD
                className="group relative rounded-3xl bg-white border border-slate-200/90 p-6 text-left shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Soft Icon Box + Tool Count Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${card.iconBg}`}>
                      {card.icon}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                      {card.count}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-heading font-extrabold text-lg text-slate-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                {/* Bottom Outline Pill Button */}
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-600 hover:text-white text-blue-600 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 group-hover:bg-blue-600 group-hover:text-white"
                >
                  <span>{card.btnText}</span>
                  <ArrowRight />
                </button>
              </div>
            ))}
          </div>

          {/* Benefits Row (Bottom) */}
          <div className="mt-14 w-full pt-10 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/70 shadow-2xs">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  {b.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{b.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{b.description}</p>
=======
                className={`group relative rounded-2xl overflow-hidden bg-gradient-to-b ${card.gradient} p-4 sm:p-5 text-left text-white shadow-xl ${card.shadow} hover:scale-105 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[160px] sm:min-h-[175px] border border-white/15`}
              >
                {/* Top Row: Icon + Exact Count Badge */}
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  {card.icon}
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
                    {card.count}
                  </span>
                </div>

                {/* Middle: Title & Subtitle + Arrow */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-extrabold text-base sm:text-lg text-white leading-tight">
                      {card.title}
                    </h3>
                    <div className="group-hover:translate-x-1 transition-transform">
                      <ArrowRight />
                    </div>
                  </div>
                  <p className="text-[11px] sm:text-xs text-white/85 font-medium mt-0.5">
                    {card.subtitle}
                  </p>
                </div>

                {/* Bottom Dark Glass Bar (Featured Tool) */}
                <div className="mt-3.5 pt-2 border-t border-white/15 flex items-center justify-between text-[10px] sm:text-[11px] bg-black/25 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 px-4 sm:px-5 py-2 backdrop-blur-xs">
                  <span className="text-white/75 font-semibold text-[10px]">Featured Tool :</span>
                  <span className="font-bold text-white text-[10px] sm:text-[11px] truncate max-w-[120px]">
                    {card.featuredName}
                  </span>
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                </div>
              </div>
            ))}
          </div>
<<<<<<< HEAD

        </div>
      </section>

      {/* Main Tools Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
=======
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* Tools Grid Section (With Illustration / Picture space preserved)    */}
      {/* -------------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 py-8 sm:py-16">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
        <ToolGrid tools={tools} />
      </section>
    </div>
  );
}
