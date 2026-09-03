"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import { downloadFile } from "@/lib/file-utils";

export default function MergeWord() {
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

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please upload at least 2 Word documents.");
      return;
    }
    setError("");
    setProcessing(true);
    setDone(false);

    try {
      let combinedParts = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const text = await file.text();
        combinedParts.push(`<h3>Document ${i + 1}: ${file.name}</h3><p>${text.replace(/<[^>]+>/g, " ")}</p><hr/>`);
      }

      const docHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><title>Merged Word Document</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          ${combinedParts.join("\n")}
        </body>
        </html>
      `;

      const blob = new Blob(["\ufeff", docHtml], { type: "application/msword" });
      downloadFile(blob, "merged-document.doc");

      setDone(true);
    } catch (err) {
      setError("Failed to merge Word files: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      <FileDropzone
        accept=".docx,.doc"
        multiple
        maxSizeMB={50}
        files={files}
        onFilesChange={setFiles}
        hint="Upload 2 or more Word documents (.docx, .doc)"
      />

      {files.length > 1 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 font-semibold uppercase">Reorder Word Documents</p>
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
          <span>Word documents merged & single file downloaded!</span>
        </div>
      )}

      <button
        onClick={handleMerge}
        disabled={files.length < 2 || processing}
        className="ct-btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? "Merging…" : `Merge ${files.length} Word Files`}
      </button>
    </div>
  );
}
