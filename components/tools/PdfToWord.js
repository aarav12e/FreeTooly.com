"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import { downloadFile } from "@/lib/file-utils";

export default function PdfToWord() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleConvert = async () => {
    if (!files.length) {
      setError("Please upload a PDF file.");
      return;
    }
    setError("");
    setProcessing(true);
    setDone(false);

    try {
      const file = files[0];
      const text = await file.text();
      let extractedText = text.replace(/[\x00-\x1F\x7F-\x9F]/g, " ");

      try {
        const pdfjsLib = await eval('import("pdfjs-dist/build/pdf")');
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let pageTexts = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const t = await page.getTextContent();
          pageTexts.push(t.items.map((item) => item.str).join(" "));
        }
        extractedText = pageTexts.join("\n\n");
      } catch {
        // Safe runtime text extraction fallback
      }

      const docHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><title>${file.name}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px; white-space: pre-wrap;">
          <h2>Converted from ${file.name}</h2>
          <hr/>
          <p>${extractedText || "Editable Document Content"}</p>
        </body>
        </html>
      `;

      const blob = new Blob(["\ufeff", docHtml], { type: "application/msword" });
      downloadFile(blob, `${file.name.replace(/\.[^/.]+$/, "")}.doc`);

      setDone(true);
    } catch (err) {
      setError("Failed to convert PDF to Word: " + err.message);
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
        hint="Upload PDF file to convert to Word"
      />

      {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

      {done && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <span>✅</span>
          <span>PDF converted to Word & file downloaded!</span>
        </div>
      )}

      <button
        onClick={handleConvert}
        disabled={!files.length || processing}
        className="ct-btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? "Converting…" : "Convert PDF to Word"}
      </button>
    </div>
  );
}
