"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function Sha384Hash() {
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
      const hashBuffer = await crypto.subtle.digest("SHA-384", msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setHash(uppercase ? hashHex.toUpperCase() : hashHex);
    } catch (e) {
      setHash("Error generating hash");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">SHA-384 Hash Generator</h2>
        <p className="text-sm text-slate-500 mb-6">
          Generate secure 384-bit (96 hex character) SHA-384 cryptographic hashes directly in your browser.
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">Input Text</label>
              <button
                onClick={() => calculateHash("FreeTooly cryptographic tools")}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Sample Text
              </button>
            </div>
            <textarea
              rows={5}
              value={input}
              onChange={(e) => calculateHash(e.target.value)}
              placeholder="Enter text to hash..."
              className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">SHA-384 Result</label>
              {hash && <CopyButton text={hash} />}
            </div>
            <div className="p-3.5 bg-slate-900 text-cyan-400 font-mono text-xs sm:text-sm rounded-xl break-all min-h-[50px] flex items-center">
              {hash || <span className="text-slate-600">Output hash will appear here...</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
