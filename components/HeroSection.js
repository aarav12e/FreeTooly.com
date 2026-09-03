"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import ToolGrid from "@/components/ToolGrid";
import { tools } from "@/lib/tools-registry";

function LightningIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

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
  },
];

export default function HeroSection() {

  // Dynamic tool counts directly from registry
  const categoryCards = useMemo(() => {
    const pdfCount = tools.filter((t) => t.category === "pdf-tools").length;
    const imageCount = tools.filter((t) => t.category === "image-tools").length;
    const writeCount = tools.filter((t) => ["editing", "text-analysis", "writing"].includes(t.category)).length;
    const fileCount = tools.filter((t) => ["word-tools", "converter"].includes(t.category)).length;

    return [
      {
        title: "PDF Tools",
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
        ),
      },
      {
        title: "Image Tools",
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
        ),
      },
      {
        title: "File Tools",
        description: "Convert, organize and work with your files efficiently.",
        count: `${fileCount}+ tools`,
        btnText: "Explore File Tools",
        categorySlug: "word-tools",
        iconBg: "bg-orange-50 border-orange-100 text-orange-600",
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z"/>
          </svg>
        ),
      },
    ];
  }, []);

  const handleCategoryClick = (categorySlug) => {
    window.dispatchEvent(new CustomEvent("setCategory", { detail: categorySlug }));
    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
  };

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
            {categoryCards.map((card) => (
              <div
                key={card.title}
                onClick={() => handleCategoryClick(card.categorySlug)}
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
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Main Tools Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <ToolGrid tools={tools} />
      </section>
    </div>
  );
}
