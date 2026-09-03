"use client";

import { useState, useEffect, useRef } from "react";
import CopyButton from "@/components/CopyButton";
import { downloadFile } from "@/lib/file-utils";

// Comprehensive mathematical presets
const PRESETS = [
  {
    name: "Quadratic Formula",
    category: "Algebra",
    code: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
  },
  {
    name: "Gaussian Integral",
    category: "Calculus",
    code: "\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}",
  },
  {
    name: "Euler's Identity",
    category: "Algebra",
    code: "e^{i\\pi} + 1 = 0",
  },
  {
    name: "Schrödinger Equation",
    category: "Physics",
    code: "i\\hbar \\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r}, t) = \\left[ -\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r}, t) \\right] \\Psi(\\mathbf{r}, t)",
  },
  {
    name: "Normal Distribution",
    category: "Statistics",
    code: "f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left( -\\frac{1}{2}\\left(\\frac{x - \\mu}{\\sigma}\\right)^{\\!2} \\right)",
  },
  {
    name: "Fourier Transform",
    category: "Calculus",
    code: "\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x) \\, e^{-2\\pi i x \\xi} \\, dx",
  },
  {
    name: "Matrix Multiplication",
    category: "Linear Algebra",
    code: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ax + by \\\\ cx + dy \\end{pmatrix}",
  },
  {
    name: "Taylor Series",
    category: "Calculus",
    code: "f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!} (x - a)^n",
  },
  {
    name: "Navier-Stokes",
    category: "Physics",
    code: "\\rho \\left( \\frac{\\partial \\mathbf{u}}{\\partial t} + \\mathbf{u} \\cdot \\nabla \\mathbf{u} \\right) = -\\nabla p + \\mu \\nabla^2 \\mathbf{u} + \\mathbf{f}",
  },
  {
    name: "Full Document Example",
    category: "Document",
    code: `\\documentclass{article}
\\usepackage{amsmath}

\\begin{document}
\\section*{Calculus Fundamentals}
The fundamental theorem of calculus states that:

\\begin{equation}
\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)
\\end{equation}

Where $F'(x) = f(x)$ for all $x \\in [a, b]$.
\\end{document}`,
  },
];

