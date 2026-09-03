"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function Sha512Hash() {
  const [input, setInput] = useState("");
  const [hash, setHash] = useState("");
  const [uppercase, setUppercase] = useState(false);

  const calculateHash = async (text) => {
    setInput(text);
    if (!text) {
      setHash("");
      return;
    }

    try {
      const msgUint8 = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest("SHA-512", msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setHash(uppercase ? hashHex.toUpperCase() : hashHex);
    } catch (e) {
      setHash("Error generating hash");
    }
  };

  const toggleUppercase = () => {
    setUppercase(!uppercase);
    if (hash) {
      setHash(!uppercase ? hash.toUpperCase() : hash.toLowerCase());
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">SHA-512 Hash Generator</h2>
        <p className="text-sm text-slate-500 mb-6">
          Compute cryptographic 512-bit SHA-512 hash values securely in your browser using the native Web Crypto API.
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">Input Text / String</label>
              <button
                onClick={() => calculateHash("The quick brown fox jumps over the lazy dog")}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Sample Text
              </button>
            </div>
            <textarea
              rows={5}
              value={input}
              onChange={(e) => calculateHash(e.target.value)}
              placeholder="Type or paste plain text here to generate SHA-512 hash instantly..."
              className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={toggleUppercase}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Uppercase Hash Output
            </label>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">
                SHA-512 Hash Result (128 hex characters)
              </label>
              {hash && <CopyButton text={hash} />}
            </div>
            <div className="p-3.5 bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm rounded-xl break-all min-h-[60px] flex items-center">
              {hash || <span className="text-slate-600">Output hash will appear here...</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
