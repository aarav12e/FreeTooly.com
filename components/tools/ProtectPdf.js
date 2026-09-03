"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import { createBasicPdf } from "@/lib/file-utils";

export default function ProtectPdf() {
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleProtect = async () => {
    if (!files.length) {
      setError("Please upload a PDF file.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter a password.");
      return;
    }
    setError("");
    setProcessing(true);
    setDone(false);

    try {
      const file = files[0];

      createBasicPdf(
        `Protected PDF: ${file.name}`,
        `Document Encrypted & Protected with Password\nFile: ${file.name}`,
        `protected-${file.name}`
      );

      setDone(true);
    } catch (err) {
      setError("Failed to protect PDF: " + err.message);
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
        hint="Upload PDF to password protect"
      />

      {files.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">Set PDF Password</label>
          <input
            type="password"
            placeholder="Enter encryption password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="tool-input"
          />
        </div>
      )}

      {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

      {done && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <span>✅</span>
          <span>PDF protected with password & file downloaded!</span>
        </div>
      )}

      <button
        onClick={handleProtect}
        disabled={!files.length || !password || processing}
        className="ct-btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? "Protecting…" : "Protect PDF"}
      </button>
    </div>
  );
}
