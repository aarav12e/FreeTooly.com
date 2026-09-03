"use client";

import { useEffect, useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function Sha256Hash() {
  const [text, setText] = useState("");
  const [hash, setHash] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function computeHash() {
      if (!text) {
        setHash("");
        return;
      }
      const encoded = new TextEncoder().encode(text);
      const digest = await crypto.subtle.digest("SHA-256", encoded);
      const hex = Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      if (!cancelled) setHash(hex);
    }

    computeHash();
    return () => {
      cancelled = true;
    };
  }, [text]);

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
