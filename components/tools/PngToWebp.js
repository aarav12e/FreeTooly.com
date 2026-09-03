"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { showToast } from "@/components/ToasterProvider";

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function PngToWebp() {
  const [files, setFiles] = useState([]);
  const [quality, setQuality] = useState(85);
  const [resizeMode, setResizeMode] = useState("original"); // "original", "75", "50", "custom", "max1920", "max1280", "max800"
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [bgMode, setBgMode] = useState("transparent"); // "transparent", "white", "black"
  const [customBgColor, setCustomBgColor] = useState("#ffffff");

  const [convertedList, setConvertedList] = useState([]);
  const [converting, setConverting] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

  const fileInputRef = useRef(null);

  // Process and convert image file to WebP
  const processImage = useCallback(
    (fileItem, targetQuality, targetResizeMode, targetWidth, targetHeight, targetBg, targetBgColor) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const originalWidth = img.naturalWidth || img.width;
            const originalHeight = img.naturalHeight || img.height;

            let outWidth = originalWidth;
            let outHeight = originalHeight;

            if (targetResizeMode === "75") {
              outWidth = Math.round(originalWidth * 0.75);
              outHeight = Math.round(originalHeight * 0.75);
            } else if (targetResizeMode === "50") {
              outWidth = Math.round(originalWidth * 0.5);
              outHeight = Math.round(originalHeight * 0.5);
            } else if (targetResizeMode === "max1920" && originalWidth > 1920) {
              outWidth = 1920;
              outHeight = Math.round((originalHeight * 1920) / originalWidth);
            } else if (targetResizeMode === "max1280" && originalWidth > 1280) {
              outWidth = 1280;
              outHeight = Math.round((originalHeight * 1280) / originalWidth);
            } else if (targetResizeMode === "max800" && originalWidth > 800) {
              outWidth = 800;
              outHeight = Math.round((originalHeight * 800) / originalWidth);
            } else if (targetResizeMode === "custom") {
              const parsedW = parseInt(targetWidth, 10);
              const parsedH = parseInt(targetHeight, 10);
              if (parsedW && parsedH) {
                outWidth = parsedW;
                outHeight = parsedH;
              } else if (parsedW) {
                outWidth = parsedW;
                outHeight = Math.round((originalHeight * parsedW) / originalWidth);
              } else if (parsedH) {
                outHeight = parsedH;
                outWidth = Math.round((originalWidth * parsedH) / originalHeight);
              }
            }

            outWidth = Math.max(1, outWidth);
            outHeight = Math.max(1, outHeight);

            const canvas = document.createElement("canvas");
            canvas.width = outWidth;
            canvas.height = outHeight;
            const ctx = canvas.getContext("2d");

            // Fill background if not transparent
            if (targetBg === "white") {
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, outWidth, outHeight);
            } else if (targetBg === "black") {
              ctx.fillStyle = "#000000";
              ctx.fillRect(0, 0, outWidth, outHeight);
            } else if (targetBg === "custom") {
              ctx.fillStyle = targetBgColor;
              ctx.fillRect(0, 0, outWidth, outHeight);
            }

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, outWidth, outHeight);

            const qualityVal = targetQuality / 100;
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  resolve(null);
                  return;
                }
                const originalName = fileItem.file.name;
                const baseName = originalName.substring(0, originalName.lastIndexOf(".")) || originalName;
                const outputName = `${baseName}.webp`;
                const outputUrl = URL.createObjectURL(blob);

                resolve({
                  id: fileItem.id,
                  file: fileItem.file,
                  originalName,
                  outputName,
                  originalSize: fileItem.file.size,
                  outputSize: blob.size,
                  originalDimensions: `${originalWidth}×${originalHeight}`,
                  outputDimensions: `${outWidth}×${outHeight}`,
                  originalUrl: e.target.result,
                  outputUrl,
                  outputBlob: blob,
                });
              },
              "image/webp",
              qualityVal
            );
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(fileItem.file);
      });
    },
    []
  );

  // Re-run conversions whenever files or settings change
  const runBatchConvert = useCallback(async () => {
    if (files.length === 0) {
      setConvertedList([]);
      return;
    }
    setConverting(true);
    const results = [];
    for (const f of files) {
      const res = await processImage(
        f,
        quality,
        resizeMode,
        customWidth,
        customHeight,
        bgMode,
        customBgColor
      );
      if (res) results.push(res);
    }
    setConvertedList(results);
    setConverting(false);
  }, [files, quality, resizeMode, customWidth, customHeight, bgMode, customBgColor, processImage]);

  useEffect(() => {
    runBatchConvert();
  }, [runBatchConvert]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer?.files || []);
    addIncomingFiles(droppedFiles);
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target?.files || []);
    addIncomingFiles(selectedFiles);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addIncomingFiles = (incoming) => {
    const validImages = incoming.filter((f) => {
      const isImg = f.type.startsWith("image/");
      const ext = f.name.toLowerCase();
      const hasImgExt = ext.endsWith(".png") || ext.endsWith(".jpg") || ext.endsWith(".jpeg") ||
        ext.endsWith(".webp") || ext.endsWith(".gif") || ext.endsWith(".bmp") || ext.endsWith(".heic") || ext.endsWith(".svg");
      return isImg || hasImgExt;
    });

    if (validImages.length === 0) {
      showToast("Please upload supported image files (PNG, JPG, GIF, WebP, HEIC).", { icon: "⚠️" });
      return;
    }

    const newItems = validImages.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
    }));

    setFiles((prev) => [...prev, ...newItems]);
    showToast(`Added ${validImages.length} image${validImages.length > 1 ? "s" : ""}`, { icon: "🖼️" });
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
    setConvertedList((prev) => prev.filter((item) => item.id !== id));
    if (previewItem?.id === id) setPreviewItem(null);
  };

  const clearAll = () => {
    setFiles([]);
    setConvertedList([]);
    setPreviewItem(null);
  };

  const downloadFile = (item) => {
    const a = document.createElement("a");
    a.href = item.outputUrl;
    a.download = item.outputName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Downloaded ${item.outputName}`, { icon: "📥" });
  };

  const downloadAll = () => {
    if (convertedList.length === 0) return;
    convertedList.forEach((item, index) => {
      setTimeout(() => {
        downloadFile(item);
      }, index * 250);
    });
    showToast(`Downloading all ${convertedList.length} WebP images...`, { icon: "📥" });
  };

  // Calculations for summary stats
  const totalOriginalSize = convertedList.reduce((acc, cur) => acc + cur.originalSize, 0);
  const totalOutputSize = convertedList.reduce((acc, cur) => acc + cur.outputSize, 0);
  const totalSavings = totalOriginalSize > 0 ? Math.round(((totalOriginalSize - totalOutputSize) / totalOriginalSize) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Top Banner / Value Proposition */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-teal-50/80 dark:from-[#111e30] dark:via-[#132338] dark:to-[#0f242e] border border-blue-200/80 dark:border-cyan-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
            W
          </div>
          <div>
            <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
              Fast & Lossless In-Browser PNG to WebP Converter
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Supports PNG, JPG, GIF, WebP, SVG and HEIC with full resolution & compression control.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
            <span>🔒</span> 100% Private (No Uploads)
          </span>
        </div>
      </div>

      {/* Drag & Drop Upload Workplace */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
        className="group relative border-2 border-dashed border-slate-300 dark:border-[#22354c] hover:border-blue-500 dark:hover:border-cyan-400 rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer bg-white/50 dark:bg-[#111a26]/50 hover:bg-blue-50/30 dark:hover:bg-cyan-950/20"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          multiple
          accept="image/*,.heic,.heif,.webp,.svg,.png,.jpg,.jpeg"
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-cyan-500/15 text-blue-600 dark:text-cyan-400 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
            🖼️
          </div>
          <div>
            <h4 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
              Drop your images here, or <span className="text-blue-600 dark:text-cyan-400 underline">browse files</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Supports PNG, JPG, GIF, WebP, SVG, BMP, HEIC. Upload multiple images at once.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 pt-1 text-[11px] font-semibold text-slate-400">
            <span>⚡ Instant client-side conversion</span>
            <span>•</span>
            <span>No file size limits</span>
          </div>
        </div>
      </div>

      {/* Conversion Options Panel */}
      {files.length > 0 && (
        <div className="bg-slate-50 dark:bg-[#0f1723] border border-slate-200 dark:border-[#1e2f44] rounded-3xl p-5 sm:p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1e2f44] pb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚙️</span>
              <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                WebP Optimization & Resolution Settings
              </h4>
            </div>
            <button
              onClick={clearAll}
              className="text-xs font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
            >
              Clear All Images
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Quality & Compression Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>WebP Quality / Compression:</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-300 font-mono">
                  {quality}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-[#1a293b] rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-cyan-400"
              />
              {/* Presets */}
              <div className="flex items-center gap-1.5 pt-1">
                {[
                  { label: "Compact 60%", val: 60 },
                  { label: "Optimal 85%", val: 85 },
                  { label: "Maximum 95%", val: 95 },
                  { label: "100%", val: 100 },
                ].map((p) => (
                  <button
                    key={p.val}
                    onClick={() => setQuality(p.val)}
                    className={`flex-1 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                      quality === p.val
                        ? "bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 border-transparent shadow-xs"
                        : "bg-white dark:bg-[#162232] border-slate-200 dark:border-[#223348] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1b2b3f]"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Image Resolution & Resizing */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Image Resolution Scale:</span>
              </div>
              <select
                value={resizeMode}
                onChange={(e) => setResizeMode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#162232] border border-slate-200 dark:border-[#223348] text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-blue-500 dark:focus:border-cyan-400"
              >
                <option value="original">Original Dimensions (100%)</option>
                <option value="75">Scale down to 75%</option>
                <option value="50">Scale down to 50% (Half Size)</option>
                <option value="max1920">Max Width 1920px (Full HD)</option>
                <option value="max1280">Max Width 1280px (HD)</option>
                <option value="max800">Max Width 800px (Web Content)</option>
                <option value="custom">Custom Dimensions (W × H)</option>
              </select>

              {resizeMode === "custom" && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Width (px)"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#162232] border border-slate-200 dark:border-[#223348] text-xs text-slate-800 dark:text-white outline-none"
                    />
                  </div>
                  <span className="text-slate-400 text-xs">×</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Height (px)"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#162232] border border-slate-200 dark:border-[#223348] text-xs text-slate-800 dark:text-white outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 3. Transparency & Background Color */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Transparency & Background:</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "transparent", label: "Transparent" },
                  { id: "white", label: "White Fill" },
                  { id: "black", label: "Black Fill" },
                ].map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setBgMode(bg.id)}
                    className={`py-2 text-[11px] font-semibold rounded-xl border transition-all ${
                      bgMode === bg.id
                        ? "bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 border-transparent shadow-xs"
                        : "bg-white dark:bg-[#162232] border-slate-200 dark:border-[#223348] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1b2b3f]"
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                WebP supports transparent alpha channels natively.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats Header when items are converted */}
      {convertedList.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#131d2b] border border-slate-200 dark:border-[#223247] shadow-sm">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Total Files:</span>{" "}
              <span className="font-bold text-slate-900 dark:text-white">{convertedList.length}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Original Size:</span>{" "}
              <span className="font-bold text-slate-700 dark:text-slate-300">{formatBytes(totalOriginalSize)}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">WebP Size:</span>{" "}
              <span className="font-bold text-blue-600 dark:text-cyan-400">{formatBytes(totalOutputSize)}</span>
            </div>
            {totalSavings > 0 && (
              <div className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs">
                ⬇ {totalSavings}% Smaller
              </div>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={downloadAll}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>📥 Download All WebP ({convertedList.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Converted Files Grid / List */}
      {convertedList.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-heading font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
            Converted WebP Files ({convertedList.length})
          </h4>

          <div className="space-y-3">
            {convertedList.map((item) => {
              const savings =
                item.originalSize > 0
                  ? Math.round(((item.originalSize - item.outputSize) / item.originalSize) * 100)
                  : 0;

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#131d2b] border border-slate-200 dark:border-[#223247] hover:border-blue-400 dark:hover:border-cyan-500/40 transition-all shadow-xs"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Thumbnail */}
                    <div
                      onClick={() => setPreviewItem(item)}
                      className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-[#0c131d] border border-slate-200 dark:border-[#223348] overflow-hidden flex-shrink-0 flex items-center justify-center cursor-pointer relative group"
                      title="Click to view large preview"
                    >
                      <img
                        src={item.outputUrl}
                        alt={item.outputName}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                        🔍
                      </div>
                    </div>

                    {/* Metadata Details */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                          {item.outputName}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-blue-100 dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-300">
                          WEBP
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>
                          {item.originalDimensions} →{" "}
                          <strong className="text-slate-800 dark:text-slate-200">{item.outputDimensions}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          {formatBytes(item.originalSize)} →{" "}
                          <strong className="text-blue-600 dark:text-cyan-400">{formatBytes(item.outputSize)}</strong>
                        </span>
                        {savings > 0 ? (
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            (-{savings}%)
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#223348] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#182637] transition-all cursor-pointer"
                    >
                      Compare Preview
                    </button>
                    <button
                      onClick={() => downloadFile(item)}
                      className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Download WebP</span>
                      <span>↓</span>
                    </button>
                    <button
                      onClick={() => removeFile(item.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Screen / Modal Before & After Comparison */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="bg-white dark:bg-[#121c29] border border-slate-200 dark:border-[#223248] rounded-3xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1e2f44] pb-3">
              <div>
                <h4 className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
                  Before vs After Comparison: {previewItem.originalName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Compare original image vs converted WebP output.
                </p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1a2738] text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold hover:bg-slate-200 dark:hover:bg-[#25374e] transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span>Original Image:</span>
                  <span>{formatBytes(previewItem.originalSize)} ({previewItem.originalDimensions})</span>
                </div>
                <div className="h-64 rounded-2xl bg-slate-100 dark:bg-[#0c131d] border border-slate-200 dark:border-[#1e2e41] p-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={previewItem.originalUrl}
                    alt="Original"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>

              {/* Converted WebP */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-blue-600 dark:text-cyan-400">
                  <span>Converted WebP ({quality}% Quality):</span>
                  <span>{formatBytes(previewItem.outputSize)} ({previewItem.outputDimensions})</span>
                </div>
                <div className="h-64 rounded-2xl bg-slate-100 dark:bg-[#0c131d] border border-blue-300 dark:border-cyan-500/30 p-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={previewItem.outputUrl}
                    alt="Converted WebP"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1e2f44]">
              <span className="text-xs text-slate-500">
                Resolution: {previewItem.outputDimensions} • Size: {formatBytes(previewItem.outputSize)}
              </span>
              <button
                onClick={() => downloadFile(previewItem)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Download This WebP ↓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
