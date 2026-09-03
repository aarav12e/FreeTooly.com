"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

function LogoIcon() {
  return (
    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M12 12v9" />
        <path d="m8 17 4 4 4-4" />
      </svg>
    </div>
  );
}

const popularTools = [
  { label: "Word to PDF", href: "/tools/word-to-pdf" },
  { label: "PDF to Word", href: "/tools/pdf-to-word" },
  { label: "Merge PDF", href: "/tools/merge-pdf" },
  { label: "Compress PDF", href: "/tools/compress-pdf" },
  { label: "Crop JPG Image", href: "/tools/crop-jpg" },
  { label: "Word Counter", href: "/tools/word-counter" },
];

const categoryLinks = [
  { label: "PDF Tools", slug: "pdf-tools" },
  { label: "Image Tools", slug: "image-tools" },
  { label: "Word Tools", slug: "word-tools" },
  { label: "Text & Editing", slug: "editing" },
  { label: "Converters", slug: "converter" },
  { label: "Programming", slug: "programming" },
];

const legalLinks = [
  { label: "Legal Information", href: "/legal" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const handleCategoryClick = (e, slug) => {
    e.preventDefault();
    if (pathname !== "/") {
      router.push("/");
      setTimeout(() => {
        document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
        window.dispatchEvent(new CustomEvent("setCategory", { detail: slug }));
      }, 300);
    } else {
      document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
      window.dispatchEvent(new CustomEvent("setCategory", { detail: slug }));
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200 mt-20 text-slate-600 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                  <path d="M12 12v9" />
                  <path d="m8 17 4 4 4-4" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-xl text-slate-900 tracking-tight">
                  FreeTooly
                </span>
                <span className="text-[10px] font-semibold text-blue-600 tracking-wider uppercase">
                  Online Utility Workbench
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              FreeTooly provides simple, accurate, and easy-to-use online utilities for PDF, text, images,
              code formatting, and daily productivity needs. 100% free with zero sign-up required.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>100+ Free Online Tools</span>
            </div>
          </div>

          {/* Popular Tools Links */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Popular Tools</div>
            <ul className="space-y-2.5 text-xs">
              {popularTools.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-blue-600 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Links */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Categories</div>
            <ul className="space-y-2.5 text-xs">
              {categoryLinks.map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={(e) => handleCategoryClick(e, cat.slug)}
                    className="hover:text-blue-600 transition-colors text-left font-normal cursor-pointer"
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal Links */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Legal & Info</div>
            <ul className="space-y-2.5 text-xs">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-blue-600 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} FreeTooly. All rights reserved.</div>
          <div className="flex gap-5 font-medium">
            <Link href="/legal" className="hover:text-blue-600">Legal</Link>
            <Link href="/privacy-policy" className="hover:text-blue-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-600">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
