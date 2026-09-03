"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";
import { md5 } from "@/lib/md5";

export default function Md5Hash() {
  const [text, setText] = useState("");
  const hash = useMemo(() => (text ? md5(text) : ""), [text]);

  return (
    <div>
      <textarea
        className="tool-input"
        rows={5}
        placeholder="Enter text to hash..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {hash && (
        <div className="mt-4">
          <input readOnly value={hash} className="tool-output w-full" />
          <div className="mt-2">
            <CopyButton text={hash} />
          </div>
        </div>
      )}
    </div>
  );
}
