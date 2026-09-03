"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function FindReplace() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  const [matchCase, setMatchCase] = useState(false);
  const [replaceAll, setReplaceAll] = useState(true);

  const getResult = () => {
    if (!text || !find) return text;
    try {
      if (useRegex) {
        const flags = `${replaceAll ? "g" : ""}${matchCase ? "" : "i"}`;
        const regex = new RegExp(find, flags);
        return text.replace(regex, replace);
      } else {
        if (!matchCase) {
          const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), replaceAll ? "gi" : "i");
          return text.replace(regex, replace);
        } else {
          return replaceAll ? text.replaceAll(find, replace) : text.replace(find, replace);
        }
      }
    } catch (e) {
      return `Invalid regular expression: ${e.message}`;
    }
  };

  const result = getResult();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Find and Replace Text</h2>
        <p className="text-sm text-slate-500 mb-6">
          Quickly search and replace occurrences of words, characters, patterns, or Regular Expressions in bulk.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Input Text</label>
            <textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type the text you want to search through..."
              className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Find</label>
              <input
                type="text"
                value={find}
                onChange={(e) => setFind(e.target.value)}
                placeholder="Text or RegEx to find..."
                className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Replace With</label>
              <input
                type="text"
                value={replace}
                onChange={(e) => setReplace(e.target.value)}
                placeholder="Replacement text..."
                className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={matchCase}
                onChange={(e) => setMatchCase(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Match Case
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={useRegex}
                onChange={(e) => setUseRegex(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Use Regular Expressions (RegEx)
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={replaceAll}
                onChange={(e) => setReplaceAll(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Replace All Matches
            </label>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">Modified Output</label>
              {result && <CopyButton text={result} />}
            </div>
            <textarea
              readOnly
              rows={5}
              value={result}
              placeholder="Output will appear here..."
              className="w-full p-3.5 text-sm bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
