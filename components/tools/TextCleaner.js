"use client";

import { useState, useMemo } from "react";
import CopyButton from "@/components/CopyButton";
import { downloadFile } from "@/lib/file-utils";

// Comprehensive preset one-click actions
const PRESETS = [
  {
    name: "Clean Article / Essay",
    desc: "Trim, remove extra spaces, fix curly quotes, strip HTML & decode entities",
    apply: (text) => {
      let t = text.replace(/<[^>]*>/g, ""); // Strip HTML
      t = decodeHtmlEntities(t);
      t = normalizeQuotes(t);
      t = t.replace(/[ \t]+/g, " "); // Collapse spaces
      t = t.split("\n").map((l) => l.trim()).join("\n"); // Trim lines
      t = t.replace(/\n{3,}/g, "\n\n"); // Max 2 newlines
      return t.trim();
    },
  },
  {
    name: "Clean Code / Snippet",
    desc: "Remove trailing spaces, normalize tabs to 2 spaces, fix zero-width spaces",
    apply: (text) => {
      let t = text.replace(/[\u200B-\u200D\uFEFF]/g, ""); // Zero-width spaces
      t = t.replace(/\t/g, "  ");
      t = t.split("\n").map((l) => l.trimEnd()).join("\n");
      return t;
    },
  },
  {
    name: "Deduplicate & Sort List",
    desc: "Remove duplicate lines, remove empty lines, and sort alphabetically",
    apply: (text) => {
      const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      return Array.from(new Set(lines)).sort((a, b) => a.localeCompare(b)).join("\n");
    },
  },
  {
    name: "Plain Text Stripper",
    desc: "Remove emojis, HTML, markdown, URLs, and non-ASCII symbols",
    apply: (text) => {
      let t = text.replace(/<[^>]*>/g, "");
      t = t.replace(/https?:\/\/[^\s]+/g, "");
      t = t.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, "");
      t = t.replace(/[^\x00-\x7F]/g, "");
      t = t.replace(/[ \t]+/g, " ").trim();
      return t;
    },
  },
  {
    name: "CSV / Single Line Formatter",
    desc: "Remove newlines and join all lines with comma & space",
    apply: (text) => {
      return text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .join(", ");
    },
  },
];

