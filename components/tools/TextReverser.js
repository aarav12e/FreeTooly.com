"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function TextReverser() {
  const [text, setText] = useState("");
  const reversed = useMemo(() => text.split("").reverse().join(""), [text]);

  return (
    <div>
      <textarea
        className="tool-input"
        rows={6}
        placeholder="Type text to reverse..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-4">
        <textarea className="tool-output" rows={6} readOnly value={reversed} />
        <div className="mt-2">
          <CopyButton text={reversed} />
        </div>
      </div>
    </div>
  );
}
