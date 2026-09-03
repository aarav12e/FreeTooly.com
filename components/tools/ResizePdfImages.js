"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import { downloadFile } from "@/lib/file-utils";

async function getPdfLib() {
  if (typeof window !== "undefined" && window.PDFLib) {
    return window.PDFLib;
  }
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve(null);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js";
    script.onload = () => resolve(window.PDFLib);
    script.onerror = () => reject(new Error("Failed to load PDF processing engine."));
    document.head.appendChild(script);
  });
}

export default function ResizePdfImages() {
  const [files, setFiles] = useState([]);
  const [scale, setScale] = useState(75);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleResize = async () => {
    if (!files.length) {
      setError("Please upload a PDF file.");
      return;
    }
    setError("");
    setProcessing(true);
    setDone(false);

    try {
      const pdfLib = await getPdfLib();
      const PDFDocument = pdfLib.PDFDocument;

      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      const scaleFactor = scale / 100;
      const pages = pdfDoc.getPages();
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.setSize(width * scaleFactor, height * scaleFactor);
        page.scale(scaleFactor, scaleFactor);
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      downloadFile(blob, `scaled-${file.name}`);

      setDone(true);
    } catch (err) {
      setError("Failed to resize PDF: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      <FileDropzone
        accept=".pdf"
        maxSizeMB={50}
        files={files}
        onFilesChange={setFiles}
        hint="Upload PDF to scale pages and image dimensions"
      />

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-700">
            <span>Page & Image Scale Percentage</span>
            <span className="text-blue-600 font-bold">{scale}%</span>
          </div>
          <input
            type="range"
            min={25}
            max={100}
            step={5}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>
      )}

      {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

      {done && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <span>✅</span>
          <span>PDF page dimensions scaled & file downloaded!</span>
        </div>
      )}

      <button
        onClick={handleResize}
        disabled={!files.length || processing}
        className="ct-btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? "Scaling PDF Pages…" : `Resize PDF (${scale}%)`}
      </button>
    </div>
  );
}
