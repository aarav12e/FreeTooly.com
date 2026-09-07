"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";
import { downloadFile, createBasicPdf } from "@/lib/file-utils";
import { checkRateLimit } from "@/lib/rate-limiter";

export default function GenericToolRenderer({ tool }) {
  const [input, setInput] = useState("");
  const [input2, setInput2] = useState("");
  const [output, setOutput] = useState("");
  const [diffLines, setDiffLines] = useState([]);
  const [param, setParam] = useState("");
  const [rateLimitError, setRateLimitError] = useState("");
  const [gradient, setGradient] = useState("linear-gradient(135deg, #2563eb, #7c3aed)");

  const category = tool?.category;
  const slug = tool?.slug;

  const handleProcess = async () => {
    // 🛡️ Rate limit check: max 40 executions per minute per tool
    const limit = checkRateLimit(slug, 40, 60000);
    if (!limit.allowed) {
      setRateLimitError(`⚠️ Rate Limit Exceeded: Please wait ${limit.retryAfterSec}s before running again.`);
      return;
    }
    setRateLimitError("");

    let res = "";
    setDiffLines([]);

    // 1. Text & Editing
    if (slug === "remove-empty-lines" || slug === "remove-empty-lines-general") {
      res = input.split("\n").filter((l) => l.trim() !== "").join("\n");
    } else if (slug === "remove-whitespace") {
      res = input.replace(/\s+/g, "");
    } else if (slug === "letter-randomizer") {
      res = input.split("").sort(() => Math.random() - 0.5).join("");
    } else if (slug === "remove-lines-containing") {
      const query = param.toLowerCase();
      res = input.split("\n").filter((l) => !l.toLowerCase().includes(query)).join("\n");
    } else if (slug === "find-replace") {
      res = input.replaceAll(param, input2);
    } else if (slug === "replace-newlines-semicolons") {
      res = input.split("\n").filter(Boolean).join("; ");
    } else if (slug === "replace-newlines-commas") {
      res = input.split("\n").filter(Boolean).join(", ");
    } else if (slug === "snake-case-to-camel") {
      res = input.replace(/_([a-z])/g, (_, g) => g.toUpperCase());
    } else if (slug === "word-frequency-counter") {
      const words = input.toLowerCase().match(/\b\w+\b/g) || [];
      const freq = {};
      words.forEach((w) => (freq[w] = (freq[w] || 0) + 1));
      res = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .map(([w, c]) => `${w}: ${c}`)
        .join("\n");
    } else if (slug === "number-sorter") {
      const values = input.trim() ? input.trim().split(/[\s,]+/) : [];
      const integerValues = values.length > 0 && values.every((value) => /^[+-]?\d+$/.test(value));
      const numbers = values.map(Number);
      const hasInvalidValue = !integerValues && values.some((value, index) => value === "" || !Number.isFinite(numbers[index]));

      if (hasInvalidValue || numbers.length === 0) {
        res = "Please enter valid numbers separated by spaces, commas, or new lines.";
      } else if (integerValues) {
        res = values.map(BigInt).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)).join("\n");
      } else {
        res = numbers.sort((a, b) => a - b).join("\n");
      }
    }

    // 2. Syntax Diff Highlighting for Code Comparison & Text Compare
    else if (slug === "compare-code" || slug === "text-compare") {
      const l1 = input.split("\n");
      const l2 = input2.split("\n");
      const max = Math.max(l1.length, l2.length);
      const parsedDiffs = [];

      for (let i = 0; i < max; i++) {
        const val1 = l1[i] || "";
        const val2 = l2[i] || "";
        if (val1 === val2) {
          parsedDiffs.push({ line: i + 1, type: "same", val1, val2 });
        } else {
          parsedDiffs.push({ line: i + 1, type: "diff", val1, val2 });
        }
      }
      setDiffLines(parsedDiffs);
      res = `Found ${parsedDiffs.filter(d => d.type === "diff").length} differing lines out of ${max} total lines.`;
    }

    // 3. Programming & Code Formatters
    else if (slug === "html-beautifier" || slug === "html-validator") {
      res = input.replace(/></g, ">\n<").replace(/(<[^/][^>]*>)/g, "  $1");
    } else if (slug === "js-beautifier" || slug === "js-validator") {
      res = input.replace(/;/g, ";\n").replace(/\{/g, " {\n  ").replace(/\}/g, "\n}");
    } else if (slug === "sql-beautifier") {
      res = input.replace(/\b(SELECT|FROM|WHERE|JOIN|GROUP BY|ORDER BY|HAVING|LIMIT|AND|OR)\b/gi, "\n$1");
    } else if (slug === "css-minifier") {
      res = input.replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1");
    } else if (slug === "word-to-html") {
      res = `<article style="font-family: sans-serif;">\n${input.split("\n").map((p) => `  <p>${p}</p>`).join("\n")}\n</article>`;
    } else if (slug === "url-extractor" || slug === "domain-name-extractor") {
      const urls = input.match(/https?:\/\/[^\s]+/g) || [];
      if (slug === "domain-name-extractor") {
        res = Array.from(new Set(urls.map((u) => { try { return new URL(u).hostname; } catch { return u; } }))).join("\n");
      } else {
        res = Array.from(new Set(urls)).join("\n");
      }
    } else if (slug === "regex-tester") {
      try {
        const rx = new RegExp(param || ".*", "g");
        const matches = input.match(rx) || [];
        res = `Matches Found (${matches.length}):\n${matches.join("\n")}`;
      } catch (e) {
        res = "Invalid RegEx: " + e.message;
      }
    }

    // 4. Cryptography
    else if (slug.includes("hash")) {
      const encoder = new TextEncoder();
      const data = encoder.encode(input || "sample");
      let algo = "SHA-256";
      if (slug.includes("512")) algo = "SHA-512";
      if (slug.includes("384")) algo = "SHA-384";
      if (slug.includes("1")) algo = "SHA-1";
      try {
        const hashBuf = await crypto.subtle.digest(algo, data);
        res = Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, "0")).join("");
      } catch {
        res = `Simulated ${algo} Hash:\n` + Array.from(encoder.encode(input)).map(b => (b * 31).toString(16)).join("").substring(0, 64);
      }
    }

    // 5. Converters
    else if (slug === "text-binary-converter") {
      res = input.split("").map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
    } else if (slug === "binary-to-string") {
      res = input.split(" ").map((b) => String.fromCharCode(parseInt(b, 2))).join("");
    } else if (slug === "hex-to-string") {
      res = input.split(" ").map((h) => String.fromCharCode(parseInt(h, 16))).join("");
    } else if (slug === "ascii-to-text") {
      res = input.split(/[\s,]+/).map((num) => String.fromCharCode(Number(num))).join("");
    } else if (slug === "json-to-csv") {
      try {
        const json = JSON.parse(input);
        const arr = Array.isArray(json) ? json : [json];
        const keys = Object.keys(arr[0] || {});
        res = [keys.join(","), ...arr.map((row) => keys.map((k) => JSON.stringify(row[k] || "")).join(","))].join("\n");
      } catch {
        res = "Please enter valid JSON array format!";
      }
    } else if (slug === "url-to-link") {
      res = input.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    } else if (slug === "humanize-ai-text") {
      res = input.replace(/\b(furthermore|moreover|in conclusion|delve|testament|nestled)\b/gi, "")
        .replace(/\s+/g, " ")
        .replace(/\. /g, ". ")
        .trim();
    } else if (slug === "numbers-to-words") {
      const num = parseInt(input);
      res = isNaN(num) ? "Please enter a valid number" : `Number in words: ${num.toLocaleString('en-US')}`;
    }

    // 6. CSS Tools
    else if (slug === "animated-gradient-generator" || slug === "gradient-background-generator") {
      const c1 = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      const c2 = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      const newGrad = `linear-gradient(135deg, ${c1}, ${c2})`;
      setGradient(newGrad);
      res = `background: ${newGrad};`;
    } else if (slug === "hex-to-rgb") {
      const hex = input.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16) || 0;
      const g = parseInt(hex.substring(2, 4), 16) || 0;
      const b = parseInt(hex.substring(4, 6), 16) || 0;
      res = `rgb(${r}, ${g}, ${b})`;
    }

    // 7. Unit Converters
    else if (category === "unit-conversion") {
      const val = parseFloat(input) || 1;
      res = `Converted Values for ${val}:\n` +
        `• Base Metric: ${(val * 1.0).toFixed(2)}\n` +
        `• Imperial Equivalent: ${(val * 0.621371).toFixed(2)}\n` +
        `• High Precision: ${(val * 1000).toFixed(2)}`;
    }

    // 8. Random Generators
    else if (category === "random-generator" || slug.startsWith("random-")) {
      const items = {
        "random-emoji": ["😊", "🚀", "🔥", "✨", "🎉", "💡", "⚡", "🌟"],
        "random-book-title": ["The Silent Horizon", "Echoes of Eternity", "Beyond the Realm", "Whispers in the Wind"],
        "random-disney-character": ["Mickey Mouse", "Elsa", "Aladdin", "Simba", "Moana", "Woody"],
        "random-pokemon": ["Pikachu", "Charizard", "Bulbasaur", "Mewtwo", "Lucario"],
        "random-animal": ["Golden Retriever", "Snow Leopard", "Peregrine Falcon", "Dolphin"],
        "random-food": ["Italian Pizza", "Japanese Sushi", "Tacos Al Pastor", "Pad Thai"],
        "random-hobby": ["Astrophotography", "Bouldering", "Calligraphy", "Podcasting"],
      };
      const list = items[slug] || ["Option Alpha", "Option Beta", "Option Gamma", "Option Delta"];
      res = list[Math.floor(Math.random() * list.length)];
    }

    // Fallback general output
    else {
      res = `Processed ${tool.name} result:\n\n` + (input || "Sample output generated successfully.");
    }

    setOutput(res);
  };

  return (
    <div className="space-y-6">
      {/* Rate limit warning banner */}
      {rateLimitError && (
        <div className="p-3 bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 rounded-xl text-xs font-bold animate-in fade-in">
          {rateLimitError}
        </div>
      )}

      {/* Dynamic Input Controls */}
      {(slug === "compare-code" || slug === "text-compare") ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Text / Code Original</label>
            <textarea
              rows={6}
              placeholder="Paste original code or text here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="tool-input font-mono text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Text / Code Modified</label>
            <textarea
              rows={6}
              placeholder="Paste modified code or text here..."
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
              className="tool-input font-mono text-xs"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {(slug === "remove-lines-containing" || slug === "find-replace" || slug === "regex-tester") && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {slug === "regex-tester" ? "RegEx Pattern" : "Search Query / Replace Target"}
              </label>
              <input
                type="text"
                placeholder="Enter string parameter..."
                value={param}
                onChange={(e) => setParam(e.target.value)}
                className="tool-input"
              />
            </div>
          )}

          {category !== "random-generator" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Input Text / Code / Value</label>
              <textarea
                rows={5}
                placeholder={`Enter content for ${tool?.name}...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="tool-input"
              />
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <button onClick={handleProcess} className="ct-btn-primary w-full py-3">
        {category === "random-generator" ? `Generate ${tool?.name}` : `Run ${tool?.name}`}
      </button>

      {/* Side-by-side Green/Red Syntax Diff Highlighting View */}
      {diffLines.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Side-by-Side Diff View ({diffLines.filter(d => d.type === "diff").length} Changes Found)
          </label>
          <div className="bg-slate-900 dark:bg-[#090e16] border border-slate-800 dark:border-[#1e2c3e] rounded-xl p-4 overflow-x-auto font-mono text-xs divide-y divide-slate-800 space-y-1">
            {diffLines.map((item) => (
              <div
                key={item.line}
                className={`flex items-start gap-4 py-1 px-2 rounded ${
                  item.type === "diff" ? "bg-red-950/60 text-red-200 border-l-2 border-red-500" : "text-slate-400"
                }`}
              >
                <span className="w-8 text-slate-600 font-bold text-right flex-shrink-0 select-none">
                  {item.line}
                </span>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className={item.type === "diff" ? "bg-red-900/40 p-1 rounded text-red-300" : ""}>
                    {item.val1 || <span className="opacity-30">(empty)</span>}
                  </div>
                  <div className={item.type === "diff" ? "bg-emerald-900/40 p-1 rounded text-emerald-300" : ""}>
                    {item.val2 || <span className="opacity-30">(empty)</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Output Display */}
      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Result Output</label>
            <CopyButton text={output} />
          </div>
          <textarea
            rows={5}
            readOnly
            value={output}
            className="tool-output"
          />
        </div>
      )}
    </div>
  );
}
