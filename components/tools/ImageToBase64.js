"use client";

import { useState, useRef, useCallback } from "react";
import CopyButton from "@/components/CopyButton";
import { downloadFile } from "@/lib/file-utils";

const ACCEPTED_TYPES = [
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "image/svg+xml", "image/bmp", "image/ico", "image/tiff",
  "image/avif", "image/x-icon",
];

const FORMAT_OPTIONS = [
  { id: "base64",      label: "Pure Base64",      desc: "Raw base64 string only" },
  { id: "data-uri",    label: "Data URI",          desc: "data:image/png;base64,…" },
  { id: "css-bg",      label: "CSS Background",    desc: "background-image: url(…)" },
  { id: "html-img",    label: "HTML <img> Tag",    desc: '<img src="data:…" />' },
  { id: "markdown",    label: "Markdown Image",    desc: "![image](data:…)" },
];

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function buildOutput(base64, mimeType, fileName, format) {
  const dataUri = `data:${mimeType};base64,${base64}`;
  switch (format) {
    case "base64":    return base64;
    case "data-uri":  return dataUri;
    case "css-bg":    return `background-image: url("${dataUri}");`;
    case "html-img":  return `<img src="${dataUri}" alt="${fileName}" />`;
    case "markdown":  return `![${fileName}](${dataUri})`;
    default:          return dataUri;
  }
}

