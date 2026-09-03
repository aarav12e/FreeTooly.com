"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function HexToString() {
  const [hex, setHex] = useState("");

  const decodeHex = () => {
    if (!hex.trim()) return "";
    try {
      const cleanHex = hex.trim().replace(/[^0-9a-fA-F]/g, "");
      let str = "";
      for (let i = 0; i < cleanHex.length; i += 2) {
        str += String.fromCharCode(parseInt(cleanHex.substr(i, 2), 16));
      }
      return str;
    } catch (e) {
      return "Invalid Hexadecimal input";
    }
  };

  const output = decodeHex();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Hex to String Converter</h2>
        <p className="text-sm text-slate-500 mb-6">
          Convert hexadecimal encoded characters back to readable ASCII or UTF-8 text.
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">Input Hex</label>
              <button
                onClick={() => setHex("46 72 65 65 54 6f 6f 6c 79")}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Sample Hex
              </button>
            </div>
            <textarea
              rows={5}
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              placeholder="Paste hex codes (e.g. 48 65 6c 6c 6f or 48656c6c6f)..."
              className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">Decoded Text</label>
              {output && <CopyButton text={output} />}
            </div>
            <textarea
              readOnly
              rows={5}
              value={output}
              placeholder="Decoded text will appear here..."
              className="w-full p-3.5 text-sm bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
