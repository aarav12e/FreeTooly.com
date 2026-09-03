"use client";

import { useRef, useState, useCallback } from "react";

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function UploadIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mb-2">
      <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

export default function FileDropzone({
  accept,
  multiple = false,
  maxSizeMB = 50,
  onFilesChange,
  files = [],
  label,
  hint,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const maxBytes = maxSizeMB * 1024 * 1024;

  const validate = useCallback(
    (incoming) => {
      const acceptedExts = accept
        ? accept.split(",").map((a) => a.trim().toLowerCase())
        : null;

      const valid = [];
      const errors = [];

      for (const file of incoming) {
        if (file.size > maxBytes) {
          errors.push(`${file.name} exceeds ${maxSizeMB} MB limit.`);
          continue;
        }
        if (acceptedExts) {
          const ext = "." + file.name.split(".").pop().toLowerCase();
          if (!acceptedExts.includes(ext)) {
            errors.push(`${file.name} has an unsupported file extension.`);
            continue;
          }
        }
        valid.push(file);
      }

      if (errors.length) setError(errors.join(" "));
      else setError("");

      return valid;
    },
    [accept, maxBytes, maxSizeMB]
  );

  const addFiles = useCallback(
    (incoming) => {
      const valid = validate(incoming);
      if (!valid.length) return;
      if (multiple) {
        onFilesChange([...files, ...valid]);
      } else {
        onFilesChange([valid[0]]);
      }
    },
    [files, multiple, onFilesChange, validate]
  );

  const removeFile = (index) => {
    const next = files.filter((_, i) => i !== index);
    onFilesChange(next);
    setError("");
  };

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const onInputChange = (e) => {
    if (e.target.files?.length) addFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      {/* Upload Drop Zone Card */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragging ? "border-blue-600 bg-blue-50" : "border-slate-300 bg-white hover:bg-slate-50/80"
        }`}
        role="button"
        tabIndex={0}
        aria-label="Upload files"
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        <div className="flex flex-col items-center">
          <UploadIcon />
          <p className="font-bold text-sm text-slate-900 mb-1">
            {label || (dragging ? "Drop your file here" : "Click to upload or drag and drop")}
          </p>
          <p className="text-xs text-slate-500">
            {hint || `${accept ? accept.toUpperCase().split(",").join(", ") : "Any file"} • Max file size ${maxSizeMB} MB`}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onInputChange}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 text-xs shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileIcon />
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{file.name}</div>
                  <div className="text-[10px] text-slate-500">{formatBytes(file.size)}</div>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                aria-label="Remove file"
              >
                <XIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
