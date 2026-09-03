"use client";

import { useState, useRef, useEffect } from "react";
import FileDropzone from "@/components/FileDropzone";
import { downloadFile } from "@/lib/file-utils";

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export default function MuteVideo() {
  const [files, setFiles] = useState([]);
  const [originalVideoUrl, setOriginalVideoUrl] = useState("");
  const [originalMetadata, setOriginalMetadata] = useState(null);
  
  // Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [processStatus, setProcessStatus] = useState("");
  
  // Output Muted Video
  const [mutedVideoUrl, setMutedVideoUrl] = useState("");
  const [mutedBlob, setMutedBlob] = useState(null);
  const [mutedFileSize, setMutedFileSize] = useState(0);
  const [toastNotice, setToastNotice] = useState("");

  const originalVideoRef = useRef(null);
  const hiddenVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const recorderRef = useRef(null);
  const animFrameRef = useRef(null);

  const showToast = (msg) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(""), 3000);
  };

  // ─── Handle File Upload ─────────────────────────────────────────────────────
  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
    // Reset previous outputs
    if (mutedVideoUrl) {
      URL.revokeObjectURL(mutedVideoUrl);
      setMutedVideoUrl("");
    }
    setMutedBlob(null);
    setProgress(0);
    setIsProcessing(false);

    if (newFiles.length > 0) {
      const url = URL.createObjectURL(newFiles[0]);
      setOriginalVideoUrl(url);
    } else {
      setOriginalVideoUrl("");
      setOriginalMetadata(null);
    }
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (originalVideoUrl) URL.revokeObjectURL(originalVideoUrl);
      if (mutedVideoUrl) URL.revokeObjectURL(mutedVideoUrl);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [originalVideoUrl, mutedVideoUrl]);

  // Read metadata from original video
  const handleOriginalLoadedMetadata = (e) => {
    const v = e.target;
    setOriginalMetadata({
      duration: v.duration,
      width: v.videoWidth,
      height: v.videoHeight,
      name: files[0]?.name || "video.mp4",
      size: files[0]?.size || 0,
      type: files[0]?.type || "video/mp4",
    });
  };

  // ─── Core: Client-Side Audio Stripping via Canvas + MediaRecorder ───────────
  const startMutingProcess = async () => {
    if (!originalVideoUrl || !files[0]) return;

    setIsProcessing(true);
    setProgress(0);
    setProcessStatus("Initializing video processing engine…");

    const video = hiddenVideoRef.current;
    if (!video) {
      setIsProcessing(false);
      showToast("Error: Video element not ready");
      return;
    }

    try {
      video.src = originalVideoUrl;
      video.muted = true; // ensure no sound output during capture
      video.currentTime = 0;

      // Wait for video to be ready to play
      await new Promise((resolve) => {
        if (video.readyState >= 2) resolve();
        else video.onloadeddata = () => resolve();
      });

      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;
      const duration = video.duration || 1;

      // Setup processing canvas
      let canvas = canvasRef.current;
      if (!canvas) {
        canvas = document.createElement("canvas");
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      // Capture stream from canvas ONLY (strictly zero audio tracks)
      const stream = canvas.captureStream(30); // 30 FPS video-only stream

      // Supported MIME types
      let mimeType = "video/webm;codecs=vp8";
      if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
        mimeType = "video/webm;codecs=vp9";
      } else if (MediaRecorder.isTypeSupported("video/mp4")) {
        mimeType = "video/mp4";
      } else if (MediaRecorder.isTypeSupported("video/webm")) {
        mimeType = "video/webm";
      }

      const chunks = [];
      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 4000000, // 4 Mbps high fidelity
      });
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(chunks, { type: mimeType.split(";")[0] });
        const finalUrl = URL.createObjectURL(finalBlob);
        setMutedBlob(finalBlob);
        setMutedVideoUrl(finalUrl);
        setMutedFileSize(finalBlob.size);
        setIsProcessing(false);
        setProgress(100);
        setProcessStatus("Complete! Audio track successfully removed.");
        showToast("✓ Audio removed! Muted video ready for download.");
      };

      recorder.start(100); // 100ms chunk slices

      // Play video and draw frame-by-frame
      setProcessStatus("Stripping audio track & encoding silent video…");
      video.playbackRate = 1.5; // Fast-process
      await video.play();

      const renderLoop = () => {
        if (video.paused || video.ended) {
          if (video.ended) {
            recorder.stop();
          }
          return;
        }

        ctx.drawImage(video, 0, 0, width, height);

        // Update progress bar
        const currentPct = Math.min(99, Math.round((video.currentTime / duration) * 100));
        setProgress(currentPct);

        animFrameRef.current = requestAnimationFrame(renderLoop);
      };

      animFrameRef.current = requestAnimationFrame(renderLoop);

      video.onended = () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
      };
    } catch (err) {
      console.error("Mute video processing error:", err);
      setIsProcessing(false);
      setProcessStatus("Processing failed: " + err.message);
      showToast("Error processing video: " + err.message);
    }
  };

  // ─── Download Handler ───────────────────────────────────────────────────────
  const handleDownload = () => {
    if (!mutedBlob) return;
    const origName = files[0]?.name || "video";
    const baseName = origName.substring(0, origName.lastIndexOf(".")) || origName;
    const ext = mutedBlob.type.includes("mp4") ? "mp4" : "webm";
    downloadFile(mutedBlob, `${baseName}-muted.${ext}`, mutedBlob.type);
    showToast(`✓ Downloaded ${baseName}-muted.${ext}`);
  };

  const handleReset = () => {
    if (originalVideoUrl) URL.revokeObjectURL(originalVideoUrl);
    if (mutedVideoUrl) URL.revokeObjectURL(mutedVideoUrl);
    setFiles([]);
    setOriginalVideoUrl("");
    setMutedVideoUrl("");
    setMutedBlob(null);
    setOriginalMetadata(null);
    setProgress(0);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-5">
      {/* ── Hidden Processing Video & Canvas ──────────────────────────────── */}
      <video ref={hiddenVideoRef} className="hidden" playsInline muted />
      <canvas ref={canvasRef} className="hidden" />

      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
        style={{ background: "linear-gradient(135deg, #091524 0%, #0f2744 60%, #173254 100%)" }}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-2xl flex-shrink-0">
            🔇
          </div>
          <div>
            <div className="font-extrabold text-white text-base tracking-wide flex items-center gap-2">
              <span>Mute Video (Remove Audio Track)</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/20">
                100% Client-Side
              </span>
            </div>
            <div className="text-xs text-blue-200/70 font-medium mt-0.5">
              Permanently strip audio from MP4, WebM &amp; MOV videos directly in your browser with zero server uploads
            </div>
          </div>
        </div>

        {originalMetadata && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 cursor-pointer transition-all"
            >
              Upload Different Video
            </button>
          </div>
        )}

        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-blue-500/10 pointer-events-none" />
      </div>

      {/* ── Toast Notice ─────────────────────────────────────────────────── */}
      {toastNotice && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
          {toastNotice}
        </div>
      )}

      {/* ── Main Workspace ───────────────────────────────────────────────── */}
      {!originalVideoUrl ? (
        <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-6 sm:p-8 shadow-sm space-y-4">
          <div className="text-center max-w-lg mx-auto mb-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Upload Video to Strip Audio
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports MP4, WebM, MOV, MKV files up to 200MB. Your video stays strictly on your device.
            </p>
          </div>

          <FileDropzone
            accept="video/*,.mp4,.webm,.mov,.mkv,.avi"
            maxSizeMB={200}
            files={files}
            onFilesChange={handleFilesChange}
            hint="Drag &amp; drop video clip or click to browse"
          />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Top Video Stats Card */}
          {originalMetadata && (
            <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#182333] border border-slate-200/60 dark:border-[#2a3c53]">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">File Name</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate block mt-0.5" title={originalMetadata.name}>
                  {originalMetadata.name}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#182333] border border-slate-200/60 dark:border-[#2a3c53]">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Resolution</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono block mt-0.5">
                  {originalMetadata.width} × {originalMetadata.height}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#182333] border border-slate-200/60 dark:border-[#2a3c53]">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Duration</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono block mt-0.5">
                  {originalMetadata.duration.toFixed(1)}s
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#182333] border border-slate-200/60 dark:border-[#2a3c53]">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Original Size</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono block mt-0.5">
                  {formatBytes(originalMetadata.size)}
                </span>
              </div>
            </div>
          )}

          {/* Action & Progress Bar Panel */}
          <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Audio Removal Engine
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Click below to process and export a 100% silent video with no audio track.
                </p>
              </div>

              {!isProcessing && !mutedBlob && (
                <button
                  onClick={startMutingProcess}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>🔇</span>
                  <span>Remove Audio Track</span>
                </button>
              )}

              {mutedBlob && (
                <button
                  onClick={handleDownload}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download Muted Video ({formatBytes(mutedFileSize)})</span>
                </button>
              )}
            </div>

            {/* Live Progress Bar */}
            {isProcessing && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{processStatus}</span>
                  <span className="font-mono text-blue-600 dark:text-cyan-400">{progress}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-[#182333] overflow-hidden border border-slate-200 dark:border-[#2a3c53]">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-150 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Dual Players: Original vs Muted Video */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Original Video Player */}
            <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                  <span>🔊</span>
                  <span>Original Video (With Audio)</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-[#182333] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#2a3c53]">
                  Source
                </span>
              </div>

              <div className="rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800">
                <video
                  ref={originalVideoRef}
                  src={originalVideoUrl}
                  controls
                  onLoadedMetadata={handleOriginalLoadedMetadata}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Muted Video Player */}
            <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                  <span>🔇</span>
                  <span>Muted Output (Audio Removed)</span>
                </span>
                {mutedBlob ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    ● Ready to Download
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    Pending
                  </span>
                )}
              </div>

              <div className="rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800 relative">
                {mutedVideoUrl ? (
                  <video
                    src={mutedVideoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 text-xs p-6 text-center">
                    <span className="text-3xl mb-2">🔇</span>
                    <span className="font-semibold">Muted preview will appear here</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">Click &quot;Remove Audio Track&quot; above to process</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
