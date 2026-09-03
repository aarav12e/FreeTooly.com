"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { tools, getToolBySlug } from "@/lib/tools-registry";
import { showToast } from "@/components/ToasterProvider";

// Favorite Helpers
export function toggleFavorite(slug, toolName) {
  if (typeof window === "undefined") return [];
  const stored = JSON.parse(localStorage.getItem("freetooly_favs") || "[]");
  let updated;
  const isCurrentlyFav = stored.includes(slug);
  const name = toolName || getToolBySlug(slug)?.name || "Tool";

  if (isCurrentlyFav) {
    updated = stored.filter((s) => s !== slug);
    showToast(`Removed "${name}" from Front Section`, { icon: "↩️" });
  } else {
    updated = [slug, ...stored];
    showToast(`Pinned "${name}" to Front Section!`, { icon: "⭐" });
  }
  localStorage.setItem("freetooly_favs", JSON.stringify(updated));
  window.dispatchEvent(new Event("favsUpdated"));
  return updated;
}

export function isFavorite(slug) {
  if (typeof window === "undefined") return false;
  const stored = JSON.parse(localStorage.getItem("freetooly_favs") || "[]");
  return stored.includes(slug);
}

// Recently Viewed Helpers
export function recordRecentTool(slug) {
  if (typeof window === "undefined" || !slug) return;
  const stored = JSON.parse(localStorage.getItem("freetooly_recents") || "[]");
  const filtered = stored.filter((s) => s !== slug);
  const updated = [slug, ...filtered].slice(0, 8); // Keep last 8 viewed tools
  localStorage.setItem("freetooly_recents", JSON.stringify(updated));
  window.dispatchEvent(new Event("recentsUpdated"));
}

export default function FavoritesBar() {
  return null;
}
