"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

function beautifyCss(css, indentSize = 2) {
  if (!css.trim()) return "";

  const indentChar = " ".repeat(indentSize);
  let output = "";
  let indentLevel = 0;
  let inSelector = true;

  // Normalize: remove extra spaces but preserve structure
  let normalized = css.replace(/\/\*[\s\S]*?\*\//g, ""); // Remove comments
  normalized = normalized.replace(/\s+/g, " ").trim();

  let i = 0;
  while (i < normalized.length) {
    const char = normalized[i];
    const nextChar = normalized[i + 1];

    if (char === "{") {
      output += " {\n";
      indentLevel++;
      inSelector = false;
    } else if (char === "}") {
      output = output.trimEnd() + "\n";
      indentLevel = Math.max(indentLevel - 1, 0);
      output += indentChar.repeat(indentLevel) + "}\n";
      if (indentLevel === 0) output += "\n";
      inSelector = true;
    } else if (char === ";") {
      output += ";\n";
      if (indentLevel > 0) {
        output += indentChar.repeat(indentLevel);
      }
    } else if (char === ",") {
      output += ",\n";
      if (inSelector) {
        output += indentChar.repeat(Math.max(indentLevel, 0));
      }
    } else if (char === ":") {
      output += ": ";
      i++; // Skip next space if exists
      while (normalized[i + 1] === " ") i++;
    } else if (char === " " && (output.endsWith("\n") || nextChar === " ")) {
      // Skip extra spaces at beginning of line or multiple spaces
    } else if (char === " " && !output.endsWith("\n") && indentLevel === 0 && inSelector) {
      // Keep space in selectors
      output += char;
    } else if (char !== " " || (output.length > 0 && !output.endsWith("\n"))) {
      if (output.endsWith("\n") && char !== " " && indentLevel > 0 && !inSelector) {
        output += indentChar.repeat(indentLevel);
      }
      output += char;
    }

    i++;
  }

  return output
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function CssBeautifier() {
  const [input, setInput] = useState("body { margin: 0; padding: 0; } .container { width: 100%; max-width: 1200px; margin: 0 auto; }");
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState(2);

  const handleBeautify = () => {
    setOutput(beautifyCss(input, indentSize));
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🎨 CSS Beautifier</h2>
        <p className="text-gray-600 dark:text-gray-400">Format and beautify your CSS with proper indentation and structure</p>
      </div>

      {/* Options Section */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800 space-y-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Formatting Options
        </label>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Indent Size: <span className="text-orange-600 dark:text-orange-400">{indentSize} spaces</span>
            </label>
          </div>
          <input
            type="range"
            min="2"
            max="8"
            step="2"
            value={indentSize}
            onChange={(e) => setIndentSize(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Input CSS
        </label>
        <textarea
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 dark:bg-gray-800 dark:text-white resize-none font-mono text-sm transition-all"
          rows={6}
          placeholder="Paste your minified or unformatted CSS here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Supports selectors, properties, media queries, and comments
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={handleBeautify}
        disabled={!input.trim()}
        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg flex items-center justify-center gap-2"
      >
        <span>✨</span>
        Beautify CSS
      </button>

      {/* Output Section */}
      {output && (
        <div className="space-y-3 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Formatted Output
            </label>
            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
              ✓ Beautified
            </span>
          </div>
          <div className="bg-gray-900 dark:bg-black rounded-lg p-4 overflow-x-auto border border-gray-700">
            <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap break-words">
              {output}
            </pre>
          </div>
          <div className="flex gap-3">
            <CopyButton text={output} />
            <button
              type="button"
              onClick={() => setOutput("")}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold rounded-lg transition-all duration-300"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">✨ Features</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>✓ Proper indentation</li>
            <li>✓ Selector formatting</li>
            <li>✓ Property alignment</li>
            <li>✓ Customizable indent size</li>
          </ul>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">🎯 Supports</h3>
          <ul className="text-sm text-purple-800 dark:text-purple-400 space-y-1">
            <li>✓ Single & multiple selectors</li>
            <li>✓ CSS properties</li>
            <li>✓ Media queries</li>
            <li>✓ Minified or formatted CSS</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
