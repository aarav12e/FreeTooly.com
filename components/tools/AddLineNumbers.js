"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function AddLineNumbers() {
  const [text, setText] = useState("");
  const numbered = useMemo(
    () =>
      text
        .split("\n")
        .map((line, i) => `${i + 1}. ${line}`)
        .join("\n"),
    [text]
  );

  return (
    <div>
      <textarea
        className="tool-input"
        rows={8}
        placeholder="Paste text to number, one line per number..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-4">
        <textarea className="tool-output" rows={8} readOnly value={numbered} />
        <div className="mt-2">
          <CopyButton text={numbered} />
        </div>
      </div>
    </div>
  );
}
