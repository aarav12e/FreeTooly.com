"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";

async function getMammoth() {
  if (typeof window !== "undefined" && window.mammoth) {
    return window.mammoth;
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
    script.onload = () => resolve(window.mammoth);
    script.onerror = () => reject(new Error("Failed to load Word document processing engine."));
    document.head.appendChild(script);
  });
}

export default function WordToPdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [extractedHtml, setExtractedHtml] = useState("");

  const handleConvert = async () => {
    if (!files.length) {
      setError("Please upload a Word (.docx or .doc) document.");
      return;
    }
    setError("");
    setProcessing(true);
    setDone(false);

    try {
      const file = files[0];
      const mammoth = await getMammoth();
      const arrayBuffer = await file.arrayBuffer();

      const result = await mammoth.convertToHtml({ arrayBuffer });
      setExtractedHtml(result.value || `<p>Document: ${file.name}</p>`);
      setDone(true);
    } catch (err) {
      setError("Failed to convert Word to PDF: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handlePrintDownload = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Word Document Preview</title></head>
          <body style="font-family: sans-serif; padding: 30px;">
            ${extractedHtml}
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
        accept=".docx,.doc"
        maxSizeMB={50}
        files={files}
        onFilesChange={(newFiles) => {
          setFiles(newFiles);
          setDone(false);
          setExtractedHtml("");
        }}
        hint="Upload Word document (.docx, .doc)"
      />

      {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

      {/* Live In-Browser Formatted Document Preview */}
      {extractedHtml && (
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-[#223247]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>👁</span> Live Word Document Preview (No Download Needed)
            </span>
            <button onClick={handlePrintDownload} className="ct-btn-secondary py-1 px-3 text-xs">
              🖨 Save / Download as PDF
            </button>
          </div>

          <div
            className="w-full max-h-[450px] overflow-y-auto rounded-2xl p-6 border-2 border-blue-200 dark:border-cyan-500/40 bg-white dark:bg-[#0c131d] shadow-inner text-slate-800 dark:text-slate-200 text-sm leading-relaxed prose max-w-none"
            dangerouslySetInnerHTML={{ __html: extractedHtml }}
          />
        </div>
      )}

      {done ? (
        <button onClick={handlePrintDownload} className="ct-btn-primary w-full py-3 bg-emerald-600 hover:bg-emerald-700">
          ⬇ Download Converted PDF Document
        </button>
      ) : (
        <button
          onClick={handleConvert}
          disabled={!files.length || processing}
          className="ct-btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? "Extracting Word Content & Generating Live Preview…" : "Convert & Live Preview Word Document"}
        </button>
      )}
    </div>
  );
}