// Helper functions for string cleaning
function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function normalizeQuotes(str) {
  return str
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2026]/g, "...");
}

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function TextCleaner() {
  const [input, setInput] = useState(
    `  <h1>Hello World! 👋</h1>\n\nThis is a “sample” text with   extra   spaces, URLs like https://example.com, and duplicated lines.\n\nDuplicated line item 1\nDuplicated line item 1\nDuplicated line item 2\n\nAccents like café, résumé, and emojis 🚀🔥✨.`
  );

  // Search & Replace state
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  const [matchCase, setMatchCase] = useState(false);

  // Prefix & Suffix state
  const [linePrefix, setLinePrefix] = useState("");
  const [lineSuffix, setLineSuffix] = useState("");

  // Category filter tab
  const [activeCategory, setActiveCategory] = useState("All");

  // Output state
  const [history, setHistory] = useState([]);
  const [statusNotice, setStatusNotice] = useState("");

  const showStatus = (msg) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(""), 3000);
  };

  const applyTransformation = (transformFn, label) => {
    try {
      setHistory((prev) => [input, ...prev.slice(0, 9)]);
      const result = transformFn(input);
      setInput(result);
      showStatus(`✓ Applied: ${label}`);
    } catch (err) {
      showStatus(`Error applying ${label}: ${err.message}`);
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prev = history[0];
      setHistory((h) => h.slice(1));
      setInput(prev);
      showStatus("✓ Reverted last action");
    }
  };

  // Find & Replace action
  const handleFindReplace = () => {
    if (!findText) {
      showStatus("Please enter text to find");
      return;
    }
    applyTransformation((t) => {
      if (useRegex) {
        const flags = matchCase ? "g" : "gi";
        const regex = new RegExp(findText, flags);
        return t.replace(regex, replaceText);
      } else {
        if (matchCase) {
          return t.replaceAll(findText, replaceText);
        } else {
          const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
          return t.replace(regex, replaceText);
        }
      }
    }, "Find & Replace");
  };

  // Line Prefix / Suffix action
  const handleApplyPrefixSuffix = () => {
    if (!linePrefix && !lineSuffix) {
      showStatus("Please enter prefix or suffix");
      return;
    }
    applyTransformation((t) => {
      return t
        .split("\n")
        .map((line) => (line.trim() ? `${linePrefix}${line}${lineSuffix}` : line))
        .join("\n");
    }, "Add Prefix / Suffix");
  };

  // Statistics before / after
  const stats = useMemo(() => {
    const chars = input.length;
    const charsNoSpace = input.replace(/\s/g, "").length;
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const lines = input ? input.split("\n").length : 0;
    const nonBlankLines = input.split("\n").filter((l) => l.trim() !== "").length;
    return { chars, charsNoSpace, words, lines, nonBlankLines };
  }, [input]);

  // Clean features dictionary
  const FEATURE_GROUPS = [
    {
      category: "Spaces & Formatting",
      tools: [
        {
          id: "remove-extra-spaces",
          label: "Remove Extra Spaces",
          desc: "Collapses consecutive spaces into a single space",
          fn: (t) => t.replace(/[ \t]+/g, " "),
        },
        {
          id: "trim-all-lines",
          label: "Trim Every Line",
          desc: "Removes leading and trailing whitespace from each line",
          fn: (t) => t.split("\n").map((l) => l.trim()).join("\n"),
        },
        {
          id: "remove-empty-lines",
          label: "Remove Empty Lines",
          desc: "Deletes all empty or whitespace-only lines",
          fn: (t) => t.split("\n").filter((l) => l.trim() !== "").join("\n"),
        },
        {
          id: "remove-trailing-spaces",
          label: "Remove Trailing Spaces",
          desc: "Cleans spaces at the end of lines",
          fn: (t) => t.split("\n").map((l) => l.trimEnd()).join("\n"),
        },
        {
          id: "collapse-blank-lines",
          label: "Collapse Blank Lines",
          desc: "Reduces 3+ empty lines to at most 1 blank line",
          fn: (t) => t.replace(/\n{3,}/g, "\n\n"),
        },
        {
          id: "remove-all-spaces",
          label: "Remove All Spaces",
          desc: "Strips all spaces and tab characters entirely",
          fn: (t) => t.replace(/[ \t]/g, ""),
        },
        {
          id: "single-line",
          label: "Convert to Single Line",
          desc: "Replaces all line breaks with a single space",
          fn: (t) => t.replace(/\r?\n|\r/g, " ").replace(/\s+/g, " ").trim(),
        },
        {
          id: "tabs-to-spaces",
          label: "Tabs to 2 Spaces",
          desc: "Replaces all tab characters with 2 spaces",
          fn: (t) => t.replace(/\t/g, "  "),
        },
        {
          id: "tabs-to-4spaces",
          label: "Tabs to 4 Spaces",
          desc: "Replaces all tab characters with 4 spaces",
          fn: (t) => t.replace(/\t/g, "    "),
        },
        {
          id: "remove-hidden-chars",
          label: "Remove Hidden / Zero-Width",
          desc: "Strips zero-width spaces, BOM, and non-printable control chars",
          fn: (t) => t.replace(/[\u200B-\u200D\uFEFF\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ""),
        },
      ],
    },
    {
      category: "HTML & Web",
      tools: [
        {
          id: "strip-html",
          label: "Strip HTML & XML Tags",
          desc: "Removes all HTML tags like <div>, <p>, <a>, etc.",
          fn: (t) => t.replace(/<[^>]*>/g, ""),
        },
        {
          id: "decode-entities",
          label: "Decode HTML Entities",
          desc: "Converts &amp;, &lt;, &gt;, &quot;, &#39; into real characters",
          fn: (t) => decodeHtmlEntities(t),
        },
        {
          id: "strip-urls",
          label: "Remove URLs & Links",
          desc: "Strips all http/https/ftp web links",
          fn: (t) => t.replace(/https?:\/\/[^\s]+/g, ""),
        },
        {
          id: "extract-urls",
          label: "Extract URLs Only",
          desc: "Extracts all URLs into a clean line-by-line list",
          fn: (t) => {
            const matches = t.match(/https?:\/\/[^\s]+/g) || [];
            return Array.from(new Set(matches)).join("\n");
          },
        },
        {
          id: "strip-emails",
          label: "Remove Email Addresses",
          desc: "Strips email addresses from text",
          fn: (t) => t.replace(/[\w.-]+@[\w.-]+\.\w+/g, ""),
        },
        {
          id: "extract-emails",
          label: "Extract Emails Only",
          desc: "Extracts all email addresses into a clean list",
          fn: (t) => {
            const matches = t.match(/[\w.-]+@[\w.-]+\.\w+/g) || [];
            return Array.from(new Set(matches)).join("\n");
          },
        },
        {
          id: "strip-markdown",
          label: "Strip Markdown Formatting",
          desc: "Removes headers, bold, italics, links, and code markers",
          fn: (t) =>
            t
              .replace(/#{1,6}\s+/g, "")
              .replace(/\*\*([^*]+)\*\*/g, "$1")
              .replace(/\*([^*]+)\*/g, "$1")
              .replace(/__([^_]+)__/g, "$1")
              .replace(/_([^_]+)_/g, "$1")
              .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
              .replace(/`([^`]+)`/g, "$1")
              .replace(/```[\s\S]*?```/g, ""),
        },
      ],
    },
    {
      category: "Characters & Symbols",
      tools: [
        {
          id: "remove-punctuation",
          label: "Remove All Punctuation",
          desc: "Strips .,!?;:\"'()[]{}-_ and symbols",
          fn: (t) => t.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'\[\]<>\\|]/g, ""),
        },
        {
          id: "remove-emojis",
          label: "Remove Emojis",
          desc: "Strips all emoji pictographs and symbols",
          fn: (t) =>
            t.replace(
              /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
              ""
            ),
        },
        {
          id: "remove-digits",
          label: "Remove Digits (0-9)",
          desc: "Strips all numerical digits from text",
          fn: (t) => t.replace(/[0-9]/g, ""),
        },
        {
          id: "extract-digits",
          label: "Keep Only Digits",
          desc: "Strips everything except numbers and spaces",
          fn: (t) => t.replace(/[^0-9\s]/g, ""),
        },
        {
          id: "keep-letters-only",
          label: "Keep Letters Only (A-Z)",
          desc: "Strips all numbers and punctuation, keeping only letters",
          fn: (t) => t.replace(/[^a-zA-Z\s]/g, ""),
        },
        {
          id: "remove-non-ascii",
          label: "Remove Non-ASCII Characters",
          desc: "Strips foreign and non-English unicode characters",
          fn: (t) => t.replace(/[^\x00-\x7F]/g, ""),
        },
        {
          id: "remove-accents",
          label: "Remove Accents & Diacritics",
          desc: "Converts accented letters (é, à, ö, ñ) to plain letters (e, a, o, n)",
          fn: (t) => removeAccents(t),
        },
        {
          id: "fix-quotes",
          label: "Straighten Curly Quotes",
          desc: 'Converts “”‘’ and dashes into standard standard "" and \'\'',
          fn: (t) => normalizeQuotes(t),
        },
      ],
    },
    {
      category: "Lines & Lists",
      tools: [
        {
          id: "dedupe-lines",
          label: "Deduplicate Lines",
          desc: "Removes duplicate lines, keeping first occurrence",
          fn: (t) => {
            const seen = new Set();
            return t
              .split("\n")
              .filter((line) => {
                if (seen.has(line)) return false;
                seen.add(line);
                return true;
              })
              .join("\n");
          },
        },
        {
          id: "sort-az",
          label: "Sort Lines (A to Z)",
          desc: "Sorts lines in alphabetical ascending order",
          fn: (t) =>
            t
              .split("\n")
              .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
              .join("\n"),
        },
        {
          id: "sort-za",
          label: "Sort Lines (Z to A)",
          desc: "Sorts lines in reverse alphabetical order",
          fn: (t) =>
            t
              .split("\n")
              .sort((a, b) => b.localeCompare(a, undefined, { sensitivity: "base" }))
              .join("\n"),
        },
        {
          id: "sort-length-asc",
          label: "Sort by Line Length (Short to Long)",
          desc: "Sorts lines by character count ascending",
          fn: (t) => t.split("\n").sort((a, b) => a.length - b.length).join("\n"),
        },
        {
          id: "sort-length-desc",
          label: "Sort by Line Length (Long to Short)",
          desc: "Sorts lines by character count descending",
          fn: (t) => t.split("\n").sort((a, b) => b.length - a.length).join("\n"),
        },
        {
          id: "shuffle-lines",
          label: "Shuffle / Randomize Lines",
          desc: "Randomizes the order of all lines",
          fn: (t) => {
            const arr = t.split("\n");
            for (let i = arr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr.join("\n");
          },
        },
        {
          id: "reverse-lines",
          label: "Reverse Lines Order",
          desc: "Flips line order from bottom to top",
          fn: (t) => t.split("\n").reverse().join("\n"),
        },
        {
          id: "add-line-numbers",
          label: "Add Line Numbers (1. 2. 3.)",
          desc: "Prefixes each line with an index number",
          fn: (t) =>
            t
              .split("\n")
              .map((line, idx) => `${idx + 1}. ${line}`)
              .join("\n"),
        },
        {
          id: "remove-line-numbers",
          label: "Remove Line Numbers / Bullets",
          desc: "Strips leading numbers (1., [1], #1) or bullets (-, *, •)",
          fn: (t) => t.split("\n").map((line) => line.replace(/^[\s\d.()[\]#*•\-–—]+\s*/, "")).join("\n"),
        },
        {
          id: "join-commas",
          label: "Join Lines with Commas",
          desc: "Converts list to comma-separated values",
          fn: (t) =>
            t
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean)
              .join(", "),
        },
        {
          id: "join-semicolons",
          label: "Join Lines with Semicolons",
          desc: "Converts list to semicolon-separated values",
          fn: (t) =>
            t
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean)
              .join("; "),
        },
      ],
    },
    {
      category: "Case Transformations",
      tools: [
        {
          id: "case-lower",
          label: "lower case",
          desc: "Converts all letters to lowercase",
          fn: (t) => t.toLowerCase(),
        },
        {
          id: "case-upper",
          label: "UPPER CASE",
          desc: "Converts all letters to uppercase",
          fn: (t) => t.toUpperCase(),
        },
        {
          id: "case-title",
          label: "Title Case",
          desc: "Capitalizes the first letter of each word",
          fn: (t) =>
            t.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
        },
        {
          id: "case-sentence",
          label: "Sentence case",
          desc: "Capitalizes the first letter of each sentence",
          fn: (t) =>
            t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
        },
        {
          id: "case-camel",
          label: "camelCase",
          desc: "Converts words to camelCase format",
          fn: (t) =>
            t
              .toLowerCase()
              .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()),
        },
        {
          id: "case-snake",
          label: "snake_case",
          desc: "Converts words to snake_case separated by underscores",
          fn: (t) =>
            t
              .trim()
              .toLowerCase()
              .replace(/[\s\-_]+/g, "_")
              .replace(/[^\w_]/g, ""),
        },
        {
          id: "case-kebab",
          label: "kebab-case",
          desc: "Converts words to kebab-case separated by hyphens",
          fn: (t) =>
            t
              .trim()
              .toLowerCase()
              .replace(/[\s\-_]+/g, "-")
              .replace(/[^\w-]/g, ""),
        },
        {
          id: "case-inverse",
          label: "iNvErSe CaSe",
          desc: "Alternates capital and lowercase letters",
          fn: (t) =>
            t
              .split("")
              .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
              .join(""),
        },
      ],
    },
  ];

  const categories = ["All", ...FEATURE_GROUPS.map((g) => g.category)];

  const displayedGroups =
    activeCategory === "All"
      ? FEATURE_GROUPS
      : FEATURE_GROUPS.filter((g) => g.category === activeCategory);

  const handleDownload = () => {
    downloadFile(input, "cleaned-text.txt", "text/plain");
    showStatus("✓ Saved cleaned-text.txt");
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* 1-Click Quick Clean Presets                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-slate-50 dark:bg-[#111a27] border border-slate-200 dark:border-[#223247] rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <span>⚡ 1-Click Smart Cleaners</span>
          </label>
          <span className="text-[11px] text-slate-400">Instant batch optimization</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyTransformation(preset.apply, preset.name)}
              className="text-left p-3 rounded-xl bg-white dark:bg-[#182333] hover:bg-blue-50 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-[#28394e] hover:border-blue-500 dark:hover:border-cyan-500/50 transition-all group shadow-xs cursor-pointer"
            >
              <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                {preset.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {preset.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main Text Editor Workspace                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span>Text Content</span>
            <span className="text-[11px] font-normal text-slate-400">
              ({stats.words} words • {stats.chars} chars • {stats.lines} lines)
            </span>
          </label>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={handleUndo}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-[#182333] hover:bg-slate-200 dark:hover:bg-[#202f43] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#26374d] transition-all flex items-center gap-1 cursor-pointer"
                title="Undo last transformation"
              >
                <span>↩ Undo</span>
              </button>
            )}
            <button
              onClick={() => {
                setHistory((prev) => [input, ...prev.slice(0, 9)]);
                setInput("");
                showStatus("✓ Cleared editor");
              }}
              className="text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors px-2 py-1"
            >
              Clear
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-[#182333] hover:bg-slate-200 dark:hover:bg-[#202f43] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#26374d] transition-all cursor-pointer"
            >
              Download .txt
            </button>
            <CopyButton text={input} label="Copy Cleaned Text" />
          </div>
        </div>

        {/* Status Toast Alert */}
        {statusNotice && (
          <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <span>{statusNotice}</span>
          </div>
        )}

        <textarea
          rows={9}
          placeholder="Paste or type text here to clean and transform..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="tool-input font-mono text-xs sm:text-sm leading-relaxed border-2 focus:border-blue-500 dark:focus:border-cyan-500"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Live Text Statistics Badges                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
        <div className="bg-slate-50 dark:bg-[#111a27] p-2.5 rounded-xl border border-slate-200 dark:border-[#223247]">
          <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-cyan-400">{stats.words}</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Words</div>
        </div>
        <div className="bg-slate-50 dark:bg-[#111a27] p-2.5 rounded-xl border border-slate-200 dark:border-[#223247]">
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{stats.chars}</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Characters</div>
        </div>
        <div className="bg-slate-50 dark:bg-[#111a27] p-2.5 rounded-xl border border-slate-200 dark:border-[#223247]">
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{stats.charsNoSpace}</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Chars (no space)</div>
        </div>
        <div className="bg-slate-50 dark:bg-[#111a27] p-2.5 rounded-xl border border-slate-200 dark:border-[#223247]">
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{stats.lines}</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Lines</div>
        </div>
        <div className="bg-slate-50 dark:bg-[#111a27] p-2.5 rounded-xl border border-slate-200 dark:border-[#223247]">
          <div className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">{stats.nonBlankLines}</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Filled Lines</div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Interactive Find & Replace + Line Prefix / Suffix Utility Box      */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Find & Replace */}
        <div className="bg-white dark:bg-[#131d2b] border border-slate-200 dark:border-[#223247] rounded-xl p-4 shadow-sm space-y-3">
          <div className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            🔍 Find & Replace
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Find text..."
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              className="tool-input text-xs"
            />
            <input
              type="text"
              placeholder="Replace with..."
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="tool-input text-xs"
            />
          </div>
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1 text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={matchCase}
                  onChange={(e) => setMatchCase(e.target.checked)}
                  className="rounded accent-blue-600"
                />
                Match Case
              </label>
              <label className="flex items-center gap-1 text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useRegex}
                  onChange={(e) => setUseRegex(e.target.checked)}
                  className="rounded accent-blue-600"
                />
                RegEx
              </label>
            </div>
            <button
              onClick={handleFindReplace}
              className="px-4 py-1.5 rounded-lg bg-blue-600 dark:bg-cyan-500 hover:bg-blue-700 dark:hover:bg-cyan-400 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              Replace All
            </button>
          </div>
        </div>

        {/* Add Prefix / Suffix */}
        <div className="bg-white dark:bg-[#131d2b] border border-slate-200 dark:border-[#223247] rounded-xl p-4 shadow-sm space-y-3">
          <div className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            📌 Prefix & Suffix on Every Line
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Prefix (e.g. - or ' or <li>)..."
              value={linePrefix}
              onChange={(e) => setLinePrefix(e.target.value)}
              className="tool-input text-xs"
            />
            <input
              type="text"
              placeholder="Suffix (e.g. , or ' or </li>)..."
              value={lineSuffix}
              onChange={(e) => setLineSuffix(e.target.value)}
              className="tool-input text-xs"
            />
          </div>
          <div className="flex justify-end pt-1">
            <button
              onClick={handleApplyPrefixSuffix}
              className="px-4 py-1.5 rounded-lg bg-slate-800 dark:bg-[#202f43] hover:bg-slate-900 dark:hover:bg-[#2a3c53] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              Apply to Lines
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 50+ Modular Cleaning Tools Categorized                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 dark:border-[#223247] pb-2">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            🛠️ 50+ Cleaning Tools Library
          </label>
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-blue-600 dark:bg-cyan-500 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-[#182333] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#22344a]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Groups Grid */}
        <div className="space-y-5">
          {displayedGroups.map((group) => (
            <div key={group.category} className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {group.category} ({group.tools.length} features)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {group.tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => applyTransformation(tool.fn, tool.label)}
                    className="p-3 rounded-xl bg-white dark:bg-[#131d2b] hover:bg-blue-50 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-[#223247] hover:border-blue-500 dark:hover:border-cyan-500/60 text-left transition-all group shadow-2xs hover:shadow-md cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                        {tool.label}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {tool.desc}
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] font-bold text-blue-600 dark:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to apply →
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
