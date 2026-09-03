"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function RemoveEmptyLines() {
  const [input, setInput] = useState("");
  const [trimWhitespace, setTrimWhitespace] = useState(true);

  const getCleanText = () => {
    if (!input) return "";
    const lines = input.split(/\r?\n/);
    const cleaned = lines.filter((line) => (trimWhitespace ? line.trim().length > 0 : line.length > 0));
    return cleaned.join("\n");
  };

  const output = getCleanText();
  const originalLineCount = input ? input.split(/\r?\n/).length : 0;
  const cleanedLineCount = output ? output.split(/\r?\n/).length : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Remove Empty Lines</h2>
        <p className="text-sm text-slate-500 mb-6">
          Instantly strip blank and whitespace-only lines from any text, list, or code snippet.
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">Input Text</label>
              <span className="text-xs text-slate-500">{originalLineCount} original lines</span>
            </div>
            <textarea
              rows={6}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste text with empty lines here..."
              className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={trimWhitespace}
                onChange={(e) => setTrimWhitespace(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Also remove lines with only spaces and tabs
            </label>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">
                Cleaned Output ({cleanedLineCount} lines)
              </label>
              {output && <CopyButton text={output} />}
            </div>
            <textarea
              readOnly
              rows={6}
              value={output}
              placeholder="Cleaned text will appear here..."
              className="w-full p-3.5 text-sm bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
