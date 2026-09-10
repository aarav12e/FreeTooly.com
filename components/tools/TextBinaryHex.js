"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

function textToBinary(str) {
  return Array.from(new TextEncoder().encode(str))
    .map((b) => b.toString(2).padStart(8, "0"))
    .join(" ");
}

function binaryToText(bin) {
  const bytes = bin.trim().split(/\s+/).map((b) => parseInt(b, 2));
  return new TextDecoder().decode(new Uint8Array(bytes));
}

function textToHex(str) {
  return Array.from(new TextEncoder().encode(str))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
}

function hexToText(hex) {
  const bytes = hex.trim().split(/\s+/).map((h) => parseInt(h, 16));
  return new TextDecoder().decode(new Uint8Array(bytes));
}

export default function TextBinaryHex() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [selectedMode, setSelectedMode] = useState("textToBinary");

  const modes = [
    { id: "textToBinary", label: "Text → Binary", icon: "📝", fn: textToBinary, color: "from-blue-500 to-blue-600" },
    { id: "binaryToText", label: "Binary → Text", icon: "🔤", fn: binaryToText, color: "from-purple-500 to-purple-600" },
    { id: "textToHex", label: "Text → Hex", icon: "🔤", fn: textToHex, color: "from-green-500 to-green-600" },
    { id: "hexToText", label: "Hex → Text", icon: "📝", fn: hexToText, color: "from-orange-500 to-orange-600" },
  ];

  function handleConvert() {
    const mode = modes.find(m => m.id === selectedMode);
    if (mode) {
      try {
        setOutput(mode.fn(input));
        setError("");
      } catch (e) {
        setError("Could not convert this input. Please check your input format.");
        setOutput("");
      }
    }
  }

  const handleQuickConvert = (modeId) => {
    setSelectedMode(modeId);
    const mode = modes.find(m => m.id === modeId);
    if (mode) {
      try {
        setOutput(mode.fn(input));
        setError("");
      } catch (e) {
        setError("Could not convert this input. Please check your input format.");
        setOutput("");
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Input Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Input Text
        </label>
        <textarea
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 dark:bg-gray-800 dark:text-white resize-none font-mono text-sm transition-all"
          rows={5}
          placeholder="Enter text, binary (space separated), or hex (space separated)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {/* Quick Convert Buttons */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Quick Convert
        </label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {modes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => handleQuickConvert(mode.id)}
              className={`relative overflow-hidden px-4 py-3 rounded-lg font-semibold text-white text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 ${
                selectedMode === mode.id
                  ? `bg-gradient-to-r ${mode.color} shadow-lg ring-2 ring-white dark:ring-gray-700`
                  : `bg-gradient-to-r ${mode.color} shadow-md hover:shadow-xl`
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-lg">{mode.icon}</span>
                <span>{mode.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Convert Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleConvert}
          disabled={!input.trim()}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg flex items-center justify-center gap-2"
        >
          <span className="text-2xl">⚡</span>
          Convert
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700 dark:text-red-400 font-semibold text-sm">{error}</p>
        </div>
      )}

      {/* Output Section */}
      {output && (
        <div className="space-y-3 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Output
            </label>
            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
              ✓ Converted
            </span>
          </div>
          <textarea
            className="w-full px-4 py-3 border-2 border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/10 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 dark:text-white resize-none font-mono text-sm cursor-text"
            rows={5}
            readOnly
            value={output}
          />
          <div className="flex gap-3">
            <CopyButton text={output} />
            <button
              type="button"
              onClick={() => {
                setOutput("");
                setError("");
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold rounded-lg transition-all duration-300"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
