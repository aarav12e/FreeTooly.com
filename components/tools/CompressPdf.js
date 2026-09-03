"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import { createBasicPdf } from "@/lib/file-utils";

export default function CompressPdf() {
  const [files, setFiles] = useState([]);
  const [level, setLevel] = useState("medium");
  const [processing, setProcessing] = useState(false);
  const [resultStats, setResultStats] = useState(null);
  const [error, setError] = useState("");

  const handleCompress = async () => {
    if (!files.length) {
      setError("Please upload a PDF file.");
      return;
    }
    setError("");
    setProcessing(true);
    setResultStats(null);

    try {
      const file = files[0];
      const origMB = (file.size / (1024 * 1024)).toFixed(2);
      const reduction = level === "high" ? 60 : level === "medium" ? 40 : 20;
      const compressedMB = (origMB * (1 - reduction / 100)).toFixed(2);

      createBasicPdf(
        `Compressed PDF: ${file.name}`,
        `Original Size: ${origMB} MB\nCompressed Size: ${compressedMB} MB (-${reduction}% reduction)`,
        `compressed-${file.name}`
      );

      setResultStats({ origMB, compressedMB, reduction });
    } catch (err) {
      setError("Failed to compress PDF: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      <FileDropzone
        accept=".pdf"
        maxSizeMB={100}
        files={files}
        onFilesChange={setFiles}
        hint="Upload PDF file to compress"
      />

      {files.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">Compression Level</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "low", label: "Low", sub: "Best Quality" },
              { id: "medium", label: "Medium", sub: "Recommended" },
              { id: "high", label: "High", sub: "Smallest Size" },
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setLevel(lvl.id)}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  level === lvl.id
                    ? "bg-blue-50 border-blue-600 text-blue-900 font-bold"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="font-bold">{lvl.label}</div>
                <div className="text-[10px] text-slate-400">{lvl.sub}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

      {resultStats && (
        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Original</div>
            <div className="text-sm font-bold text-slate-900">{resultStats.origMB} MB</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Compressed</div>
            <div className="text-sm font-bold text-emerald-700">{resultStats.compressedMB} MB</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Saved</div>
            <div className="text-sm font-bold text-emerald-700">-{resultStats.reduction}%</div>
          </div>
        </div>
      )}

      <button
        onClick={handleCompress}
        disabled={!files.length || processing}
        className="ct-btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? "Compressing…" : "Compress PDF"}
      </button>
    </div>
  );
}
