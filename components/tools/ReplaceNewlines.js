"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function ReplaceNewlines({ defaultSeparator = "commas" }) {
  const [input, setInput] = useState("Apple\nBanana\nOrange\nMango\nPineapple");
  const [separator, setSeparator] = useState(defaultSeparator);
  const [trimItems, setTrimItems] = useState(true);

  const getReplacedText = () => {
    if (!input) return "";
    const lines = input.split(/\r?\n/);
    const cleaned = lines
      .map((l) => (trimItems ? l.trim() : l))
      .filter((l) => l.length > 0);

    const sepChar =
      separator === "commas"
        ? ", "
        : separator === "semicolons"
        ? "; "
        : separator === "spaces"
        ? " "
        : separator === "pipes"
        ? " | "
        : ", ";

    return cleaned.join(sepChar);
  };

  const output = getReplacedText();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Replace Newlines With {separator === "semicolons" ? "Semicolons" : "Commas"}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Convert vertical line-break lists into inline separated values (CSV, semicolon lists, and more).
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Input Multi-Line List</label>
            <textarea
              rows={5}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste line-by-line items here..."
              className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Delimiter:</span>
              <select
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none font-medium"
              >
                <option value="commas">Commas (, )</option>
                <option value="semicolons">Semicolons (; )</option>
                <option value="spaces">Spaces ( )</option>
                <option value="pipes">Pipes ( | )</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={trimItems}
                onChange={(e) => setTrimItems(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Trim whitespace from each line
            </label>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">Single-Line Output</label>
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
