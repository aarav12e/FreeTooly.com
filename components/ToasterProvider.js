"use client";

import { useState, useEffect } from "react";

export function showToast(message, { icon = "⭐", type = "default", duration = 2800 } = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("showToast", {
      detail: { id: Date.now() + Math.random(), message, icon, type, duration },
    })
  );
}

export default function ToasterProvider() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const newToast = e.detail;
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, newToast.duration || 2800);
    };

    window.addEventListener("showToast", handleToast);
    return () => window.removeEventListener("showToast", handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-[#152336]/95 text-white border border-slate-700/80 dark:border-cyan-500/30 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200 transition-all text-xs sm:text-sm font-semibold"
        >
          <span className="text-base flex-shrink-0">{toast.icon}</span>
          <span className="flex-1 leading-snug">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
