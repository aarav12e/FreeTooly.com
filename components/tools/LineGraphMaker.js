"use client";

import { useState, useMemo } from "react";

export default function LineGraphMaker() {
  const [input, setInput] = useState("1,2,3,4,5\n10,25,18,35,40,30");
  const [lineColor, setLineColor] = useState("#3b82f6");
  const [gridColor, setGridColor] = useState("#e5e7eb");
  const [bgColor, setBgColor] = useState("#ffffff");

  const { datasets, error } = useMemo(() => {
    try {
      const lines = input
        .trim()
        .split("\n")
        .filter((line) => line.trim());

      if (lines.length === 0) {
        return { datasets: null, error: "Please enter at least one line of data" };
      }

      const parsedDatasets = lines.map((line) => {
        const values = line
          .split(",")
          .map((v) => parseFloat(v.trim()))
          .filter((v) => !isNaN(v));

        if (values.length === 0) {
          throw new Error("Invalid data format");
        }

        return values;
      });

      return { datasets: parsedDatasets, error: "" };
    } catch (e) {
      return { datasets: null, error: "Invalid input format. Please use comma-separated values on each line." };
    }
  }, [input]);

  const generateSVG = () => {
    if (!datasets || datasets.length === 0) return null;

    const width = 800;
    const height = 400;
    const padding = 60;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    const allValues = datasets.flat();
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const range = maxValue - minValue || 1;
    const maxPoints = Math.max(...datasets.map((d) => d.length));

    // Helper to convert data point to SVG coordinates
    const getX = (index) => padding + (index / (maxPoints - 1 || 1)) * graphWidth;
    const getY = (value) =>
      height - padding - (((value - minValue) / range) * graphHeight || graphHeight / 2);

    const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

    return (
      <svg width={width} height={height} className="border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900">
        {/* Background */}
        <rect width={width} height={height} fill={bgColor} />

        {/* Vertical Grid Lines */}
        {Array.from({ length: maxPoints }).map((_, i) => {
          const x = getX(i);
          return (
            <line
              key={`vgrid-${i}`}
              x1={x}
              y1={padding}
              x2={x}
              y2={height - padding}
              stroke={gridColor}
              strokeWidth="1"
              opacity="0.5"
            />
          );
        })}

        {/* Horizontal Grid Lines */}
        {Array.from({ length: 5 }).map((_, i) => {
          const y = padding + (i * graphHeight) / 4;
          const value = maxValue - (i * range) / 4;
          return (
            <g key={`hgrid-${i}`}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke={gridColor}
                strokeWidth="1"
                opacity="0.5"
              />
              <text x={padding - 10} y={y} fontSize="12" textAnchor="end" dominantBaseline="middle" className="fill-gray-600 dark:fill-gray-400">
                {value.toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* X-axis */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#000" strokeWidth="2" />

        {/* Y-axis */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#000" strokeWidth="2" />

        {/* X-axis Labels */}
        {Array.from({ length: maxPoints }).map((_, i) => {
          const x = getX(i);
          return (
            <text
              key={`xlabel-${i}`}
              x={x}
              y={height - padding + 25}
              fontSize="12"
              textAnchor="middle"
              className="fill-gray-600 dark:fill-gray-400"
            >
              {i + 1}
            </text>
          );
        })}

        {/* Y-axis Label */}
        <text
          x={15}
          y={height / 2}
          fontSize="14"
          textAnchor="middle"
          transform={`rotate(-90 15 ${height / 2})`}
          className="fill-gray-600 dark:fill-gray-400"
          fontWeight="bold"
        >
          Values
        </text>

        {/* Data Lines */}
        {datasets.map((dataset, datasetIndex) => {
          const color = colors[datasetIndex % colors.length];
          const pathData = dataset
            .map((value, index) => {
              const x = getX(index);
              const y = getY(value);
              return `${index === 0 ? "M" : "L"} ${x} ${y}`;
            })
            .join(" ");

          return (
            <g key={`dataset-${datasetIndex}`}>
              {/* Line */}
              <path d={pathData} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

              {/* Points */}
              {dataset.map((value, index) => {
                const x = getX(index);
                const y = getY(value);
                return (
                  <circle
                    key={`point-${datasetIndex}-${index}`}
                    cx={x}
                    cy={y}
                    r="4"
                    fill={color}
                    opacity="0.8"
                    className="hover:r-6 transition-all"
                  />
                );
              })}
            </g>
          );
        })}

        {/* Legend */}
        {datasets.map((_, i) => {
          const color = colors[i % colors.length];
          return (
            <g key={`legend-${i}`}>
              <rect x={width - 180} y={20 + i * 25} width="15" height="15" fill={color} />
              <text
                x={width - 160}
                y={32 + i * 25}
                fontSize="12"
                className="fill-gray-700 dark:fill-gray-300"
              >
                Series {i + 1}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const downloadSVG = () => {
    if (!datasets || datasets.length === 0 || error) return;
    const svg = generateSVG();
    if (!svg) return;

    const svgString = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "line-graph.svg";
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPNG = () => {
    if (!datasets || datasets.length === 0 || error) return;
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    const svg = generateSVG();
    if (!svg) return;

    const svgString = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "line-graph.png";
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgString);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      {/* Input Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Enter Data (comma-separated values, one line per series)
        </label>
        <textarea
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 dark:bg-gray-800 dark:text-white resize-none font-mono text-sm transition-all"
          rows={4}
          placeholder="1,2,3,4,5&#10;10,25,18,35,40,30"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {/* Customization Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Background Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">{bgColor}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Grid Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={gridColor}
              onChange={(e) => setGridColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">{gridColor}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Primary Line Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={lineColor}
              onChange={(e) => setLineColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">{lineColor}</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700 dark:text-red-400 font-semibold text-sm">{error}</p>
        </div>
      )}

      {/* Graph Preview */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          📊 Graph Preview
        </label>
        <div className="flex justify-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
          {generateSVG()}
        </div>
      </div>

      {/* Download Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={downloadSVG}
          disabled={!datasets || datasets.length === 0 || !!error}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <span>⬇️</span>
          Download as SVG
        </button>
        <button
          onClick={downloadPNG}
          disabled={!datasets || datasets.length === 0 || !!error}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <span>🖼️</span>
          Download as PNG
        </button>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg">
        <p className="text-blue-700 dark:text-blue-400 font-semibold text-sm">
          💡 Tip: Enter one line of comma-separated values per data series. The graph will automatically scale to fit your data!
        </p>
      </div>
    </div>
  );
}
