"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function RandomizeText() {
  const [input, setInput] = useState("Apple\nMango\nBanana\nOrange\nGrapes");
  const [output, setOutput] = useState("");
  const [randomizeMode, setRandomizeMode] = useState("lines");

  const randomizeLines = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    const lines = input.split("\n").filter((line) => line.trim() !== "");

    // Fisher-Yates shuffle algorithm for better randomization
    const shuffled = [...lines];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setOutput(shuffled.join("\n"));
  };

  const randomizeWords = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    const words = input.match(/\b\w+\b/g) || [];

    // Fisher-Yates shuffle algorithm
    const shuffled = [...words];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setOutput(shuffled.join("\n"));
  };

  const randomizeCharacters = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    const chars = input.split("");

    // Fisher-Yates shuffle algorithm
    const shuffled = [...chars];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setOutput(shuffled.join(""));
  };

  const handleRandomize = () => {
    switch (randomizeMode) {
      case "lines":
        randomizeLines();
        break;
      case "words":
        randomizeWords();
        break;
      case "characters":
        randomizeCharacters();
        break;
      default:
        randomizeLines();
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔀 Randomize Text</h2>
        <p className="text-gray-600 dark:text-gray-400">Shuffle your text in multiple ways - by lines, words, or characters</p>
      </div>

      {/* Randomize Mode Selection */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 space-y-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Randomize Mode
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setRandomizeMode("lines")}
            className={`px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform ${
              randomizeMode === "lines"
                ? "bg-purple-600 text-white shadow-lg scale-105"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-purple-300 dark:border-purple-700 hover:border-purple-500"
            }`}
          >
            <span className="text-lg">📝</span> Shuffle Lines
          </button>
          <button
            onClick={() => setRandomizeMode("words")}
            className={`px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform ${
              randomizeMode === "words"
                ? "bg-pink-600 text-white shadow-lg scale-105"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-pink-300 dark:border-pink-700 hover:border-pink-500"
            }`}
          >
            <span className="text-lg">💬</span> Shuffle Words
          </button>
          <button
            onClick={() => setRandomizeMode("characters")}
            className={`px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform ${
              randomizeMode === "characters"
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-blue-300 dark:border-blue-700 hover:border-blue-500"
            }`}
          >
            <span className="text-lg">🔤</span> Shuffle Characters
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Input Text
        </label>
        <textarea
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 dark:bg-gray-800 dark:text-white resize-none font-mono text-sm transition-all"
          rows={6}
          placeholder="Enter text, each line will be randomized..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Tip: Each line will be treated as a separate item when using "Shuffle Lines" mode
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleRandomize}
          disabled={!input.trim()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <span className="text-2xl">🎲</span>
          Randomize
        </button>
        <button
          onClick={clearAll}
          className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>🗑️</span>
          Clear All
        </button>
      </div>

      {/* Output Section */}
      {output && (
        <div className="space-y-3 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Randomized Output
            </label>
            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
              ✓ Randomized
            </span>
          </div>
          <textarea
            className="w-full px-4 py-3 border-2 border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/10 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 dark:text-white resize-none font-mono text-sm cursor-text"
            rows={8}
            readOnly
            value={output}
          />
          <div className="flex gap-3">
            <CopyButton text={output} />
            <button
              type="button"
              onClick={() => setOutput("")}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold rounded-lg transition-all duration-300"
            >
              Clear Output
            </button>
          </div>
        </div>
      )}

      {/* Features Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">📝 Shuffle Lines</h3>
          <p className="text-sm text-purple-800 dark:text-purple-400">
            Randomizes the order of each line. Perfect for shuffling lists or items.
          </p>
        </div>

        <div className="bg-pink-50 dark:bg-pink-900/20 border-l-4 border-pink-500 p-4 rounded-lg">
          <h3 className="font-semibold text-pink-900 dark:text-pink-300 mb-2">💬 Shuffle Words</h3>
          <p className="text-sm text-pink-800 dark:text-pink-400">
            Randomizes the order of words in your text. Great for mixing up sentences.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">🔤 Shuffle Characters</h3>
          <p className="text-sm text-blue-800 dark:text-blue-400">
            Randomizes individual characters. Use for anagrams or creative text scrambling.
          </p>
        </div>
      </div>
    </div>
  );
}
