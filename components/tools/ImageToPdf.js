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

export default function ImageToPdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const moveFile = (from, to) => {
    const arr = [...files];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    setFiles(arr);
  };

  const handleConvert = async () => {
    if (!files.length) {
      setError("Please upload at least one image.");
      return;
    }
    setError("");
    setProcessing(true);
    setDone(false);

    try {
      const pdfLib = await getPdfLib();
      const PDFDocument = pdfLib.PDFDocument;

      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        let image;
        if (file.type.includes("png")) {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          image = await pdfDoc.embedJpg(arrayBuffer);
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      downloadFile(blob, "images-converted.pdf");

      setDone(true);
    } catch (err) {
      setError("Failed to convert images to PDF: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      <FileDropzone
        accept=".jpg,.jpeg,.png,.webp"
        multiple
        maxSizeMB={50}
        files={files}
        onFilesChange={setFiles}
        hint="Upload JPG or PNG images to embed into PDF"
      />

      {files.length > 1 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 font-semibold uppercase">Reorder Image Pages</p>
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
            >
              <span className="font-bold text-slate-400 w-4 text-center">{i + 1}</span>
              <span className="text-slate-700 flex-1 truncate font-medium">{f.name}</span>
              <div className="flex gap-1">
                <button
                  disabled={i === 0}
                  onClick={() => moveFile(i, i - 1)}
                  className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  disabled={i === files.length - 1}
                  onClick={() => moveFile(i, i + 1)}
                  className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

      {done && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <span>✅</span>
          <span>Actual images embedded & PDF downloaded!</span>
        </div>
      )}

      <button
        onClick={handleConvert}
        disabled={!files.length || processing}
        className="ct-btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? "Embedding Images into PDF…" : `Convert ${files.length} Image${files.length > 1 ? "s" : ""} to PDF`}
      </button>
    </div>
  );
}
