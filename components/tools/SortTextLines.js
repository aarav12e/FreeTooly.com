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

export default function SortTextLines() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");

  function sort(mode) {
    const lines = text.split("\n").filter((l) => l !== "");
    let sorted;
    if (mode === "asc") sorted = [...lines].sort((a, b) => a.localeCompare(b));
    else if (mode === "desc") sorted = [...lines].sort((a, b) => b.localeCompare(a));
    else sorted = shuffle(lines);
    setOutput(sorted.join("\n"));
  }

  return (
    <div>
      <textarea
        className="tool-input"
        rows={8}
        placeholder="Paste lines of text to sort..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex gap-2 mt-3">
        <button type="button" className="btn-primary text-sm" onClick={() => sort("asc")}>
          Sort A-Z
        </button>
        <button type="button" className="btn-secondary text-sm" onClick={() => sort("desc")}>
          Sort Z-A
        </button>
        <button type="button" className="btn-secondary text-sm" onClick={() => sort("random")}>
          Shuffle
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
