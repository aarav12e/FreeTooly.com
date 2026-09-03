"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function SnakeCamelConverter() {
  const [input, setInput] = useState("user_first_name_and_last_name");
  const [targetCase, setTargetCase] = useState("camel");
  const [output, setOutput] = useState("");

  const extractWords = (str) => {
    if (!str) return [];
    return str
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
      .replace(/[-_]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  };

  const convertLine = (line, type) => {
    const words = extractWords(line);
    if (words.length === 0) return "";

    switch (type) {
      case "camel":
        return words
          .map((w, i) =>
            i === 0
              ? w.toLowerCase()
              : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
          )
          .join("");
      case "snake":
        return words.map((w) => w.toLowerCase()).join("_");
      case "pascal":
        return words
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join("");
      case "kebab":
        return words.map((w) => w.toLowerCase()).join("-");
      case "constant":
        return words.map((w) => w.toUpperCase()).join("_");
      case "title":
        return words
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ");
      default:
        return line;
    }
  };

  const handleConvertClick = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    const result = input
      .split("\n")
      .map((line) => convertLine(line, targetCase))
      .join("\n");
    setOutput(result);
  };

  const handleModeChange = (mode) => {
    setTargetCase(mode);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const caseModes = [
    {
      label: "camelCase",
      val: "camel",
      example: "userFirstName",
      badge: "🐫",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 17l6-6-6-6" />
          <path d="M12 19h8" />
        </svg>
      ),
    },
    {
      label: "snake_case",
      val: "snake",
      example: "user_first_name",
      badge: "🐍",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h16" />
          <path d="M9 16h6" />
        </svg>
      ),
    },
    {
      label: "PascalCase",
      val: "pascal",
      example: "UserFirstName",
      badge: "📦",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20h16" />
          <path d="M6 16l6-12 6 12" />
          <path d="M8 12h8" />
        </svg>
      ),
    },
    {
      label: "kebab-case",
      val: "kebab",
      example: "user-first-name",
      badge: "🍢",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="9" y2="12" />
          <line x1="15" y1="12" x2="19" y2="12" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
    {
      label: "CONSTANT_CASE",
      val: "constant",
      example: "USER_FIRST_NAME",
      badge: "⚡",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
    {
      label: "Title Case",
      val: "title",
      example: "User First Name",
      badge: "🏷️",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7V4h16v3" />
          <path d="M9 20h6" />
          <path d="M12 4v16" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-[#131d2b] border border-slate-200 dark:border-[#223247] rounded-2xl p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-cyan-600 dark:to-blue-700 flex items-center justify-center text-white text-2xl shadow-md flex-shrink-0">
            🐍
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
              Snake Case & Camel Case Converter
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Convert text and code variables between camelCase, snake_case, PascalCase, kebab-case, and more.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Target Case Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              Select Target Case
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {caseModes.map((mode) => (
                <button
                  key={mode.val}
                  type="button"
                  onClick={() => handleModeChange(mode.val)}
                  className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border flex flex-col justify-between ${
                    targetCase === mode.val
                      ? "bg-blue-600 dark:bg-cyan-600 border-blue-600 dark:border-cyan-600 text-white shadow-md"
                      : "bg-slate-50 dark:bg-[#192738] border-slate-200 dark:border-[#223247] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#223247]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1.5 w-full">
                    <div className="flex items-center gap-1.5 font-bold truncate">
                      <span className="text-base leading-none">{mode.badge}</span>
                      <span className="truncate">{mode.label}</span>
                    </div>
                    <span className={targetCase === mode.val ? "text-white flex-shrink-0" : "text-blue-500 dark:text-cyan-400 flex-shrink-0"}>
                      {mode.icon}
                    </span>
                  </div>
                  <div
                    className={`text-[10px] truncate ${
                      targetCase === mode.val
                        ? "text-blue-100 dark:text-cyan-100"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    e.g. {mode.example}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Input Text Area */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>📝</span> Input Text / Code
              </label>
              {input && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-slate-400 hover:text-red-500 transition-colors inline-flex items-center gap-1 font-semibold"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Clear Input
                </button>
              )}
            </div>
            <textarea
              rows={4}
              value={input}
              onChange={handleInputChange}
              placeholder="Type or paste your text or variables here..."
              className="w-full p-3.5 text-sm bg-slate-50 dark:bg-[#192738] border border-slate-200 dark:border-[#223247] rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Convert Action Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleConvertClick}
              className="flex-1 py-3 px-6 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
              </svg>
              Convert Case
            </button>
          </div>

          {/* Output Area */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>✨</span> Converted Result
              </label>
              {output && <CopyButton text={output} />}
            </div>
            <textarea
              readOnly
              rows={4}
              value={output}
              placeholder="Converted output will appear here..."
              className="w-full p-3.5 text-sm bg-slate-100 dark:bg-[#152233] border border-slate-200 dark:border-[#223247] rounded-xl font-mono text-slate-800 dark:text-cyan-300 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}