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

  function run(fn) {
    try {
      setOutput(fn(input));
      setError("");
    } catch (e) {
      setError("Could not convert this input.");
      setOutput("");
    }
  }

  return (
    <div>
      <textarea
        className="tool-input"
        rows={5}
        placeholder="Enter text, binary (space separated), or hex (space separated)..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex flex-wrap gap-2 mt-3">
        <button type="button" className="btn-primary text-sm" onClick={() => run(textToBinary)}>
          Text → Binary
        </button>
        <button type="button" className="btn-secondary text-sm" onClick={() => run(binaryToText)}>
          Binary → Text
        </button>
        <button type="button" className="btn-primary text-sm" onClick={() => run(textToHex)}>
          Text → Hex
        </button>
        <button type="button" className="btn-secondary text-sm" onClick={() => run(hexToText)}>
          Hex → Text
        </button>
      </div>
      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
      {output && (
        <div className="mt-4">
          <textarea className="tool-output" rows={5} readOnly value={output} />
          <div className="mt-2">
            <CopyButton text={output} />
          </div>
        </div>
      )}
    </div>
  );
}
