"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function StringToBinary() {
  const [text, setText] = useState("");
  const [delimiter, setDelimiter] = useState("space");

  const toBinary = () => {
    if (!text) return "";
    const separator = delimiter === "space" ? " " : delimiter === "comma" ? "," : "";
    return text
      .split("")
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join(separator);
  };

  const binaryOutput = toBinary();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">String to Binary Converter</h2>
        <p className="text-sm text-slate-500 mb-6">
          Convert plain text into standard 8-bit binary representation in real time.
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">Input Plain Text</label>
              <button
                onClick={() => setText("Hello, FreeTooly!")}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Sample Text
              </button>
            </div>
            <textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to convert to binary..."
              className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600">Delimiter:</span>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none font-medium"
            >
              <option value="space">Space (01001000 01100101)</option>
              <option value="comma">Comma (01001000,01100101)</option>
              <option value="none">No Space (0100100001100101)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">Binary Output</label>
              {binaryOutput && <CopyButton text={binaryOutput} />}
            </div>
            <textarea
              readOnly
              rows={6}
              value={binaryOutput}
              placeholder="Binary output will appear here..."
              className="w-full p-3.5 text-sm bg-slate-900 text-emerald-400 font-mono rounded-xl border border-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
