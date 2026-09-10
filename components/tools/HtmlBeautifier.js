"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

function beautifyHtml(html, indentSize = 2) {
  if (!html.trim()) return "";

  const indentChar = " ".repeat(indentSize);
  let output = "";
  let indentLevel = 0;

  // Self-closing tags
  const selfClosingTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];

  // Void elements that don't need closing
  const voidElements = new Set(selfClosingTags);

  // Normalize whitespace but preserve content
  let html_clean = html.replace(/>\s+</g, "><"); // Remove whitespace between tags
  html_clean = html_clean.replace(/\s+/g, " "); // Collapse multiple spaces

  let i = 0;
  while (i < html_clean.length) {
    if (html_clean[i] === "<") {
      // Extract the tag
      let tagEnd = html_clean.indexOf(">", i);
      if (tagEnd === -1) break;

      const tagContent = html_clean.substring(i + 1, tagEnd);
      const isClosingTag = tagContent.startsWith("/");
      const isComment = tagContent.startsWith("!");
      const isDoctype = tagContent.toLowerCase().startsWith("!doctype");

      // Get tag name
      let tagName = tagContent.replace(/^\//, "").split(/[\s\/>]/)[0].toLowerCase();

      // Add indentation before closing tag
      if (isClosingTag && indentLevel > 0) {
        indentLevel--;
        output = output.trimEnd() + "\n" + indentChar.repeat(indentLevel);
      } else if (!output.endsWith("\n") && output.trim() !== "") {
        // Add newline if needed
        if (!isComment && !isDoctype) {
          output = output.trimEnd() + "\n" + indentChar.repeat(indentLevel);
        }
      } else if (output.endsWith("\n")) {
        output += indentChar.repeat(indentLevel);
      }

      // Add the tag
      output += html_clean.substring(i, tagEnd + 1);

      // Handle indentation for opening tags
      if (!isClosingTag && !isComment && !voidElements.has(tagName) && !tagContent.endsWith("/")) {
        output += "\n";
        indentLevel++;
      } else if (voidElements.has(tagName) || tagContent.endsWith("/")) {
        output += "\n";
      } else if (isComment || isDoctype) {
        output += "\n";
      }

      i = tagEnd + 1;
    } else {
      // Extract text content
      let textEnd = html_clean.indexOf("<", i);
      if (textEnd === -1) textEnd = html_clean.length;

      const textContent = html_clean.substring(i, textEnd).trim();

      if (textContent) {
        // Add indentation if needed
        if (output.endsWith("\n")) {
          output += indentChar.repeat(indentLevel);
        }
        output += textContent + "\n";
      }

      i = textEnd;
    }
  }

  return output
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function HtmlBeautifier() {
  const [input, setInput] = useState(
    '<html><head><title>Page</title></head><body><div class="container"><h1>Hello World</h1><p>This is a paragraph.</p></div></body></html>'
  );
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState(2);

  const handleBeautify = () => {
    setOutput(beautifyHtml(input, indentSize));
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🌐 HTML Beautifier</h2>
        <p className="text-gray-600 dark:text-gray-400">Format and beautify your HTML code with proper indentation</p>
      </div>

      {/* Options Section */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Formatting Options
        </label>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Indent Size: <span className="text-blue-600 dark:text-blue-400">{indentSize} spaces</span>
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
          Input HTML
        </label>
        <textarea
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 dark:bg-gray-800 dark:text-white resize-none font-mono text-sm transition-all"
          rows={7}
          placeholder="Paste your HTML code here (minified or formatted)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Supports all HTML tags, attributes, and self-closing elements
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={handleBeautify}
        disabled={!input.trim()}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg flex items-center justify-center gap-2"
      >
        <span>✨</span>
        Beautify HTML
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
            <li>✓ Proper tag indentation</li>
            <li>✓ Content alignment</li>
            <li>✓ Self-closing tag support</li>
            <li>✓ Customizable indent size</li>
          </ul>
        </div>

        <div className="bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-cyan-500 p-4 rounded-lg">
          <h3 className="font-semibold text-cyan-900 dark:text-cyan-300 mb-2">🎯 Supports</h3>
          <ul className="text-sm text-cyan-800 dark:text-cyan-400 space-y-1">
            <li>✓ All HTML tags & attributes</li>
            <li>✓ Nested elements</li>
            <li>✓ HTML comments</li>
            <li>✓ DOCTYPE declarations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
