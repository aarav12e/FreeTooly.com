"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function format(minify = false) {
    try {
      const parsed = JSON.parse(input);
      setOutput(minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e) {
      setError("Invalid JSON: " + e.message);
      setOutput("");
    }
  }

  return (
    <div>
      <textarea
        className="tool-input"
        rows={8}
        placeholder='Paste raw JSON, e.g. {"name":"Aarav","age":21}'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex gap-2 mt-3">
        <button type="button" className="btn-primary text-sm" onClick={() => format(false)}>
          Beautify
        </button>
        <button type="button" className="btn-secondary text-sm" onClick={() => format(true)}>
          Minify
        </button>
      </div>
      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
      {output && (
        <div className="mt-4">
          <pre className="tool-output whitespace-pre-wrap overflow-auto max-h-96">{output}</pre>
          <div className="mt-2">
            <CopyButton text={output} />
          </div>
        </div>
      )}
    </div>
  );
}