export default function ImageToBase64() {
  const [image, setImage] = useState(null); // { name, size, type, base64, dataUri, previewUrl, width, height }
  const [format, setFormat] = useState("data-uri");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastNotice, setToastNotice] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(""), 3000);
  };

  const processFile = useCallback((file) => {
    if (!file) return;

    // Validate type
    if (!ACCEPTED_TYPES.includes(file.type) && !file.type.startsWith("image/")) {
      setError(`Unsupported file type: ${file.type || "unknown"}. Please upload an image file.`);
      return;
    }

    // 20 MB limit
    if (file.size > 20 * 1024 * 1024) {
      setError("File too large. Maximum supported size is 20 MB.");
      return;
    }

    setError("");
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e.target.result;
      // dataUri = data:image/png;base64,XXXX...
      const base64 = dataUri.split(",")[1] || "";
      const previewUrl = dataUri;

      // Get dimensions via Image element
      const img = new Image();
      img.onload = () => {
        setImage({
          name: file.name,
          size: file.size,
          type: file.type || "image/png",
          base64,
          dataUri,
          previewUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        setIsProcessing(false);
      };
      img.onerror = () => {
        setImage({
          name: file.name,
          size: file.size,
          type: file.type || "image/png",
          base64,
          dataUri,
          previewUrl,
          width: null,
          height: null,
        });
        setIsProcessing(false);
      };
      img.src = previewUrl;
    };
    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  }, []);

  // Drag & Drop handlers
  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = ""; // reset so same file can be re-selected
  };

  // Paste from clipboard
  const onPaste = useCallback(async () => {
    try {
      if (!navigator.clipboard?.read) {
        setError("Clipboard API not supported in this browser.");
        return;
      }
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((t) => t.startsWith("image/"));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], `clipboard-image.${imageType.split("/")[1]}`, { type: imageType });
          processFile(file);
          return;
        }
      }
      setError("No image found in clipboard. Copy an image first then try again.");
    } catch {
      setError("Could not read clipboard. Make sure you've copied an image.");
    }
  }, [processFile]);

  const outputText = image
    ? buildOutput(image.base64, image.type, image.name, format)
    : "";

  const base64SizeBytes = image ? Math.ceil((image.base64.length * 3) / 4) : 0;
  const sizeIncrease = image
    ? Math.round(((base64SizeBytes - image.size) / image.size) * 100)
    : 0;

  const handleDownloadTxt = () => {
    if (!outputText) return;
    downloadFile(outputText, `${image.name}-base64.txt`, "text/plain");
    showToast("✓ Downloaded .txt file");
  };

  const handleClear = () => {
    setImage(null);
    setError("");
    setToastNotice("");
  };

  return (
    <div className="space-y-5">

      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #0f0a1e 0%, #1a0f2e 60%, #0d1a2e 100%)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-xl flex-shrink-0">
            🖼️
          </div>
          <div>
            <div className="font-extrabold text-white text-sm tracking-wide">Image to Base64 Converter</div>
            <div className="text-[11px] text-violet-300/70 font-medium mt-0.5">
              JPG · PNG · SVG · GIF · WebP · BMP · ICO · AVIF — 100% client-side
            </div>
          </div>
        </div>
        {image && (
          <div className="flex items-center gap-4 flex-wrap">
            {[
              { label: "Original",   value: formatBytes(image.size),      color: "text-sky-300" },
              { label: "Base64 Size",value: formatBytes(base64SizeBytes), color: "text-violet-300" },
              { label: "Increase",   value: `+${sizeIncrease}%`,          color: "text-amber-300" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className={`font-extrabold text-base leading-none ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-white/40 font-medium mt-0.5 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        )}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-violet-500/10 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ─── Left: Upload + Preview (5 cols) ──────────────────────────── */}
        <div className="lg:col-span-5 space-y-4">

          {/* Drop Zone */}
          <div
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`relative rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 min-h-[220px] cursor-pointer transition-all select-none ${
              isDragging
                ? "border-violet-500 bg-violet-500/10 dark:bg-violet-500/10"
                : "border-slate-300 dark:border-[#2a3c53] bg-slate-50 dark:bg-[#111a27] hover:border-violet-400 hover:bg-violet-50/50 dark:hover:bg-violet-950/20"
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Processing image…</div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700/30 flex items-center justify-center text-3xl">
                  🖼️
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm text-slate-700 dark:text-slate-200">Drop image here</div>
                  <div className="text-xs text-slate-400 mt-0.5">or click to browse files</div>
                </div>
                <div className="flex flex-wrap justify-center gap-1 mt-1 max-w-xs">
                  {["JPG", "PNG", "SVG", "GIF", "WebP", "BMP", "ICO", "AVIF"].map((ext) => (
                    <span key={ext} className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-[#182333] text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      {ext}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Max file size: 20 MB</div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </div>

          {/* Paste from Clipboard Button */}
          <button
            onClick={onPaste}
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-[#2a3c53] bg-white dark:bg-[#131d2b] text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-violet-400 dark:hover:border-violet-500 hover:text-violet-600 dark:hover:text-violet-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1"/>
            </svg>
            Paste Image from Clipboard (Ctrl+V equivalent)
          </button>

          {/* Error Notice */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-xl text-xs font-semibold text-red-700 dark:text-red-400 flex items-start gap-2">
              <span className="flex-shrink-0 mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Image Preview Card */}
          {image && (
            <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] shadow-sm overflow-hidden">
              {/* Preview */}
              <div
                className="flex items-center justify-center min-h-[180px] p-4"
                style={{ background: "repeating-conic-gradient(#e2e8f0 0% 25%, #ffffff 0% 50%) 0 0 / 16px 16px" }}
              >
                <img
                  src={image.previewUrl}
                  alt={image.name}
                  className="max-w-full max-h-[240px] object-contain rounded-lg shadow-md"
                />
              </div>

              {/* File Metadata */}
              <div className="border-t border-slate-100 dark:border-[#1a2740] p-3 grid grid-cols-2 gap-2 text-[11px]">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">File name</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px]" title={image.name}>{image.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{image.type}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Size</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{formatBytes(image.size)}</span>
                  </div>
                  {image.width && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Dimensions</span>
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{image.width} × {image.height}px</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Clear Button */}
              <div className="border-t border-slate-100 dark:border-[#1a2740] px-3 py-2 flex justify-end">
                <button
                  onClick={handleClear}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-700 cursor-pointer transition-colors"
                >
                  ✕ Remove image
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Right: Output Panel (7 cols) ─────────────────────────────── */}
        <div className="lg:col-span-7 space-y-4">

          {/* Format Selector */}
          <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm space-y-3">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Output Format
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FORMAT_OPTIONS.map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setFormat(fmt.id)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    format === fmt.id
                      ? "bg-violet-600 border-violet-600 text-white shadow-sm"
                      : "bg-slate-50 dark:bg-[#182333] border-slate-200 dark:border-[#2a3c53] text-slate-700 dark:text-slate-300 hover:border-violet-400 dark:hover:border-violet-600"
                  }`}
                >
                  <div className="font-bold text-xs">{fmt.label}</div>
                  <div className={`text-[10px] font-mono mt-0.5 ${format === fmt.id ? "text-violet-100" : "text-slate-400"}`}>
                    {fmt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Base64 Output Box */}
          <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-[#1a2740] bg-slate-50 dark:bg-[#111a27]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Generated Output
                </span>
                {image && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    ● Ready
                  </span>
                )}
              </div>
              {image && (
                <span className="text-[10px] font-mono text-slate-400">
                  {outputText.length.toLocaleString()} chars
                </span>
              )}
            </div>

            {image ? (
              <textarea
                readOnly
                value={outputText}
                rows={12}
                className="w-full p-4 font-mono text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 bg-white dark:bg-[#0d1625] resize-none outline-none"
                onClick={(e) => e.target.select()}
              />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[240px] text-slate-300 dark:text-slate-600">
                <span className="text-5xl mb-3">📋</span>
                <div className="text-sm font-semibold">Output will appear here</div>
                <div className="text-xs mt-1">Upload an image to get started</div>
              </div>
            )}

            {image && (
              <div className="border-t border-slate-100 dark:border-[#1a2740] px-4 py-3 flex flex-wrap gap-2 bg-slate-50/50 dark:bg-[#111a27]/50">
                <CopyButton text={outputText} label="Copy Output" />
                <button
                  onClick={handleDownloadTxt}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download .txt
                </button>
                <button
                  onClick={() => {
                    const html = `<!DOCTYPE html>\n<html>\n<head><meta charset="UTF-8"><title>${image.name} — Base64</title></head>\n<body style="font-family:monospace;padding:24px;background:#0d1117;color:#c9d1d9;">\n<h2 style="color:#58a6ff;margin:0 0 16px">Base64 Output: ${image.name}</h2>\n<pre style="white-space:pre-wrap;word-break:break-all;font-size:12px;">${outputText}</pre>\n</body>\n</html>`;
                    downloadFile(html, `${image.name}-base64.html`, "text/html");
                    showToast("✓ Downloaded .html file");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-[#1f2f44] hover:bg-slate-900 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Download .html
                </button>
              </div>
            )}
          </div>

          {/* Toast */}
          {toastNotice && (
            <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              {toastNotice}
            </div>
          )}

          {/* Live Data URI Preview (only for data-uri and html-img formats) */}
          {image && (format === "data-uri" || format === "html-img" || format === "css-bg") && (
            <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm space-y-3">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                ✅ Live Verification Preview
              </div>
              <div
                className="rounded-xl border border-slate-100 dark:border-[#1a2740] flex items-center justify-center min-h-[120px]"
                style={
                  format === "css-bg"
                    ? { backgroundImage: `url("${image.dataUri}")`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }
                    : {}
                }
              >
                {format !== "css-bg" && (
                  <img
                    src={image.dataUri}
                    alt={image.name}
                    className="max-w-full max-h-[160px] object-contain rounded-lg"
                  />
                )}
                {format === "css-bg" && (
                  <div className="w-full min-h-[120px]" />
                )}
              </div>
              <div className="text-[10px] text-slate-400 text-center">
                ✓ Image renders correctly from the Base64 Data URI
              </div>
            </div>
          )}

          {/* Usage Guide */}
          <div className="bg-slate-50 dark:bg-[#111a27] rounded-xl border border-slate-200 dark:border-[#223247] p-4 space-y-2">
            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">💡 Usage Guide</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <div>→ <strong className="text-slate-600 dark:text-slate-300">Data URI</strong> — embed in HTML, CSS, JS</div>
              <div>→ <strong className="text-slate-600 dark:text-slate-300">CSS Background</strong> — paste in stylesheet</div>
              <div>→ <strong className="text-slate-600 dark:text-slate-300">HTML &lt;img&gt;</strong> — self-contained img tag</div>
              <div>→ <strong className="text-slate-600 dark:text-slate-300">Pure Base64</strong> — for API payloads & JSON</div>
              <div>→ <strong className="text-slate-600 dark:text-slate-300">Markdown</strong> — embed in GitHub README</div>
              <div>→ Works entirely offline — no upload to server</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
