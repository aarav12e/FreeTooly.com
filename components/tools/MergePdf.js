"use client";

import { useState, useEffect } from "react";
import FileDropzone from "@/components/FileDropzone";
import { downloadFile } from "@/lib/file-utils";

// Pure CDN loader to avoid webpack compile-time module resolution errors
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

export default function MergePdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [mergedBlob, setMergedBlob] = useState(null);

  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
    };
  }, [pdfPreviewUrl]);

  const moveFile = (from, to) => {
    const arr = [...files];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    setFiles(arr);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please upload at least 2 PDF files.");
      return;
    }
    setError("");
    setProcessing(true);
    setDone(false);

    try {
      const pdfLib = await getPdfLib();
      const PDFDocument = pdfLib.PDFDocument;

      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const previewUrl = URL.createObjectURL(blob);

      setMergedBlob(blob);
      setPdfPreviewUrl(previewUrl);
      setDone(true);
    } catch (err) {
      setError("Failed to merge PDF files: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (mergedBlob) {
      downloadFile(mergedBlob, "merged-document.pdf");
    }
  };

  return (
    <div className="space-y-5">
      <FileDropzone
        accept=".pdf"
        multiple
        maxSizeMB={100}
        files={files}
        onFilesChange={(newFiles) => {
          setFiles(newFiles);
          setDone(false);
          setPdfPreviewUrl(null);
        }}
        hint="Upload up to 20 PDF files to reorder, preview, and merge"
      />

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Reorder or Remove PDF Documents ({files.length}):</span>
            <span className="text-slate-400">Drag/reorder enabled</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {files.map((file, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between space-y-2 relative group shadow-2xs"
              >
                <div className="w-full aspect-[3/4] bg-white border border-slate-200 rounded-lg p-2 flex flex-col justify-between text-slate-400 shadow-2xs">
                  <div className="flex justify-between items-center text-[10px] font-bold text-red-600">
                    <span>PDF</span>
                    <span>#{i + 1}</span>
                  </div>
                  <div className="text-center font-bold text-xs text-slate-700 truncate px-1">
                    {file.name}
                  </div>
                  <div className="text-[9px] text-slate-400 text-center">
                    {(file.size / 1024).toFixed(0)} KB
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-200">
                  <div className="flex gap-1">
                    <button
                      disabled={i === 0}
                      onClick={() => moveFile(i, i - 1)}
                      className="px-2 py-0.5 bg-white border rounded text-xs font-bold hover:bg-slate-100 disabled:opacity-30"
                    >
                      ←
                    </button>
                    <button
                      disabled={i === files.length - 1}
                      onClick={() => moveFile(i, i + 1)}
                      className="px-2 py-0.5 bg-white border rounded text-xs font-bold hover:bg-slate-100 disabled:opacity-30"
                    >
                      →
                    </button>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    className="p-1 text-slate-400 hover:text-red-600 text-xs font-bold"
                    title="Remove file"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

      {pdfPreviewUrl && (
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>👁</span> Live PDF Document Preview (No Download Needed)
            </span>
            <button onClick={handleDownload} className="ct-btn-secondary py-1 px-3 text-xs">
              ⬇ Download PDF
            </button>
          </div>

          <div className="w-full h-[520px] rounded-2xl overflow-hidden border-2 border-blue-200 bg-slate-100 shadow-inner">
            <iframe
              src={pdfPreviewUrl}
              className="w-full h-full border-none"
              title="Merged PDF Live Preview"
            />
          </div>
        </div>
      )}

      {done ? (
        <button
          onClick={handleDownload}
          className="ct-btn-primary w-full py-3 bg-emerald-600 hover:bg-emerald-700"
        >
          ⬇ Download Merged PDF File
        </button>
      ) : (
        <button
          onClick={handleMerge}
          disabled={files.length < 2 || processing}
          className="ct-btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? "Merging & Generating Live Preview…" : `Merge & Preview ${files.length} PDF Files`}
        </button>
      )}
    </div>
  );
}
