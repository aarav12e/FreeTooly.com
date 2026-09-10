"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function SqlBeautifier() {
  const [input, setInput] = useState(
    "SELECT id, name, email FROM users WHERE status = 'active' AND age > 18 ORDER BY name LIMIT 10"
  );
  const [indentSize, setIndentSize] = useState(2);
  const [upperCase, setUpperCase] = useState(true);

  const beautifySql = () => {
    let sql = input.trim();
    if (!sql) return "";

    const indent = " ".repeat(indentSize);

    // Define keywords that should start on new lines
    const mainKeywords = ["SELECT", "FROM", "WHERE", "GROUP BY", "HAVING", "ORDER BY", "LIMIT", "OFFSET"];
    const joinKeywords = ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN", "CROSS JOIN", "JOIN"];
    const logicalOperators = ["AND", "OR"];

    // Step 1: Normalize the SQL (single spaces only, not newlines)
    let formatted = sql.replace(/\s+/g, " ");

    // Step 2: Add newlines before join keywords first (they're longer)
    joinKeywords.forEach((keyword) => {
      const regex = new RegExp(`\\s+${keyword}\\s+`, "gi");
      const replacement = upperCase ? `\n${keyword} ` : `\n${keyword.toLowerCase()} `;
      formatted = formatted.replace(regex, replacement);
    });

    // Step 3: Add newlines before main keywords
    mainKeywords.forEach((keyword) => {
      // Handle GROUP BY, ORDER BY, etc. specially
      if (keyword.includes(" ")) {
        const regex = new RegExp(`\\s+${keyword}\\s+`, "gi");
        const replacement = upperCase ? `\n${keyword} ` : `\n${keyword.toLowerCase()} `;
        formatted = formatted.replace(regex, replacement);
      } else {
        const regex = new RegExp(`\\s+\\b${keyword}\\b\\s+`, "gi");
        const replacement = upperCase ? `\n${keyword} ` : `\n${keyword.toLowerCase()} `;
        formatted = formatted.replace(regex, replacement);
      }
    });

    // Step 4: Add indented newlines before logical operators
    logicalOperators.forEach((op) => {
      const regex = new RegExp(`\\s+\\b${op}\\b\\s+`, "gi");
      const replacement = upperCase ? `\n${indent}${op} ` : `\n${indent}${op.toLowerCase()} `;
      formatted = formatted.replace(regex, replacement);
    });

    // Step 5: Split by newlines and apply intelligent indentation
    let lines = formatted.split("\n").map((line) => line.trim()).filter((line) => line);

    let result = [];

    lines.forEach((line) => {
      const upperLine = line.toUpperCase();

      // Check if line starts with a logical operator
      if (logicalOperators.some((op) => upperLine.startsWith(op))) {
        result.push(indent + line);
      }
      // Check if line starts with a join keyword
      else if (joinKeywords.some((kw) => upperLine.startsWith(kw))) {
        result.push(line);
      }
      // Main keywords get no extra indent
      else if (mainKeywords.some((kw) => {
        if (kw.includes(" ")) {
          return upperLine.startsWith(kw);
        }
        return upperLine.split(/\s+/)[0] === kw;
      })) {
        result.push(line);
      }
      // Everything else gets indented if after FROM/WHERE/SELECT
      else {
        result.push(indent + line);
      }
    });

    return result.join("\n");
  };

  const output = beautifySql();

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">SQL Beautifier</h2>
        <p className="text-gray-600 dark:text-gray-400">Format and beautify your SQL queries with proper indentation and syntax</p>
      </div>

      {/* Options Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 space-y-4">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Formatting Options</label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={upperCase}
                onChange={(e) => setUpperCase(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Convert Keywords to UPPERCASE
              </span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Indent Size: <span className="text-blue-600 dark:text-blue-400">{indentSize} spaces</span>
            </label>
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
      </div>

      {/* Input Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Input SQL Query
        </label>
        <textarea
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 dark:bg-gray-800 dark:text-white resize-none font-mono text-sm transition-all"
          rows={6}
          placeholder="Paste your SQL query here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Supports SELECT, JOIN, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT, and more
        </p>
      </div>

      {/* Output Section */}
      {output && (
        <div className="space-y-3 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Formatted Output
            </label>
            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
              ✓ Formatted
            </span>
          </div>
          <div className="bg-gray-900 dark:bg-black rounded-lg p-4 overflow-x-auto">
            <textarea
              className="w-full bg-gray-900 text-green-400 font-mono text-sm resize-none focus:outline-none cursor-text"
              rows={8}
              readOnly
              value={output}
              style={{ backgroundColor: "#111827" }}
            />
          </div>
          <div className="flex gap-3">
            <CopyButton text={output} />
            <button
              type="button"
              onClick={() => setInput("")}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold rounded-lg transition-all duration-300"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Features Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 p-4 rounded-lg">
          <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2">✨ Features</h3>
          <ul className="text-sm text-indigo-800 dark:text-indigo-400 space-y-1">
            <li>✓ Proper indentation</li>
            <li>✓ Keyword formatting</li>
            <li>✓ JOIN clause support</li>
            <li>✓ WHERE condition handling</li>
          </ul>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">💡 Supports</h3>
          <ul className="text-sm text-green-800 dark:text-green-400 space-y-1">
            <li>✓ SELECT, FROM, WHERE</li>
            <li>✓ JOIN (all types)</li>
            <li>✓ GROUP BY, HAVING</li>
            <li>✓ ORDER BY, LIMIT</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
