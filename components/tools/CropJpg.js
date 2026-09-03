"use client";

import { useState, useRef, useEffect } from "react";
import FileDropzone from "@/components/FileDropzone";

const DEFAULT_CROP = { x: 10, y: 10, width: 80, height: 80 };

export default function CropJpg() {
  const [files, setFiles] = useState([]);
  const [aspect, setAspect] = useState("free");
  const [crop, setCrop] = useState(DEFAULT_CROP);
  const [imgSrc, setImgSrc] = useState(null);
  
  // Interactive Image Filters
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [blur, setBlur] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [watermark, setWatermark] = useState("");
  const [format, setFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState(92);
  
  const imgRef = useRef(null);
  const workspaceRef = useRef(null);
  const dragOrigin = useRef(null);
  const [imageBounds, setImageBounds] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImgSrc(url);
      setDone(false);
      return () => URL.revokeObjectURL(url);
    } else {
      setImgSrc(null);
      setDone(false);
    }
  }, [files]);

  const updateImageBounds = () => {
    if (!imgRef.current || !workspaceRef.current) return;
    const imageBox = imgRef.current.getBoundingClientRect();
    const workspaceBox = workspaceRef.current.getBoundingClientRect();
    setImageBounds({
      left: imageBox.left - workspaceBox.left,
      top: imageBox.top - workspaceBox.top,
      width: imageBox.width,
      height: imageBox.height,
    });
  };

  useEffect(() => {
    updateImageBounds();
    window.addEventListener("resize", updateImageBounds);
    return () => window.removeEventListener("resize", updateImageBounds);
  }, [imgSrc, rotation, flipX, flipY]);

  const handleAspectChange = (ratio) => {
    setAspect(ratio);
    if (ratio === "custom") {
      setCrop(DEFAULT_CROP);
      return;
    }
    if (ratio === "1:1") {
      setCrop({ x: 20, y: 20, width: 60, height: 60 });
    } else if (ratio === "4:3") {
      setCrop({ x: 10, y: 20, width: 80, height: 60 });
    } else if (ratio === "16:9") {
      setCrop({ x: 10, y: 25, width: 80, height: 45 });
    } else {
      setCrop({ x: 10, y: 10, width: 80, height: 80 });
    }
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setBlur(0);
    setGrayscale(0);
    setSaturation(100);
    setSepia(0);
    setRotation(0);
    setFlipX(false);
    setFlipY(false);
    setWatermark("");
  };

  const moveCrop = (e) => {
    if (!dragOrigin.current || dragOrigin.current.type !== "move") return;
    const box = imgRef.current?.getBoundingClientRect();
    if (!box) return;
    const dx = ((e.clientX - dragOrigin.current.x) / box.width) * 100;
    const dy = ((e.clientY - dragOrigin.current.y) / box.height) * 100;
    setCrop((current) => ({
      ...current,
      x: Math.max(0, Math.min(100 - current.width, dragOrigin.current.crop.x + dx)),
      y: Math.max(0, Math.min(100 - current.height, dragOrigin.current.crop.y + dy)),
    }));
  };

  const resizeCrop = (e) => {
    if (!dragOrigin.current || dragOrigin.current.type !== "resize") return;
    const box = imgRef.current?.getBoundingClientRect();
    if (!box) return;
    const dx = ((e.clientX - dragOrigin.current.x) / box.width) * 100;
    const dy = ((e.clientY - dragOrigin.current.y) / box.height) * 100;
    setCrop((current) => ({
      ...current,
      width: Math.max(8, Math.min(100 - current.x, dragOrigin.current.crop.width + dx)),
      height: Math.max(8, Math.min(100 - current.y, dragOrigin.current.crop.height + dy)),
    }));
  };

  const handleCropPointerMove = (e) => {
    moveCrop(e);
    resizeCrop(e);
  };

  const stopCropDrag = () => { dragOrigin.current = null; };

  const handleDownload = () => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    const transformed = document.createElement("canvas");
    const quarterTurn = rotation % 180 !== 0;
    transformed.width = quarterTurn ? img.naturalHeight : img.naturalWidth;
    transformed.height = quarterTurn ? img.naturalWidth : img.naturalHeight;
    const transformContext = transformed.getContext("2d");
    transformContext.translate(transformed.width / 2, transformed.height / 2);
    transformContext.rotate((rotation * Math.PI) / 180);
    transformContext.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    transformContext.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px)`;
    transformContext.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

    const canvas = document.createElement("canvas");
    const cropX = (crop.x / 100) * transformed.width;
    const cropY = (crop.y / 100) * transformed.height;
    const cropW = (crop.width / 100) * transformed.width;
    const cropH = (crop.height / 100) * transformed.height;
    canvas.width = Math.max(1, Math.round(cropW));
    canvas.height = Math.max(1, Math.round(cropH));
    const ctx = canvas.getContext("2d");
    ctx.drawImage(transformed, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);

    // Apply Watermark if provided
    if (watermark.trim()) {
      ctx.filter = "none";
      ctx.font = "bold 24px sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillText(watermark, 20, canvas.height - 20);
    }

    const extension = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";
    const a = document.createElement("a");
    a.download = `edited-${files[0]?.name?.replace(/\.[^.]+$/, "") || "image"}.${extension}`;
    a.href = canvas.toDataURL(format, quality / 100);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDone(true);
  };

  return (
    <div className="space-y-6">
      {!imgSrc ? (
        <FileDropzone
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          maxSizeMB={50}
          files={files}
          onFilesChange={setFiles}
          hint="Upload up to 20 images to crop & edit simultaneously"
        />
      ) : (
        <div className="space-y-6">
          {/* Top Controls Bar */}
          <div className="flex flex-wrap gap-2 items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setRotation((value) => (value + 270) % 360)} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200" title="Rotate left">↶ Rotate left</button>
              <button onClick={() => setRotation((value) => (value + 90) % 360)} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200" title="Rotate right">↷ Rotate right</button>
              <button onClick={() => setFlipX((value) => !value)} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200">↔ Flip horizontal</button>
              <button onClick={() => setFlipY((value) => !value)} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200">↕ Flip vertical</button>
            </div>
            <div className="flex gap-2">
              {["free", "1:1", "4:3", "16:9", "custom"].map((r) => (
                <button
                  key={r}
                  onClick={() => handleAspectChange(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all ${
                    aspect === r
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {r === "custom" ? "Custom" : r}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={resetFilters} className="text-xs text-slate-500 hover:text-slate-700 font-semibold">
                Reset Filters
              </button>
              <button
                onClick={() => setFiles([])}
                className="text-xs text-red-600 hover:underline font-semibold"
              >
                Change Image
              </button>
            </div>
          </div>

          {/* Image Workspace & Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Image Canvas Box */}
            <div ref={workspaceRef} onPointerMove={handleCropPointerMove} onPointerUp={stopCropDrag} onPointerCancel={stopCropDrag} className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-200 select-none min-h-[350px]">
              <img
                ref={imgRef}
                src={imgSrc}
                alt="Crop preview"
                onLoad={updateImageBounds}
                className="max-h-[400px] w-auto object-contain block mx-auto transition-all"
                style={{
                  filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) grayscale(${grayscale}%) sepia(${sepia}%)`,
                  transform: `rotate(${rotation}deg) scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
                }}
              />
              <div
                className="absolute border-2 border-cyan-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] cursor-move bg-cyan-300/5"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  dragOrigin.current = { type: "move", x: e.clientX, y: e.clientY, crop };
                }}
                style={{
                  left: imageBounds ? imageBounds.left + (crop.x / 100) * imageBounds.width : 0,
                  top: imageBounds ? imageBounds.top + (crop.y / 100) * imageBounds.height : 0,
                  width: imageBounds ? (crop.width / 100) * imageBounds.width : 0,
                  height: imageBounds ? (crop.height / 100) * imageBounds.height : 0,
                }}
              >
                {aspect === "custom" && (
                  <span
                    className="absolute bottom-[-7px] right-[-7px] h-4 w-4 cursor-se-resize rounded-full border-2 border-white bg-cyan-500 shadow"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      e.currentTarget.setPointerCapture(e.pointerId);
                      dragOrigin.current = { type: "resize", x: e.clientX, y: e.clientY, crop };
                    }}
                    aria-label="Resize custom crop"
                  />
                )}
              </div>
            </div>

            {/* Interactive Adjustment Controls Panel */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Image Adjustments</h4>


              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Brightness</span>
                  <span>{brightness}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={200}
                  value={brightness}
                  onChange={(e) => setBrightness(e.target.value)}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Contrast</span>
                  <span>{contrast}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={200}
                  value={contrast}
                  onChange={(e) => setContrast(e.target.value)}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Saturation</span>
                  <span>{saturation}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Blur</span>
                  <span>{blur}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={blur}
                  onChange={(e) => setBlur(e.target.value)}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Grayscale</span>
                  <span>{grayscale}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={grayscale}
                  onChange={(e) => setGrayscale(e.target.value)}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Sepia</span>
                  <span>{sepia}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sepia}
                  onChange={(e) => setSepia(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Rotation</span>
                  <span>{rotation}°</span>
                </div>
                <div className="flex gap-2">
                  {[0, 90, 180, 270].map((deg) => (
                    <button
                      key={deg}
                      onClick={() => setRotation(deg)}
                      className={`flex-1 py-1 rounded border text-[11px] font-bold ${
                        rotation === deg ? "bg-blue-600 text-white" : "bg-white text-slate-700"
                      }`}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Add Watermark Text</label>
                <input
                  type="text"
                  placeholder="e.g. FreeTooly.com"
                  value={watermark}
                  onChange={(e) => setWatermark(e.target.value)}
                  className="tool-input py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="block font-semibold">Format
                  <select value={format} onChange={(e) => setFormat(e.target.value)} className="tool-input py-2 text-xs mt-1">
                    <option value="image/jpeg">JPG</option>
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WebP</option>
                  </select>
                </label>
                <label className="block font-semibold">Quality
                  <input type="number" min="10" max="100" value={quality} onChange={(e) => setQuality(Math.max(10, Math.min(100, Number(e.target.value))))} className="tool-input py-2 text-xs mt-1" />
                </label>
              </div>
            </div>
          </div>

          {done && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <span>✅</span>
              <span>Edited image downloaded successfully!</span>
            </div>
          )}

          <button onClick={handleDownload} className="ct-btn-primary w-full py-3">
            Download Edited & Cropped Image
          </button>
        </div>
      )}
    </div>
  );
}
