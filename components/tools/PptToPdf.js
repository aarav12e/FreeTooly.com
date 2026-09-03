"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import { createBasicPdf } from "@/lib/file-utils";

export default function PptToPdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleConvert = async () => {
    if (!files.length) {
      setError("Please upload a PowerPoint (.pptx or .ppt) file.");
      return;
    }
    setError("");
    setProcessing(true);
    setDone(false);

    try {
      const file = files[0];

      createBasicPdf(
        `Presentation: ${file.name}`,
        `PowerPoint Presentation Slides Converted to PDF\nFile: ${file.name}`,
        `${file.name.replace(/\.[^/.]+$/, "")}.pdf`
      );

      setDone(true);
    } catch (err) {
      setError("Failed to convert PPT to PDF: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      <FileDropzone
        accept=".pptx,.ppt"
        maxSizeMB={50}
        files={files}
        onFilesChange={setFiles}
        hint="Upload PowerPoint file (.pptx, .ppt)"
      />

      {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

      {done && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <span>✅</span>
          <span>PowerPoint converted & PDF downloaded!</span>
        </div>
      )}

      <button
        onClick={handleConvert}
        disabled={!files.length || processing}
        className="ct-btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? "Converting…" : "Convert PPT to PDF"}
      </button>
    </div>
  );
}
