"use client";

import { useState, useRef } from "react";
import FileDropzone from "@/components/FileDropzone";

export default function VideoTools() {
  const [files, setFiles] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [capturedFrames, setCapturedFrames] = useState([]);
  const [videoInfo, setVideoInfo] = useState(null);
  const videoRef = useRef(null);

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
    setCapturedFrames([]);
    if (newFiles.length > 0) {
      const url = URL.createObjectURL(newFiles[0]);
      setVideoUrl(url);
    } else {
      setVideoUrl("");
      setVideoInfo(null);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoInfo({
        duration: videoRef.current.duration.toFixed(2),
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      });
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 360;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setCapturedFrames((prev) => [dataUrl, ...prev.slice(0, 5)]);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-[#131d2b] border border-slate-200 dark:border-[#223247] rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Video Tools & Player</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Inspect video dimensions, adjust playback speed, mute audio, loop video, and extract high-resolution screenshot frames 100% in your browser.
        </p>

        {!videoUrl ? (
          <FileDropzone
            accept="video/*,.mp4,.webm,.mov,.mkv"
            maxSizeMB={200}
            files={files}
            onFilesChange={handleFilesChange}
            hint="Upload video clip (.mp4, .webm, .mov, etc.)"
          />
        ) : (
          <div className="space-y-5">
            {/* Video Player Box */}
            <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl flex items-center justify-center">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                muted={isMuted}
                loop={isLooping}
                onLoadedMetadata={handleLoadedMetadata}
                className="max-h-[480px] w-full object-contain"
              />
            </div>

            {/* Video Metadata */}
            {videoInfo && (
              <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 dark:bg-[#0f1725] rounded-xl border border-slate-200 dark:border-[#202f43] text-center text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{videoInfo.duration}s</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Resolution</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{videoInfo.width} × {videoInfo.height}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">File Size</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {(files[0].size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
            )}

            {/* Controls Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-[#111a27] rounded-xl border border-slate-200 dark:border-[#223348]">
              {/* Playback Speeds */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Speed:</span>
                {[0.5, 1, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      playbackSpeed === s
                        ? "bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-sm"
                        : "bg-white dark:bg-[#1a2738] border border-slate-200 dark:border-[#2a3c52] text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMuted}
                    onChange={(e) => setIsMuted(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Mute Audio
                </label>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLooping}
                    onChange={(e) => setIsLooping(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Loop Video
                </label>
              </div>

              {/* Capture Current Frame */}
              <button
                onClick={captureFrame}
                className="px-4 py-2 bg-blue-600 dark:bg-cyan-500 hover:bg-blue-700 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                📸 Capture Frame (PNG)
              </button>
            </div>

            {/* Captured Frames Gallery */}
            {capturedFrames.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  Captured Screenshot Frames ({capturedFrames.length})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {capturedFrames.map((frame, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-[#26374d]">
                      <img src={frame} alt={`Frame ${idx + 1}`} className="w-full h-28 object-cover" />
                      <a
                        href={frame}
                        download={`video_frame_${idx + 1}.png`}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                      >
                        ⬇ Download Frame
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Change File Button */}
            <div className="text-center pt-2">
              <button
                onClick={() => setVideoUrl("")}
                className="text-xs text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 font-semibold underline"
              >
                Upload Different Video
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
