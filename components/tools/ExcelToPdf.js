"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";

async function getXLSX() {
  if (typeof window !== "undefined" && window.XLSX) {
    return window.XLSX;
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js";
    script.onload = () => resolve(window.XLSX);
    script.onerror = () => reject(new Error("Failed to load Excel parsing engine."));
    document.head.appendChild(script);
  });
}

export default function ExcelToPdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [tableHtml, setTableHtml] = useState("");

  const handleConvert = async () => {
    if (!files.length) {
      setError("Please upload an Excel (.xlsx, .xls, or .csv) file.");
      return;
    }
    setError("");
    setProcessing(true);
    setDone(false);

    try {
      const file = files[0];
      const XLSX = await getXLSX();
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const html = XLSX.utils.sheet_to_html(worksheet);
      setTableHtml(html);
      setDone(true);
    } catch (err) {
      setError("Failed to parse Excel spreadsheet: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handlePrintDownload = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Excel Spreadsheet Preview</title></head>
          <body style="font-family: sans-serif; padding: 20px;">
            ${tableHtml}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-5">
      <FileDropzone
        accept=".xlsx,.xls,.csv"
        maxSizeMB={50}
        files={files}
        onFilesChange={(newFiles) => {
          setFiles(newFiles);
          setDone(false);
          setTableHtml("");
        }}
        hint="Upload Excel spreadsheet (.xlsx, .xls, .csv)"
      />

      {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

      {/* Live In-Browser Spreadsheet Table Preview */}
      {tableHtml && (
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-[#223247]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>👁</span> Live Spreadsheet Table Preview (No Download Needed)
            </span>
            <button onClick={handlePrintDownload} className="ct-btn-secondary py-1 px-3 text-xs">
              🖨 Save / Download as PDF
            </button>
          </div>

          <div
            className="w-full max-h-[450px] overflow-auto rounded-2xl p-4 border-2 border-blue-200 dark:border-cyan-500/40 bg-white dark:bg-[#0c131d] shadow-inner text-slate-800 dark:text-slate-200 text-xs"
            dangerouslySetInnerHTML={{ __html: tableHtml }}
          />
        </div>
      )}

      {done ? (
        <button onClick={handlePrintDownload} className="ct-btn-primary w-full py-3 bg-emerald-600 hover:bg-emerald-700">
          ⬇ Download Converted Excel PDF Table
        </button>
      ) : (
        <button
          onClick={handleConvert}
          disabled={!files.length || processing}
          className="ct-btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? "Parsing Excel & Generating Live Preview…" : "Convert & Live Preview Excel Spreadsheet"}
        </button>
      )}
    </div>
  );
}
