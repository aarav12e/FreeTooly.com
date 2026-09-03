"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function RemoveDuplicateLines() {
  const [text, setText] = useState("");
  const result = useMemo(() => {
    const lines = text.split("\n");
    const seen = new Set();
    const output = [];
    for (const line of lines) {
      if (!seen.has(line)) {
        seen.add(line);
        output.push(line);
      }
    }
    return output.join("\n");
  }, [text]);

  return (
    <div>
      <textarea
        className="tool-input"
        rows={8}
        placeholder="Paste a list with duplicate lines, one item per line..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-4">
        <textarea className="tool-output" rows={8} readOnly value={result} />
        <div className="mt-2">
          <CopyButton text={result} />
        </div>
      </div>
    </div>
  );
}
