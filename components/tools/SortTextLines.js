"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const lineCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

export default function SortTextLines() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [selectedMode, setSelectedMode] = useState(null);

  function sort(mode) {
    const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
    if (lines.length === 0) {
      setOutput("");
      return;
    }

    let sorted;
    if (mode === "asc") sorted = [...lines].sort((a, b) => lineCollator.compare(a.trim(), b.trim()));
    else if (mode === "desc") sorted = [...lines].sort((a, b) => lineCollator.compare(b.trim(), a.trim()));
    else sorted = shuffle(lines);
    setSelectedMode(mode);
    setOutput(sorted.join("\n"));
  }

  function clearText() {
    setText("");
    setOutput("");
    setSelectedMode(null);
  }

  const actionButtonClass = (mode) => `rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
    selectedMode === mode
      ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20 dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950"
      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-cyan-700 dark:hover:bg-slate-700"
  } disabled:cursor-not-allowed disabled:opacity-40`;

  const hasInput = text.trim().length > 0;

  return (
    <div>
      <textarea
        className="tool-input"
        rows={8}
        placeholder="Paste lines of text to sort..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className={actionButtonClass("asc")}
          onClick={() => sort("asc")}
          disabled={!hasInput}
          aria-pressed={selectedMode === "asc"}
        >
          Sort A-Z
        </button>
        <button
          type="button"
          className={actionButtonClass("desc")}
          onClick={() => sort("desc")}
          disabled={!hasInput}
          aria-pressed={selectedMode === "desc"}
        >
          Sort Z-A
        </button>
        <button
          type="button"
          className={actionButtonClass("random")}
          onClick={() => sort("random")}
          disabled={!hasInput}
          aria-pressed={selectedMode === "random"}
        >
          Shuffle
        </button>
        <button
          type="button"
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          onClick={clearText}
          disabled={!text && !output}
        >
          Clear
        </button>
      </div>
      {output && (
        <div className="mt-4">
          <textarea className="tool-output" rows={8} readOnly value={output} />
          <div className="mt-2">
            <CopyButton text={output} />
          </div>
        </div>
      )}
    </div>
  );
}
