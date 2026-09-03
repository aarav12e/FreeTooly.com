"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function RemoveExtraSpaces() {
  const [text, setText] = useState("");
  const cleaned = useMemo(() => text.replace(/[ \t]+/g, " ").replace(/\s+\n/g, "\n").trim(), [text]);

  return (
    <div>
      <textarea
        className="tool-input"
        rows={6}
        placeholder="Paste text with extra spaces..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-4">
        <textarea className="tool-output" rows={6} readOnly value={cleaned} />
        <div className="mt-2">
          <CopyButton text={cleaned} />
        </div>
      </div>
    </div>
  );
}
