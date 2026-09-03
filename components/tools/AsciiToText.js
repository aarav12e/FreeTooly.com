"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function AsciiToText() {
  const [mode, setMode] = useState("ascii-to-text");
  const [input, setInput] = useState("");

  const convert = () => {
    if (!input.trim()) return "";
    try {
      if (mode === "ascii-to-text") {
        const codes = input.trim().split(/[\s,]+/);
        return codes.map((c) => String.fromCharCode(parseInt(c, 10))).join("");
      } else {
        return input
          .split("")
          .map((char) => char.charCodeAt(0))
          .join(" ");
      }
    } catch (e) {
      return "Conversion error";
    }
  };

  const output = convert();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">ASCII & Text Converter</h2>
        <p className="text-sm text-slate-500 mb-6">
          Convert decimal ASCII code numbers to characters and vice-versa.
        </p>

        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setMode("ascii-to-text")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                mode === "ascii-to-text"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              ASCII Codes → Text
            </button>
            <button
              onClick={() => setMode("text-to-ascii")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                mode === "text-to-ascii"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Text → ASCII Codes
            </button>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">
                {mode === "ascii-to-text" ? "Input ASCII Codes (e.g. 72 101 108 108 111)" : "Input Plain Text"}
              </label>
              <button
                onClick={() => setInput(mode === "ascii-to-text" ? "70 114 101 101 84 111 111 108 121" : "FreeTooly")}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Sample Input
              </button>
            </div>
            <textarea
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "ascii-to-text" ? "Paste numbers separated by space..." : "Type text..."}
              className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">Result</label>
              {output && <CopyButton text={output} />}
            </div>
            <textarea
              readOnly
              rows={4}
              value={output}
              placeholder="Result will appear here..."
              className="w-full p-3.5 text-sm bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
