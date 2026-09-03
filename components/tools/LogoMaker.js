"use client";

import { useState, useRef, useEffect } from "react";
import { downloadFile } from "@/lib/file-utils";

// Curated vector icon paths for logo marks
const ICON_CATEGORIES = [
  {
    category: "Tech & SaaS",
    icons: [
      { id: "lightning", name: "Bolt", path: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
      { id: "rocket", name: "Rocket", path: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-4.05 11a22.7 22.7 0 0 1-3.95 2z" },
      { id: "cube", name: "3D Cube", path: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12" },
      { id: "cpu", name: "Chip", path: "M4 4h16v16H4z M9 9h6v6H9z M9 1v3 M15 1v3 M9 20v3 M15 20v3 M20 9h3 M20 14h3 M1 9h3 M1 14h3" },
      { id: "cloud", name: "Cloud", path: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" },
      { id: "code", name: "Code", path: "M16 18l6-6-6-6 M8 6l-6 6 6 6" },
      { id: "database", name: "Data", path: "M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4z M2 12c0 2.21 4.48 4 10 4s10-1.79 10-4 M2 6c0 2.21 4.48 4 10 4s10-1.79 10-4" },
      { id: "globe", name: "Network", path: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 0c-2.5 3-4 6.5-4 10s1.5 7 4 10m0-20c2.5 3 4 6.5 4 10s-1.5 7-4 10M2 12h20" },
    ],
  },
  {
    category: "Business & Creative",
    icons: [
      { id: "shield", name: "Shield", path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
      { id: "diamond", name: "Diamond", path: "M6 3h12l4 7-10 11L2 10l4-7z M2 10h20 M12 21L8 10l4-7 4 7-4 11z" },
      { id: "crown", name: "Crown", path: "M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z M5 18h14v2H5z" },
      { id: "feather", name: "Feather", path: "M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z M16 8L2 22 M17.5 15H9" },
      { id: "sparkle", name: "Sparkle", path: "M12 2l2.4 7.4L22 12l-7.6 2.6L12 22l-2.4-7.4L2 12l7.6-2.6z" },
      { id: "briefcase", name: "Finance", path: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" },
      { id: "target", name: "Target", path: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 4a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 4a2 2 0 1 0 2 2 2 2 0 0 0-2-2z" },
      { id: "compass", name: "Compass", path: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm4.24 5.76l-2.12 6.36-6.36 2.12 2.12-6.36z" },
    ],
  },
  {
    category: "Abstract & Geometric",
    icons: [
      { id: "infinity", name: "Infinity", path: "M18.178 8c5.096 0 5.096 8 0 8-3.328 0-4.664-3.528-6.178-5.333C10.486 8.861 9.15 8 5.822 8c-5.096 0-5.096 8 0 8 3.328 0 4.664-3.528 6.178-5.333C13.514 12.472 14.85 16 18.178 16z" },
      { id: "hexagon", name: "Hexagon", path: "M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" },
      { id: "triangle", name: "Delta", path: "M12 2L1 21h22L12 2z M12 6l7.5 13h-15L12 6z" },
      { id: "rings", name: "Orbit", path: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6z" },
      { id: "aperture", name: "Aperture", path: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm2.3 2.3l4.3 7.4-4.8 2.8-4.3-7.4z" },
      { id: "layers", name: "Layers", path: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5" },
    ],
  },
];

// Curated Pro Color Palettes & Gradients
const COLOR_PALETTES = [
  { name: "Cyan Neo", color1: "#06b6d4", color2: "#3b82f6", bg: "#0f172a", text: "#ffffff" },
  { name: "Purple Dream", color1: "#ec4899", color2: "#8b5cf6", bg: "#090d16", text: "#ffffff" },
  { name: "Emerald Pro", color1: "#10b981", color2: "#059669", bg: "#061a14", text: "#ffffff" },
  { name: "Sunset Gold", color1: "#f59e0b", color2: "#ef4444", bg: "#180c0c", text: "#ffffff" },
  { name: "Royal Indigo", color1: "#6366f1", color2: "#4338ca", bg: "#0d1117", text: "#ffffff" },
  { name: "Midnight Stealth", color1: "#94a3b8", color2: "#cbd5e1", bg: "#020617", text: "#f8fafc" },
  { name: "Clean Light", color1: "#2563eb", color2: "#0284c7", bg: "#ffffff", text: "#0f172a" },
  { name: "Crimson Bold", color1: "#f43f5e", color2: "#be123c", bg: "#ffffff", text: "#0f172a" },
];

// Pre-made professional logo templates
const LOGO_TEMPLATES = [
  {
    name: "SaaS Rocket",
    brand: "ApexFlow",
    slogan: "Next-Gen Cloud Solutions",
    iconId: "rocket",
    layout: "stacked",
    paletteIdx: 0,
    fontFamily: "font-sans",
    shape: "rounded-box",
  },
  {
    name: "Fintech Shield",
    brand: "SecureVault",
    slogan: "Enterprise Asset Protection",
    iconId: "shield",
    layout: "horizontal",
    paletteIdx: 2,
    fontFamily: "font-serif",
    shape: "circle",
  },
  {
    name: "Creative Spark",
    brand: "Nova Studio",
    slogan: "Design & Innovation",
    iconId: "sparkle",
    layout: "stacked",
    paletteIdx: 1,
    fontFamily: "font-mono",
    shape: "hexagon",
  },
  {
    name: "Modern Matrix",
    brand: "PulseAI",
    slogan: "Autonomous Intelligence",
    iconId: "lightning",
    layout: "badge",
    paletteIdx: 3,
    fontFamily: "font-sans",
    shape: "diamond",
  },
  {
    name: "Infinity Labs",
    brand: "Nexus",
    slogan: "Infinite Possibilities",
    iconId: "infinity",
    layout: "horizontal",
    paletteIdx: 4,
    fontFamily: "font-sans",
    shape: "none",
  },
];

export default function LogoMaker() {
  // Logo Content
  const [brandName, setBrandName] = useState("BrandName");
  const [slogan, setSlogan] = useState("Your Modern Slogan Here");
  const [selectedIconId, setSelectedIconId] = useState("rocket");

  // Visual Customizations
  const [layout, setLayout] = useState("stacked"); // 'stacked', 'horizontal', 'badge', 'monogram'
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [badgeShape, setBadgeShape] = useState("rounded-box"); // 'rounded-box', 'circle', 'hexagon', 'shield', 'diamond', 'none'
  const [fontFamily, setFontFamily] = useState("font-sans");
  const [letterSpacing, setLetterSpacing] = useState("tracking-widest");
  const [iconSize, setIconSize] = useState(64);
  const [fontSize, setFontSize] = useState(28);
  const [isTransparentBg, setIsTransparentBg] = useState(false);
  const [activeTab, setActiveTab] = useState("Tech & SaaS");
  const [toastNotice, setToastNotice] = useState("");

  const canvasRef = useRef(null);
  const svgRef = useRef(null);

  const currentPalette = COLOR_PALETTES[paletteIndex] || COLOR_PALETTES[0];
  const allIcons = ICON_CATEGORIES.flatMap((c) => c.icons);
  const currentIcon = allIcons.find((i) => i.id === selectedIconId) || allIcons[0];

  const showToast = (msg) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(""), 3000);
  };

  // Apply quick template
  const applyTemplate = (tpl) => {
    setBrandName(tpl.brand);
    setSlogan(tpl.slogan);
    setSelectedIconId(tpl.iconId);
    setLayout(tpl.layout);
    setPaletteIndex(tpl.paletteIdx);
    setFontFamily(tpl.fontFamily);
    setBadgeShape(tpl.shape);
    showToast(`✓ Applied template: ${tpl.name}`);
  };

  // Generate pure vector SVG code
  const getLogoSvgString = (targetWidth = 800, targetHeight = 600) => {
    const bgColor = isTransparentBg ? "none" : currentPalette.bg;
    const textColor = currentPalette.text;
    const gradientId = "logoGradientMain";

    // Shape backgrounds
    let shapeSvg = "";
    if (badgeShape === "circle") {
      shapeSvg = `<circle cx="50" cy="50" r="46" fill="url(#${gradientId})" opacity="0.15" stroke="url(#${gradientId})" stroke-width="2.5"/>`;
    } else if (badgeShape === "rounded-box") {
      shapeSvg = `<rect x="6" y="6" width="88" height="88" rx="20" fill="url(#${gradientId})" opacity="0.15" stroke="url(#${gradientId})" stroke-width="2.5"/>`;
    } else if (badgeShape === "hexagon") {
      shapeSvg = `<polygon points="50,4 92,26 92,74 50,96 8,74 8,26" fill="url(#${gradientId})" opacity="0.15" stroke="url(#${gradientId})" stroke-width="2.5"/>`;
    } else if (badgeShape === "diamond") {
      shapeSvg = `<polygon points="50,6 94,50 50,94 6,50" fill="url(#${gradientId})" opacity="0.15" stroke="url(#${gradientId})" stroke-width="2.5"/>`;
    }

    const iconElement = `
      <g transform="translate(25, 25) scale(2.08)">
        <path d="${currentIcon.path}" fill="url(#${gradientId})" stroke="url(#${gradientId})" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    `;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${targetWidth}" height="${targetHeight}" viewBox="0 0 ${targetWidth} ${targetHeight}">
  <defs>
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${currentPalette.color1}"/>
      <stop offset="100%" stop-color="${currentPalette.color2}"/>
    </linearGradient>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;900&amp;family=Playfair+Display:wght@700&amp;family=Space+Mono:wght@700&amp;display=swap');
      .brand-title { font-family: ${fontFamily === 'font-serif' ? "'Playfair Display', serif" : fontFamily === 'font-mono' ? "'Space Mono', monospace" : "'Inter', sans-serif"}; font-weight: 900; font-size: ${fontSize * 1.5}px; fill: ${textColor}; letter-spacing: 2px; }
      .brand-slogan { font-family: 'Inter', sans-serif; font-size: ${Math.max(fontSize * 0.5, 12)}px; font-weight: 600; fill: ${textColor}; opacity: 0.7; letter-spacing: 4px; text-transform: uppercase; }
    </style>
  </defs>
  
  ${bgColor !== "none" ? `<rect width="100%" height="100%" fill="${bgColor}" rx="16"/>` : ""}

  <g transform="translate(${targetWidth / 2}, ${targetHeight / 2})">
    ${
      layout === "stacked"
        ? `
      <g transform="translate(-50, -110)">
        ${shapeSvg}
        ${iconElement}
      </g>
      <text class="brand-title" x="0" y="45" text-anchor="middle">${brandName}</text>
      ${slogan ? `<text class="brand-slogan" x="0" y="80" text-anchor="middle">${slogan}</text>` : ""}
    `
        : layout === "horizontal"
        ? `
      <g transform="translate(-200, -50)">
        ${shapeSvg}
        ${iconElement}
      </g>
      <g transform="translate(-70, 0)">
        <text class="brand-title" x="0" y="5" text-anchor="start">${brandName}</text>
        ${slogan ? `<text class="brand-slogan" x="0" y="35" text-anchor="start">${slogan}</text>` : ""}
      </g>
    `
        : layout === "badge"
        ? `
      <g transform="translate(-75, -95) scale(1.5)">
        ${shapeSvg}
        ${iconElement}
      </g>
      <text class="brand-title" x="0" y="90" text-anchor="middle">${brandName}</text>
      ${slogan ? `<text class="brand-slogan" x="0" y="115" text-anchor="middle">${slogan}</text>` : ""}
    `
        : `
      <!-- Monogram Style -->
      <circle cx="0" cy="-30" r="60" fill="url(#${gradientId})" opacity="0.15" stroke="url(#${gradientId})" stroke-width="3"/>
      <text x="0" y="-12" text-anchor="middle" font-size="52" font-weight="900" fill="url(#${gradientId})">${brandName.charAt(0)}</text>
      <text class="brand-title" x="0" y="65" text-anchor="middle">${brandName}</text>
      ${slogan ? `<text class="brand-slogan" x="0" y="95" text-anchor="middle">${slogan}</text>` : ""}
    `
    }
  </g>
</svg>`;
  };

  // Download SVG
  const handleDownloadSvg = () => {
    const svgCode = getLogoSvgString(1000, 750);
    downloadFile(svgCode, `${brandName.toLowerCase().replace(/\s+/g, "-")}-logo.svg`, "image/svg+xml");
    showToast("✓ Downloaded Vector SVG logo");
  };

  // Download PNG / JPG with high resolution (2000px)
  const handleDownloadRaster = (format = "png") => {
    const targetW = 2000;
    const targetH = 1500;
    const svgCode = getLogoSvgString(targetW, targetH);
    const svgBlob = new Blob([svgCode], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");

      if (format === "jpeg" || !isTransparentBg) {
        ctx.fillStyle = currentPalette.bg;
        ctx.fillRect(0, 0, targetW, targetH);
      }

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const mime = format === "jpeg" ? "image/jpeg" : "image/png";
      const filename = `${brandName.toLowerCase().replace(/\s+/g, "-")}-logo.${format === "jpeg" ? "jpg" : "png"}`;

      canvas.toBlob((blob) => {
        if (blob) {
          downloadFile(blob, filename, mime);
          showToast(`✓ Downloaded High-Res ${format.toUpperCase()} (2000x1500)`);
        }
      }, mime, 0.95);
    };

    img.src = url;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-[#111a27] p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-[#223247]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
            100% Free Client-Side Logo Studio • No API Keys Needed
          </span>
        </div>

        {/* Templates Quick Load */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Starter Templates:</label>
          <select
            onChange={(e) => {
              const t = LOGO_TEMPLATES.find((tpl) => tpl.name === e.target.value);
              if (t) applyTemplate(t);
            }}
            className="text-xs bg-white dark:bg-[#182333] border border-slate-300 dark:border-[#2a3c53] rounded-lg px-2.5 py-1.5 font-medium text-slate-800 dark:text-white outline-none cursor-pointer focus:border-cyan-500"
            defaultValue=""
          >
            <option value="" disabled>Choose template...</option>
            {LOGO_TEMPLATES.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Two-Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Controls & Styling (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Text Inputs */}
          <div className="bg-white dark:bg-[#131d2b] border border-slate-200 dark:border-[#223247] rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              1. Brand Identity
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Brand / Business Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value || "Brand")}
                className="tool-input font-bold text-sm"
                placeholder="e.g. ApexFlow"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Slogan / Tagline
              </label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="tool-input text-xs"
                placeholder="e.g. Cloud Solutions & Scale"
              />
            </div>
          </div>

          {/* 2. Choose Icon Mark */}
          <div className="bg-white dark:bg-[#131d2b] border border-slate-200 dark:border-[#223247] rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                2. Logo Icon / Symbol
              </h3>
              <div className="flex gap-1 text-[11px]">
                {ICON_CATEGORIES.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => setActiveTab(cat.category)}
                    className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                      activeTab === cat.category
                        ? "bg-blue-600 dark:bg-cyan-500 text-white"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {cat.category.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {ICON_CATEGORIES.find((c) => c.category === activeTab)?.icons.map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => setSelectedIconId(icon.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    selectedIconId === icon.id
                      ? "border-blue-500 dark:border-cyan-400 bg-blue-50 dark:bg-cyan-950/40 text-blue-600 dark:text-cyan-300 ring-2 ring-blue-500/20"
                      : "border-slate-200 dark:border-[#202f43] bg-slate-50 dark:bg-[#182333] text-slate-600 dark:text-slate-300 hover:border-slate-400"
                  }`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={icon.path} />
                  </svg>
                  <span className="text-[10px] font-semibold truncate max-w-full">{icon.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Color Palettes */}
          <div className="bg-white dark:bg-[#131d2b] border border-slate-200 dark:border-[#223247] rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              3. Color Theme & Gradients
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {COLOR_PALETTES.map((palette, idx) => (
                <button
                  key={palette.name}
                  onClick={() => setPaletteIndex(idx)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                    paletteIndex === idx
                      ? "border-blue-500 dark:border-cyan-400 ring-2 ring-blue-500/20 bg-blue-50/50 dark:bg-cyan-950/30"
                      : "border-slate-200 dark:border-[#202f43] hover:border-slate-300"
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-lg shadow-inner flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${palette.color1}, ${palette.color2})` }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{palette.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Layout & Badge Containers */}
          <div className="bg-white dark:bg-[#131d2b] border border-slate-200 dark:border-[#223247] rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              4. Layout & Container
            </h3>
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              {[
                { id: "stacked", label: "Stacked" },
                { id: "horizontal", label: "Side" },
                { id: "badge", label: "Emblem" },
                { id: "monogram", label: "Letter" },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLayout(l.id)}
                  className={`py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                    layout === l.id
                      ? "bg-blue-600 dark:bg-cyan-500 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-[#182333] text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Shape Outline */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Badge Shape:</label>
              <div className="grid grid-cols-5 gap-1 text-[11px]">
                {[
                  { id: "rounded-box", label: "Square" },
                  { id: "circle", label: "Circle" },
                  { id: "hexagon", label: "Hex" },
                  { id: "diamond", label: "Diamond" },
                  { id: "none", label: "Clean" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setBadgeShape(s.id)}
                    className={`py-1 rounded font-semibold cursor-pointer ${
                      badgeShape === s.id
                        ? "bg-slate-800 dark:bg-white text-white dark:text-slate-900 font-bold"
                        : "bg-slate-100 dark:bg-[#182333] text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Font */}
            <div className="flex items-center justify-between pt-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Font Family:</label>
              <div className="flex gap-1">
                {[
                  { id: "font-sans", label: "Modern" },
                  { id: "font-serif", label: "Luxury" },
                  { id: "font-mono", label: "Tech" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFontFamily(f.id)}
                    className={`px-2 py-0.5 rounded text-xs font-semibold cursor-pointer ${
                      fontFamily === f.id
                        ? "bg-blue-600 dark:bg-cyan-500 text-white"
                        : "bg-slate-100 dark:bg-[#182333] text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Vector Canvas & Export (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span>Live Vector Canvas</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                Vector 4K
              </span>
            </h3>

            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={isTransparentBg}
                onChange={(e) => setIsTransparentBg(e.target.checked)}
                className="rounded accent-blue-600"
              />
              Transparent PNG
            </label>
          </div>

          {/* Toast Notice */}
          {toastNotice && (
            <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <span>{toastNotice}</span>
            </div>
          )}

          {/* Vector Preview Box */}
          <div
            className={`min-h-[380px] sm:min-h-[440px] rounded-2xl border flex items-center justify-center p-8 transition-all relative overflow-hidden shadow-inner ${
              isTransparentBg
                ? "bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] border-slate-300 dark:border-[#223247]"
                : "border-slate-300 dark:border-[#223247]"
            }`}
            style={{ backgroundColor: isTransparentBg ? "transparent" : currentPalette.bg }}
          >
            {/* SVG Renderer */}
            <div
              className="w-full max-w-[500px] flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: getLogoSvgString(500, 360) }}
            />
          </div>

          {/* Download Action Buttons */}
          <div className="bg-slate-50 dark:bg-[#111a27] border border-slate-200 dark:border-[#223247] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">Export Your Logo Asset</div>
              <div className="text-[11px] text-slate-500">Commercial use ready, high-res & vector formats</div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownloadSvg}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                title="Download scalable vector SVG (for web, print, and editing)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>Vector SVG</span>
              </button>

              <button
                onClick={() => handleDownloadRaster("png")}
                className="px-3.5 py-2 rounded-xl bg-blue-600 dark:bg-cyan-500 hover:bg-blue-700 dark:hover:bg-cyan-400 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                title="Download 2000x1500px High-Res PNG"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>High-Res PNG</span>
              </button>

              <button
                onClick={() => handleDownloadRaster("jpeg")}
                className="px-3.5 py-2 rounded-xl bg-slate-800 dark:bg-[#1f2f44] hover:bg-slate-900 dark:hover:bg-[#283d58] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                title="Download JPG with solid background"
              >
                JPG (2K)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
