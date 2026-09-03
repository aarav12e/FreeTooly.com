"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function BinaryToString() {
  const [binary, setBinary] = useState("");

  const toString = () => {
    if (!binary.trim()) return "";
    try {
      const cleanBin = binary.trim().replace(/[^01\s,]/g, "");
      const chunks = cleanBin.includes(" ")
        ? cleanBin.split(/\s+/)
        : cleanBin.includes(",")
        ? cleanBin.split(",")
        : cleanBin.match(/.{1,8}/g) || [];

      return chunks
        .map((bin) => String.fromCharCode(parseInt(bin, 2)))
        .join("");
    } catch (e) {
      return "Invalid binary input";
    }
  };

  const textOutput = toString();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Binary to String Converter</h2>
        <p className="text-sm text-slate-500 mb-6">
          Decode binary 0s and 1s back into readable plain text within seconds.
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">Input Binary</label>
              <button
                onClick={() => setBinary("01000110 01110010 01100101 01100101 01010100 01101111 01101111 01101100 01111001")}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Sample Binary
              </button>
            </div>
            <textarea
              rows={5}
              value={binary}
              onChange={(e) => setBinary(e.target.value)}
              placeholder="Paste binary sequence (e.g. 01001000 01101001)..."
              className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">Decoded Text</label>
              {textOutput && <CopyButton text={textOutput} />}
            </div>
            <textarea
              readOnly
              rows={5}
              value={textOutput}
              placeholder="Decoded plain text will appear here..."
              className="w-full p-3.5 text-sm bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
