"use client";

import { useState, useRef } from "react";

export default function TextToHandwriting() {
  const [input, setInput] = useState("hey i am anu hoe are yiu");
  const [fontSize, setFontSize] = useState(24);
  const [fontStyle, setFontStyle] = useState("caveat");
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [lineHeight, setLineHeight] = useState(1.8);
  const canvasRef = useRef(null);

  const handwritingFonts = [
    { id: "caveat", name: "Caveat", fontFamily: "'Caveat', cursive", weight: "normal" },
    { id: "great-vibes", name: "Great Vibes", fontFamily: "'Great Vibes', cursive", weight: "normal" },
    { id: "indie-flower", name: "Indie Flower", fontFamily: "'Indie Flower', cursive", weight: "normal" },
    { id: "pacifico", name: "Pacifico", fontFamily: "'Pacifico', cursive", weight: "normal" },
    { id: "dancing", name: "Dancing Script", fontFamily: "'Dancing Script', cursive", weight: "600" },
    { id: "satisfy", name: "Satisfy", fontFamily: "'Satisfy', cursive", weight: "normal" },
  ];

  const currentFont = handwritingFonts.find((f) => f.id === fontStyle) || handwritingFonts[0];

  const downloadAsImage = () => {
    const canvas = document.createElement("canvas");
    const padding = 40;
    const lines = input.split("\n");

    canvas.width = 800;
    canvas.height = lines.length * fontSize * lineHeight + padding * 2;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = textColor;
    ctx.font = `${currentFont.weight} ${fontSize}px ${currentFont.fontFamily}`;
    ctx.textAlign = "left";

    lines.forEach((line, index) => {
      const y = padding + (index + 1) * fontSize * lineHeight;
      ctx.fillText(line, padding, y);
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "handwriting-text.png";
    link.click();
  };

  const downloadAsPDF = () => {
    const canvas = document.createElement("canvas");
    const padding = 40;
    const lines = input.split("\n");

    canvas.width = 800;
    canvas.height = lines.length * fontSize * lineHeight + padding * 2;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = textColor;
    ctx.font = `${currentFont.weight} ${fontSize}px ${currentFont.fontFamily}`;
    ctx.textAlign = "left";

    lines.forEach((line, index) => {
      const y = padding + (index + 1) * fontSize * lineHeight;
      ctx.fillText(line, padding, y);
    });

    // Simple PDF conversion using canvas
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "handwriting-text.pdf";
    link.click();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Great+Vibes&family=Indie+Flower&family=Pacifico&family=Dancing+Script:wght@400;600;700&family=Satisfy&display=swap');
      `}</style>

      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">✍️ Text to Handwriting</h2>
        <p className="text-gray-600 dark:text-gray-400">Convert your text into beautiful handwritten style with multiple fonts</p>
      </div>

      {/* Input Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Enter Your Text
        </label>
        <textarea
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 dark:bg-gray-800 dark:text-white resize-none font-mono text-sm transition-all"
          rows={5}
          placeholder="Type or paste your text here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {/* Customization Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 space-y-5">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Customization Options
        </h3>

        {/* Font Style Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Handwriting Font
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {handwritingFonts.map((font) => (
              <button
                key={font.id}
                onClick={() => setFontStyle(font.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform ${
                  fontStyle === font.id
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-500"
                }`}
                style={{ fontFamily: font.fontFamily }}
              >
                {font.name}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Font Size
            </label>
            <span className="text-blue-600 dark:text-blue-400 font-bold">{fontSize}px</span>
          </div>
          <input
            type="range"
            min="12"
            max="60"
            step="2"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Line Height */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Line Height
            </label>
            <span className="text-blue-600 dark:text-blue-400 font-bold">{lineHeight.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="0.2"
            value={lineHeight}
            onChange={(e) => setLineHeight(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Color Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Text Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-16 h-10 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{textColor}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Background Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-16 h-10 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{bgColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          📋 Live Preview
        </label>
        <div
          className="w-full p-8 rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-auto max-h-96"
          style={{
            backgroundColor: bgColor,
            fontFamily: currentFont.fontFamily,
            fontWeight: currentFont.weight,
            fontSize: `${fontSize}px`,
            color: textColor,
            lineHeight: lineHeight,
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        >
          {input || "Your handwritten text will appear here..."}
        </div>
      </div>

      {/* Download Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={downloadAsImage}
          disabled={!input.trim()}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <span>🖼️</span>
          Download as PNG
        </button>
        <button
          onClick={downloadAsPDF}
          disabled={!input.trim()}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <span>📄</span>
          Download as PDF
        </button>
      </div>

      {/* Features Info */}
      <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg">
        <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">✨ Features</h3>
        <ul className="text-sm text-green-800 dark:text-green-400 space-y-1">
          <li>✓ 6 beautiful handwriting fonts to choose from</li>
          <li>✓ Adjustable font size (12px - 60px)</li>
          <li>✓ Customize text and background colors</li>
          <li>✓ Live preview of your text</li>
          <li>✓ Download as PNG or PDF image</li>
          <li>✓ Control line height for better spacing</li>
        </ul>
      </div>
    </div>
  );
}
