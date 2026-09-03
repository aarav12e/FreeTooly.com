"use client";

import { useState } from "react";

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
}

function CheckIcon() {
  return (
<<<<<<< HEAD
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
=======
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export default function CopyButton({ text, className = "" }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  }

  return (
    <button
      onClick={handleCopy}
<<<<<<< HEAD
      className={`ct-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 ${className}`}
=======
      className={`btn-secondary text-sm flex items-center gap-2 ${className}`}
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
      type="button"
    >
      {copied ? (
        <>
          <CheckIcon />
<<<<<<< HEAD
          <span className="text-emerald-600 font-bold">Copied!</span>
=======
          Copied!
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
        </>
      ) : (
        <>
          <CopyIcon />
<<<<<<< HEAD
          <span>Copy</span>
=======
          Copy
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
        </>
      )}
    </button>
  );
}
