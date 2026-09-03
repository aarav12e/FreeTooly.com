"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function HexToRgb() {
  const [hex, setHex] = useState("#3B82F6");

  const hexToRgb = (hexStr) => {
    let clean = hexStr.replace(/^#/, "");
    if (clean.length === 3) {
      clean = clean.split("").map((c) => c + c).join("");
    }
    if (clean.length !== 6) return null;
    const num = parseInt(clean, 16);
    if (isNaN(num)) return null;
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const rgb = hexToRgb(hex);
  const rgbString = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "Invalid Hex Code";
  const hslString = rgb ? getHsl(rgb.r, rgb.g, rgb.b) : "";

  function getHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">HEX to RGB Color Converter</h2>
        <p className="text-sm text-slate-500 mb-6">
          Convert hexadecimal color codes to RGB, RGBA, and HSL formats with interactive preview.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
                Hex Color Input
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={rgb ? `#${hex.replace(/^#/, "")}` : "#3B82F6"}
                  onChange={(e) => setHex(e.target.value.toUpperCase())}
                  className="w-12 h-12 rounded-xl cursor-pointer border border-slate-200 p-0.5"
                />
                <input
                  type="text"
                  value={hex}
                  onChange={(e) => setHex(e.target.value)}
                  placeholder="#3B82F6"
                  className="flex-1 p-3 text-base font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">RGB Format</span>
                  <span className="font-mono text-sm font-semibold text-slate-800">{rgbString}</span>
                </div>
                {rgb && <CopyButton text={rgbString} />}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">HSL Format</span>
                  <span className="font-mono text-sm font-semibold text-slate-800">{hslString}</span>
                </div>
                {rgb && <CopyButton text={hslString} />}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-slate-200 bg-slate-50">
            <div
              className="w-36 h-36 rounded-2xl shadow-xl border-4 border-white transition-all transform hover:scale-105"
              style={{ backgroundColor: rgb ? rgbString : "transparent" }}
            />
            <span className="mt-3 text-xs font-mono font-bold text-slate-600">{hex}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
