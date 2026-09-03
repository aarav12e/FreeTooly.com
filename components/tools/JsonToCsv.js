"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function JsonToCsv() {
  const [jsonText, setJsonText] = useState("");
  const [csvText, setCsvText] = useState("");
  const [error, setError] = useState("");

  const convertJsonToCsv = () => {
    setError("");
    if (!jsonText.trim()) {
      setCsvText("");
      return;
    }

    try {
      let parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        if (typeof parsed === "object" && parsed !== null) {
          parsed = [parsed];
        } else {
          setError("JSON must be an array of objects or a single object.");
          return;
        }
      }

      if (parsed.length === 0) {
        setCsvText("");
        return;
      }

      // Collect all keys
      const headers = Array.from(
        new Set(parsed.flatMap((item) => (typeof item === "object" && item !== null ? Object.keys(item) : [])))
      );

      const rows = parsed.map((item) =>
        headers
          .map((header) => {
            const val = item[header];
            if (val === undefined || val === null) return '""';
            const str = typeof val === "object" ? JSON.stringify(val) : String(val);
            return `"${str.replace(/"/g, '""')}"`;
          })
          .join(",")
      );

      const result = [headers.map((h) => `"${h}"`).join(","), ...rows].join("\n");
      setCsvText(result);
    } catch (e) {
      setError(`Invalid JSON: ${e.message}`);
    }
  };

  const handleDownload = () => {
    if (!csvText) return;
    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "converted_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadSample = () => {
    const sample = JSON.stringify(
      [
        { id: 1, name: "Alice Smith", role: "Developer", country: "USA" },
        { id: 2, name: "Bob Johnson", role: "Designer", country: "Canada" },
        { id: 3, name: "Charlie Lee", role: "Manager", country: "UK" }
      ],
      null,
      2
    );
    setJsonText(sample);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">JSON to CSV Converter</h2>
        <p className="text-sm text-slate-500 mb-6">
          Convert JSON array objects to formatted CSV spreadsheet data instantly in your browser.
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">Input JSON Data</label>
              <button onClick={loadSample} className="text-xs text-blue-600 hover:underline font-medium">
                Load Sample JSON
              </button>
            </div>
            <textarea
              rows={6}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder="Paste JSON array or object here..."
              className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={convertJsonToCsv}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              Convert to CSV →
            </button>
            {csvText && (
              <button
                onClick={handleDownload}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                📥 Download .CSV File
              </button>
            )}
          </div>

          {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">{error}</div>}

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">CSV Output</label>
              {csvText && <CopyButton text={csvText} />}
            </div>
            <textarea
              readOnly
              rows={6}
              value={csvText}
              placeholder="CSV output will appear here..."
              className="w-full p-3.5 text-sm bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
