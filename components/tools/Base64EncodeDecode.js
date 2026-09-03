"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

function encodeBase64(str) {
  if (!str) return "";
  try {
    const bytes = new TextEncoder().encode(str);
    const binString = Array.from(bytes, (b) => String.fromCodePoint(b)).join("");
    return btoa(binString);
  } catch {
    return btoa(unescape(encodeURIComponent(str)));
  }
}

function decodeBase64(str) {
  if (!str) return "";
  const cleanStr = str.trim();
  try {
    const binString = atob(cleanStr);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return decodeURIComponent(escape(atob(cleanStr)));
  }
}

export default function Base64EncodeDecode() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("encode"); // 'encode' | 'decode'

  function handleEncode() {
    if (!input.trim()) {
      setError("Please enter text to encode.");
      setOutput("");
      return;
    }
    try {
      const res = encodeBase64(input);
      setOutput(res);
      setError("");
    } catch {
      setError("Failed to encode input text.");
      setOutput("");
    }
  }

  function handleDecode() {
    if (!input.trim()) {
      setError("Please enter a valid Base64 string to decode.");
      setOutput("");
      return;
    }
    try {
      const res = decodeBase64(input);
      setOutput(res);
      setError("");
    } catch {
      setError("Invalid Base64 string format. Please check your input.");
      setOutput("");
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError("");
  }

  function handleSwap() {
    if (!output) return;
    setInput(output);
    setOutput("");
    setError("");
  }

  function handleModeChange(newMode) {
    setMode(newMode);
    setInput("");
    setOutput("");
    setError("");
  }

  return (
    <div className="space-y-4">
      {/* Mode Switcher & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`ct-cat-tab ${mode === "encode" ? "active" : ""}`}
            onClick={() => handleModeChange("encode")}
          >
             Encode Mode
          </button>
          <button
            type="button"
            className={`ct-cat-tab ${mode === "decode" ? "active" : ""}`}
            onClick={() => handleModeChange("decode")}
          >
             Decode Mode
          </button>
        </div>

        <div className="flex items-center gap-2">
          {output && (
            <button
              type="button"
              onClick={handleSwap}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors px-2 py-1"
            >
              🔄 Swap Result to Input
            </button>
          )}
          {input && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors px-2 py-1"
            >
              🗑️ Clear
            </button>
          )}
        </div>
      </div>

      {/* Textarea Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          {mode === "encode" ? "Plain Text Input" : "Base64 Encoded Input"}
        </label>
        <textarea
          className="tool-input"
          rows={5}
          placeholder={
            mode === "encode"
              ? "Enter plain text to encode into Base64 format..."
              : "Enter Base64 string to decode into plain text (e.g. SGVsbG8gV29ybGQ=)..."
          }
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {mode === "encode" ? (
          <button
            type="button"
            className="ct-btn-primary text-sm flex-1 sm:flex-initial"
            onClick={handleEncode}
          >
             Encode to Base64
          </button>
        ) : (
          <button
            type="button"
            className="ct-btn-primary text-sm flex-1 sm:flex-initial"
            onClick={handleDecode}
          >
             Decode Base64
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Output Result */}
      {output && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">
              {mode === "encode" ? "Base64 Output" : "Decoded Plain Text Result"}
            </label>
            <CopyButton text={output} />
          </div>
          <textarea className="tool-output" rows={5} readOnly value={output} />
        </div>
      )}
    </div>
  );
}