// Categorized Quick Insert Symbols
const SYMBOL_CATEGORIES = [
  {
    name: "Common",
    symbols: [
      { label: "a/b", latex: "\\frac{a}{b}", desc: "Fraction" },
      { label: "√x", latex: "\\sqrt{x}", desc: "Square root" },
      { label: "ⁿ√x", latex: "\\sqrt[n]{x}", desc: "n-th root" },
      { label: "xⁿ", latex: "x^{n}", desc: "Superscript / Power" },
      { label: "xₙ", latex: "x_{n}", desc: "Subscript" },
      { label: "±", latex: "\\pm", desc: "Plus-minus" },
      { label: "×", latex: "\\times", desc: "Multiply" },
      { label: "÷", latex: "\\div", desc: "Divide" },
      { label: "·", latex: "\\cdot", desc: "Dot product" },
      { label: "≠", latex: "\\neq", desc: "Not equal" },
      { label: "≈", latex: "\\approx", desc: "Approximately" },
      { label: "≤", latex: "\\le", desc: "Less or equal" },
      { label: "≥", latex: "\\ge", desc: "Greater or equal" },
      { label: "∞", latex: "\\infty", desc: "Infinity" },
    ],
  },
  {
    name: "Calculus",
    symbols: [
      { label: "∫", latex: "\\int_{a}^{b} f(x) \\, dx", desc: "Definite integral" },
      { label: "∬", latex: "\\iint_{D} f(x,y) \\, dxdy", desc: "Double integral" },
      { label: "∮", latex: "\\oint_{C} \\mathbf{F} \\cdot d\\mathbf{r}", desc: "Contour integral" },
      { label: "d/dx", latex: "\\frac{d}{dx}", desc: "Derivative" },
      { label: "∂/∂x", latex: "\\frac{\\partial f}{\\partial x}", desc: "Partial derivative" },
      { label: "lim", latex: "\\lim_{x \\to 0}", desc: "Limit" },
      { label: "∑", latex: "\\sum_{i=1}^{n}", desc: "Summation" },
      { label: "∏", latex: "\\prod_{i=1}^{n}", desc: "Product" },
      { label: "∇", latex: "\\nabla", desc: "Nabla / Gradient" },
    ],
  },
  {
    name: "Greek Letters",
    symbols: [
      { label: "α", latex: "\\alpha", desc: "Alpha" },
      { label: "β", latex: "\\beta", desc: "Beta" },
      { label: "γ", latex: "\\gamma", desc: "Gamma" },
      { label: "δ", latex: "\\delta", desc: "Delta" },
      { label: "ε", latex: "\\epsilon", desc: "Epsilon" },
      { label: "θ", latex: "\\theta", desc: "Theta" },
      { label: "λ", latex: "\\lambda", desc: "Lambda" },
      { label: "μ", latex: "\\mu", desc: "Mu" },
      { label: "π", latex: "\\pi", desc: "Pi" },
      { label: "σ", latex: "\\sigma", desc: "Sigma" },
      { label: "ω", latex: "\\omega", desc: "Omega" },
      { label: "Δ", latex: "\\Delta", desc: "Capital Delta" },
      { label: "Ω", latex: "\\Omega", desc: "Capital Omega" },
      { label: "Σ", latex: "\\Sigma", desc: "Capital Sigma" },
    ],
  },
  {
    name: "Matrices & Structures",
    symbols: [
      {
        label: "(Matrix)",
        latex: "\\begin{pmatrix}\na & b \\\\\nc & d\n\\end{pmatrix}",
        desc: "Parentheses Matrix",
      },
      {
        label: "[Matrix]",
        latex: "\\begin{bmatrix}\na & b \\\\\nc & d\n\\end{bmatrix}",
        desc: "Brackets Matrix",
      },
      {
        label: "|Det|",
        latex: "\\begin{vmatrix}\na & b \\\\\nc & d\n\\end{vmatrix}",
        desc: "Determinant",
      },
      {
        label: "{Cases",
        latex: "\\begin{cases}\nx & \\text{if } x \\ge 0 \\\\\n-x & \\text{if } x < 0\n\\end{cases}",
        desc: "Piecewise cases",
      },
      {
        label: "Align",
        latex: "\\begin{aligned}\na &= b + c \\\\\nx &= y + z\n\\end{aligned}",
        desc: "Aligned equations",
      },
    ],
  },
  {
    name: "Logic & Sets",
    symbols: [
      { label: "∈", latex: "\\in", desc: "Element of" },
      { label: "∉", latex: "\\notin", desc: "Not element of" },
      { label: "⊂", latex: "\\subset", desc: "Subset of" },
      { label: "∪", latex: "\\cup", desc: "Union" },
      { label: "∩", latex: "\\cap", desc: "Intersection" },
      { label: "∀", latex: "\\forall", desc: "For all" },
      { label: "∃", latex: "\\exists", desc: "There exists" },
      { label: "⇒", latex: "\\implies", desc: "Implies" },
      { label: "⇔", latex: "\\iff", desc: "If and only if" },
      { label: "→", latex: "\\to", desc: "Right arrow" },
    ],
  },
];

export default function LatexCompiler() {
  const [latexInput, setLatexInput] = useState(
    "\\int_{0}^{\\infty} e^{-x^2} \\, dx = \\frac{\\sqrt{\\pi}}{2}"
  );
  const [renderedHtml, setRenderedHtml] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [displayMode, setDisplayMode] = useState(true);
  const [fontSize, setFontSize] = useState("text-2xl");
  const [colorTheme, setColorTheme] = useState("dark");
  const [activeTab, setActiveTab] = useState("Common");
  const [katexLoaded, setKatexLoaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const previewRef = useRef(null);
  const textareaRef = useRef(null);

  // Dynamically load MathJax (for vector SVG path glyphs) and KaTeX (for fast live preview)
  useEffect(() => {
    // 1. Configure MathJax before script load
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
      },
      svg: {
        fontCache: 'local', // Embeds all vector glyphs directly in <defs>
      },
      startup: {
        typeset: false,
      },
    };

    // 2. Load MathJax tex-svg
    const mathjaxScriptId = "mathjax-svg-cdn";
    if (!document.getElementById(mathjaxScriptId)) {
      const script = document.createElement("script");
      script.id = mathjaxScriptId;
      script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
      script.async = true;
      script.onload = () => {
        setKatexLoaded(true);
      };
      document.head.appendChild(script);
    }

    // 3. Also load KaTeX for dual compatibility
    const cssId = "katex-css-cdn";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css";
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    }

    const katexScriptId = "katex-js-cdn";
    if (!document.getElementById(katexScriptId)) {
      const kScript = document.createElement("script");
      kScript.id = katexScriptId;
      kScript.src = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js";
      kScript.onload = () => {
        setKatexLoaded(true);
      };
      document.head.appendChild(kScript);
    }
  }, []);

  // Helper to compile LaTeX string
  const compileLatex = (code) => {
    if (!code || !code.trim()) {
      setRenderedHtml("<span class='text-slate-400 opacity-50'>Enter LaTeX math formula to preview...</span>");
      setErrorMessage("");
      return;
    }

    let textToRender = code.trim();

    // Strip enclosing single/double dollars
    if (textToRender.startsWith("$$") && textToRender.endsWith("$$")) {
      textToRender = textToRender.slice(2, -2).trim();
    } else if (textToRender.startsWith("$") && textToRender.endsWith("$")) {
      textToRender = textToRender.slice(1, -1).trim();
    }

    // Try MathJax SVG vector engine first
    if (window.MathJax && window.MathJax.tex2svg) {
      try {
        const svgNode = window.MathJax.tex2svg(textToRender, { display: displayMode });
        const svgElem = svgNode.querySelector("svg");
        if (svgElem) {
          svgElem.style.overflow = "visible";
          setRenderedHtml(svgNode.innerHTML);
          setErrorMessage("");
          return;
        }
      } catch (mjErr) {
        // Fall through to KaTeX
      }
    }

    // Fallback to KaTeX
    if (window.katex) {
      try {
        // Check for full document structure
        if (textToRender.includes("\\documentclass") || textToRender.includes("\\begin{document}")) {
          const docBodyMatch = textToRender.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/);
          const bodyContent = docBodyMatch ? docBodyMatch[1] : textToRender;
          const segments = bodyContent.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$|\\begin\{equation\}[\s\S]*?\\end\{equation\}|\\begin\{align\*?\}[\s\S]*?\\end\{align\*?\})/g);
          
          let outputHtml = "<div class='space-y-4 text-left leading-relaxed font-sans'>";
          for (const segment of segments) {
            if (!segment || !segment.trim()) continue;
            if (segment.startsWith("$$") && segment.endsWith("$$")) {
              const math = segment.slice(2, -2).trim();
              const mathHtml = window.katex.renderToString(math, { displayMode: true, throwOnError: false });
              outputHtml += `<div class='my-3 overflow-x-auto text-center'>${mathHtml}</div>`;
            } else if (segment.startsWith("$") && segment.endsWith("$")) {
              const math = segment.slice(1, -1).trim();
              const mathHtml = window.katex.renderToString(math, { displayMode: false, throwOnError: false });
              outputHtml += `<span>${mathHtml}</span>`;
            } else if (segment.includes("\\begin{equation}") || segment.includes("\\begin{align")) {
              const mathHtml = window.katex.renderToString(segment, { displayMode: true, throwOnError: false });
              outputHtml += `<div class='my-3 overflow-x-auto text-center'>${mathHtml}</div>`;
            } else {
              const cleanText = segment
                .replace(/\\section\*?\{([^}]+)\}/g, "<h3 class='text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2'>$1</h3>")
                .replace(/\\subsection\*?\{([^}]+)\}/g, "<h4 class='text-base font-semibold text-slate-800 dark:text-slate-200 mt-3 mb-1'>$1</h4>")
                .replace(/\\textbf\{([^}]+)\}/g, "<strong>$1</strong>")
                .replace(/\\textit\{([^}]+)\}/g, "<em>$1</em>");
              outputHtml += `<div class='text-slate-700 dark:text-slate-300'>${cleanText}</div>`;
            }
          }
          outputHtml += "</div>";
          setRenderedHtml(outputHtml);
          setErrorMessage("");
          return;
        }

        const html = window.katex.renderToString(textToRender, {
          displayMode: displayMode,
          throwOnError: true,
          output: "htmlAndMathml",
        });
        setRenderedHtml(html);
        setErrorMessage("");
      } catch (err) {
        setErrorMessage(err.message || "LaTeX syntax error");
      }
    } else {
      setRenderedHtml("<span class='text-amber-500 animate-pulse'>Compiling LaTeX engine...</span>");
    }
  };

  // Re-compile whenever input, displayMode, or engine readiness changes
  useEffect(() => {
    compileLatex(latexInput);
  }, [latexInput, displayMode, katexLoaded]);

  // Insert symbol or snippet at textarea cursor position
  const handleInsertSymbol = (snippet) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setLatexInput((prev) => prev + " " + snippet);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = latexInput.substring(0, start);
    const after = latexInput.substring(end);
    const updated = before + snippet + after;

    setLatexInput(updated);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 10);
  };

  const [exportNotice, setExportNotice] = useState("");

  const showNotice = (msg) => {
    setExportNotice(msg);
    setTimeout(() => setExportNotice(""), 3500);
  };

  // Helper to generate a standalone pure Vector SVG string
  const generatePureSvgString = () => {
    let mathText = latexInput.trim();
    if (mathText.startsWith("$$") && mathText.endsWith("$$")) {
      mathText = mathText.slice(2, -2).trim();
    } else if (mathText.startsWith("$") && mathText.endsWith("$")) {
      mathText = mathText.slice(1, -1).trim();
    }

    const textColor = colorTheme === "light" ? "#0f172a" : colorTheme === "solarized" ? "#93a1a1" : "#ffffff";
    const bgColor = colorTheme === "light" ? "#ffffff" : colorTheme === "solarized" ? "#002b36" : "#090e16";

    // 1. If MathJax is present, it generates pure vector <path> curves with 0 external dependencies!
    if (window.MathJax && window.MathJax.tex2svg) {
      try {
        const svgNode = window.MathJax.tex2svg(mathText, { display: true });
        const svgElem = svgNode.querySelector("svg");
        if (svgElem) {
          const viewBox = svgElem.getAttribute("viewBox") || "0 0 800 200";
          const innerSvg = svgElem.innerHTML;

          // Wrap in a standalone SVG with background and embedded vector paths
          return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${viewBox}" style="background-color: ${bgColor}; color: ${textColor}; fill: currentColor; stroke: currentColor; padding: 20px;">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <g fill="${textColor}" stroke="${textColor}" style="color: ${textColor};">
    ${innerSvg}
  </g>
</svg>`;
        }
      } catch (e) {
        console.error("MathJax SVG extraction error:", e);
      }
    }

    // 2. Fallback KaTeX SVG wrapper
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="220" viewBox="0 0 800 220">
  <rect width="100%" height="100%" fill="${bgColor}" rx="12"/>
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:center;justify-content:center;height:100%;color:${textColor};font-family:'Times New Roman',serif;font-size:24px;">
      ${renderedHtml}
    </div>
  </foreignObject>
</svg>`;
  };

  // Export as standalone Vector SVG (Opens in macOS Preview, Finder, Word, Web without blanks)
  const handleDownloadSvg = () => {
    if (!latexInput.trim()) return;
    try {
      const svgString = generatePureSvgString();
      downloadFile(svgString, "equation.svg", "image/svg+xml");
      showNotice("✓ Downloaded Vector SVG (lossless vector paths)");
    } catch (e) {
      console.error(e);
      showNotice("Failed to generate SVG: " + e.message);
    }
  };

  // Export as true PNG image using clean SVG paths (Never taints canvas)
  const handleExportPng = () => {
    if (!latexInput.trim()) return;
    setIsExporting(true);

    try {
      const svgString = generatePureSvgString();
      const bgColor = colorTheme === "light" ? "#ffffff" : colorTheme === "solarized" ? "#002b36" : "#090e16";

      // Convert SVG to data URL
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        try {
          const scale = 3; // 3x High-Resolution Retina output
          const width = Math.max(img.width || 800, 600);
          const height = Math.max(img.height || 220, 180);

          const canvas = document.createElement("canvas");
          canvas.width = width * scale;
          canvas.height = height * scale;
          const ctx = canvas.getContext("2d");

          // Draw solid background
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw vector SVG
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);

          canvas.toBlob((blob) => {
            if (blob) {
              downloadFile(blob, "equation.png", "image/png");
              showNotice("✓ Downloaded equation.png (High Resolution)");
            } else {
              downloadFile(svgBlob, "equation.svg", "image/svg+xml");
              showNotice("✓ Downloaded Vector SVG");
            }
            setIsExporting(false);
          }, "image/png");
        } catch (canvasErr) {
          console.error("Canvas export fallback:", canvasErr);
          downloadFile(svgBlob, "equation.svg", "image/svg+xml");
          showNotice("✓ Downloaded Vector SVG (lossless quality)");
          setIsExporting(false);
        }
      };

      img.onerror = (err) => {
        console.error("Image load fallback:", err);
        downloadFile(svgBlob, "equation.svg", "image/svg+xml");
        showNotice("✓ Downloaded Vector SVG (lossless quality)");
        setIsExporting(false);
      };

      img.src = url;
    } catch (e) {
      console.error(e);
      showNotice("Failed to export: " + e.message);
      setIsExporting(false);
    }
  };

  // Download .tex file
  const handleDownloadTex = () => {
    downloadFile(latexInput, "equation.tex", "text/plain");
    showNotice("✓ Saved equation.tex");
  };

  const getThemeContainerClass = () => {
    switch (colorTheme) {
      case "light":
        return "bg-white text-slate-900 border-slate-200 shadow-inner";
      case "solarized":
        return "bg-[#002b36] text-[#93a1a1] border-[#073642]";
      case "dark":
      default:
        return "bg-[#090e16] text-white border-[#1c2a3d] shadow-inner";
    }
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Top Header & Preset Selector                                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-[#111a27] p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-[#223247]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
            LaTeX Equation Engine {katexLoaded ? "• Ready" : "• Initializing..."}
          </span>
        </div>

        {/* Quick Presets Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Sample Equations:</label>
          <select
            onChange={(e) => {
              const selected = PRESETS.find((p) => p.name === e.target.value);
              if (selected) setLatexInput(selected.code);
            }}
            className="text-xs bg-white dark:bg-[#182333] border border-slate-300 dark:border-[#2a3c53] rounded-lg px-2.5 py-1.5 font-medium text-slate-800 dark:text-white outline-none cursor-pointer focus:border-cyan-500"
            defaultValue=""
          >
            <option value="" disabled>Load preset template...</option>
            {PRESETS.map((preset) => (
              <option key={preset.name} value={preset.name}>
                {preset.name} ({preset.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Quick Insert Math Symbols Toolbar                                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white dark:bg-[#131d2b] border border-slate-200 dark:border-[#223247] rounded-xl p-3 sm:p-4 shadow-sm">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 pb-2.5 mb-3 border-b border-slate-100 dark:border-[#202f43]">
          {SYMBOL_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveTab(cat.name)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeTab === cat.name
                  ? "bg-blue-600 dark:bg-cyan-500 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-[#192738] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#22344a]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Symbols Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-9 gap-1.5">
          {SYMBOL_CATEGORIES.find((c) => c.name === activeTab)?.symbols.map((sym, idx) => (
            <button
              key={idx}
              onClick={() => handleInsertSymbol(sym.latex)}
              title={`${sym.desc}: ${sym.latex}`}
              className="px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-[#182333] hover:bg-blue-50 dark:hover:bg-cyan-950/50 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-300 border border-slate-200 dark:border-[#26374d] text-xs font-mono font-bold transition-all transform hover:scale-105 active:scale-95 text-center truncate"
            >
              {sym.label}
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* LaTeX Code Input Area                                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span>LaTeX Source Code</span>
            <span className="text-[10px] font-normal text-slate-400 normal-case">(Type equation or full LaTeX document)</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLatexInput("")}
              className="text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors"
            >
              Clear
            </button>
            <CopyButton text={latexInput} label="Copy LaTeX" />
          </div>
        </div>

        <div className="relative">
          <textarea
            ref={textareaRef}
            rows={5}
            placeholder="Type or paste LaTeX equation, e.g. \int_{a}^{b} f(x) dx..."
            value={latexInput}
            onChange={(e) => setLatexInput(e.target.value)}
            className="tool-input font-mono text-sm leading-relaxed border-2 focus:border-blue-500 dark:focus:border-cyan-500"
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Display & Styling Controls Bar                                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-[#111a27] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#223247] text-xs">
        {/* Display Mode Toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={displayMode}
              onChange={(e) => setDisplayMode(e.target.checked)}
              className="rounded accent-blue-600 dark:accent-cyan-400 w-3.5 h-3.5 cursor-pointer"
            />
            Display Mode (Block / Centered)
          </label>
        </div>

        {/* Font Size Selector */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600 dark:text-slate-400">Scale:</span>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="bg-white dark:bg-[#182333] border border-slate-300 dark:border-[#2a3c53] rounded px-2 py-1 font-medium text-slate-800 dark:text-white outline-none cursor-pointer"
          >
            <option value="text-base">100% (Normal)</option>
            <option value="text-xl">125% (Medium)</option>
            <option value="text-2xl">150% (Large)</option>
            <option value="text-3xl">200% (X-Large)</option>
            <option value="text-4xl">250% (2X-Large)</option>
          </select>
        </div>

        {/* Theme Selector */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600 dark:text-slate-400">Background:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setColorTheme("dark")}
              className={`w-6 h-6 rounded-md bg-[#090e16] border ${colorTheme === "dark" ? "border-cyan-400 ring-2 ring-cyan-400/20" : "border-slate-700"}`}
              title="Dark Theme"
            />
            <button
              onClick={() => setColorTheme("light")}
              className={`w-6 h-6 rounded-md bg-white border ${colorTheme === "light" ? "border-blue-600 ring-2 ring-blue-600/20" : "border-slate-300"}`}
              title="Light Theme"
            />
            <button
              onClick={() => setColorTheme("solarized")}
              className={`w-6 h-6 rounded-md bg-[#002b36] border ${colorTheme === "solarized" ? "border-emerald-400 ring-2 ring-emerald-400/20" : "border-[#073642]"}`}
              title="Solarized Theme"
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Rendered Live Math Preview Window                                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span>Live Rendered Equation</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Real-time Output
            </span>
          </label>

          {/* Action Export Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleDownloadSvg}
              disabled={!renderedHtml}
              className="px-2.5 sm:px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Download crisp Vector SVG (lossless quality for documents & web)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>SVG</span>
            </button>
            <button
              onClick={handleExportPng}
              disabled={isExporting || !renderedHtml}
              className="px-2.5 sm:px-3 py-1 rounded-lg bg-blue-50 dark:bg-cyan-950/60 hover:bg-blue-100 dark:hover:bg-cyan-900/60 text-blue-600 dark:text-cyan-300 text-xs font-bold border border-blue-200 dark:border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>{isExporting ? "Exporting..." : "PNG"}</span>
            </button>
            <button
              onClick={handleDownloadTex}
              className="px-2.5 sm:px-3 py-1 rounded-lg bg-slate-100 dark:bg-[#182333] hover:bg-slate-200 dark:hover:bg-[#202f43] text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-[#26374d] transition-all cursor-pointer"
            >
              .tex
            </button>
          </div>
        </div>

        {/* Success Toast Banner */}
        {exportNotice && (
          <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <span>{exportNotice}</span>
          </div>
        )}

        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-300 rounded-xl text-xs font-semibold flex items-start gap-2 animate-in fade-in">
            <span className="font-bold text-sm">⚠️</span>
            <div>
              <span className="font-bold">Syntax Alert: </span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Visual Math Preview Container */}
        <div
          ref={previewRef}
          className={`min-h-[160px] p-6 sm:p-10 rounded-2xl border flex items-center justify-center overflow-x-auto transition-all ${getThemeContainerClass()}`}
        >
          <div
            className={`select-text text-center ${fontSize}`}
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Rendered HTML / MathML Source Code Box (Useful for Web & Papers)   */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-[#1f2e42]">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Compiled HTML / MathML Markup
          </label>
          <CopyButton text={renderedHtml} label="Copy HTML MathML" />
        </div>
        <textarea
          rows={3}
          readOnly
          value={renderedHtml}
          className="tool-output font-mono text-xs opacity-75"
        />
      </div>
    </div>
  );
}
