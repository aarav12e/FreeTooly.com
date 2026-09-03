"use client";

import { useState, useMemo, useRef } from "react";
import { downloadFile } from "@/lib/file-utils";
import CopyButton from "@/components/CopyButton";

// ─── Language definitions with simple but accurate tokenizers ────────────────
const LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "jsx",        label: "JSX / TSX" },
  { id: "python",     label: "Python" },
  { id: "html",       label: "HTML / XML" },
  { id: "css",        label: "CSS / SCSS" },
  { id: "json",       label: "JSON" },
  { id: "sql",        label: "SQL" },
  { id: "bash",       label: "Bash / Shell" },
  { id: "java",       label: "Java" },
  { id: "csharp",     label: "C#" },
  { id: "cpp",        label: "C / C++" },
  { id: "go",         label: "Go" },
  { id: "rust",       label: "Rust" },
  { id: "php",        label: "PHP" },
  { id: "ruby",       label: "Ruby" },
];

// ─── Syntax themes ────────────────────────────────────────────────────────────
const THEMES = {
  "vs-dark": {
    name: "VS Dark",
    bg: "#1e1e1e",
    text: "#d4d4d4",
    lineNumBg: "#252526",
    lineNumColor: "#858585",
    border: "#3c3c3c",
    tokens: {
      keyword:    "#569cd6",
      string:     "#ce9178",
      comment:    "#6a9955",
      number:     "#b5cea8",
      function:   "#dcdcaa",
      type:       "#4ec9b0",
      operator:   "#d4d4d4",
      punctuation:"#d4d4d4",
      attribute:  "#9cdcfe",
      tag:        "#569cd6",
      builtin:    "#4fc1ff",
      property:   "#9cdcfe",
      boolean:    "#569cd6",
      regex:      "#d16969",
      variable:   "#9cdcfe",
    },
  },
  "github-light": {
    name: "GitHub Light",
    bg: "#ffffff",
    text: "#24292f",
    lineNumBg: "#f6f8fa",
    lineNumColor: "#6e7781",
    border: "#d0d7de",
    tokens: {
      keyword:    "#cf222e",
      string:     "#0a3069",
      comment:    "#6e7781",
      number:     "#0550ae",
      function:   "#8250df",
      type:       "#953800",
      operator:   "#24292f",
      punctuation:"#24292f",
      attribute:  "#0550ae",
      tag:        "#116329",
      builtin:    "#0550ae",
      property:   "#0550ae",
      boolean:    "#0550ae",
      regex:      "#0a3069",
      variable:   "#953800",
    },
  },
  "dracula": {
    name: "Dracula",
    bg: "#282a36",
    text: "#f8f8f2",
    lineNumBg: "#21222c",
    lineNumColor: "#6272a4",
    border: "#44475a",
    tokens: {
      keyword:    "#ff79c6",
      string:     "#f1fa8c",
      comment:    "#6272a4",
      number:     "#bd93f9",
      function:   "#50fa7b",
      type:       "#8be9fd",
      operator:   "#ff79c6",
      punctuation:"#f8f8f2",
      attribute:  "#50fa7b",
      tag:        "#ff79c6",
      builtin:    "#8be9fd",
      property:   "#66d9e8",
      boolean:    "#bd93f9",
      regex:      "#f1fa8c",
      variable:   "#f8f8f2",
    },
  },
  "monokai": {
    name: "Monokai Pro",
    bg: "#2d2a2e",
    text: "#fcfcfa",
    lineNumBg: "#221f22",
    lineNumColor: "#727072",
    border: "#3a3a3c",
    tokens: {
      keyword:    "#ff6188",
      string:     "#ffd866",
      comment:    "#727072",
      number:     "#ab9df2",
      function:   "#a9dc76",
      type:       "#78dce8",
      operator:   "#ff6188",
      punctuation:"#fcfcfa",
      attribute:  "#ffb347",
      tag:        "#ff6188",
      builtin:    "#78dce8",
      property:   "#78dce8",
      boolean:    "#ab9df2",
      regex:      "#ffd866",
      variable:   "#fcfcfa",
    },
  },
  "nord": {
    name: "Nord",
    bg: "#2e3440",
    text: "#d8dee9",
    lineNumBg: "#272c36",
    lineNumColor: "#4c566a",
    border: "#3b4252",
    tokens: {
      keyword:    "#81a1c1",
      string:     "#a3be8c",
      comment:    "#4c566a",
      number:     "#b48ead",
      function:   "#88c0d0",
      type:       "#8fbcbb",
      operator:   "#81a1c1",
      punctuation:"#eceff4",
      attribute:  "#8fbcbb",
      tag:        "#81a1c1",
      builtin:    "#88c0d0",
      property:   "#d8dee9",
      boolean:    "#81a1c1",
      regex:      "#ebcb8b",
      variable:   "#d8dee9",
    },
  },
  "solarized-dark": {
    name: "Solarized Dark",
    bg: "#002b36",
    text: "#839496",
    lineNumBg: "#073642",
    lineNumColor: "#586e75",
    border: "#073642",
    tokens: {
      keyword:    "#859900",
      string:     "#2aa198",
      comment:    "#586e75",
      number:     "#d33682",
      function:   "#268bd2",
      type:       "#b58900",
      operator:   "#859900",
      punctuation:"#839496",
      attribute:  "#268bd2",
      tag:        "#859900",
      builtin:    "#6c71c4",
      property:   "#839496",
      boolean:    "#cb4b16",
      regex:      "#2aa198",
      variable:   "#839496",
    },
  },
};

// ─── Core tokenizer: regex-based multi-language highlighter ──────────────────
function tokenize(code, lang) {
  // Token types per language
  const patterns = getPatterns(lang);

  // Build a combined regex from all patterns
  const combined = new RegExp(
    patterns.map((p) => `(?<${p.name}>${p.regex.source})`).join("|"),
    "gm"
  );

  const tokens = [];
  let lastIndex = 0;

  for (const match of code.matchAll(combined)) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: code.slice(lastIndex, match.index) });
    }
    const type = Object.keys(match.groups).find((k) => match.groups[k] !== undefined);
    tokens.push({ type, value: match[0] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < code.length) {
    tokens.push({ type: "text", value: code.slice(lastIndex) });
  }

  return tokens;
}

function getPatterns(lang) {
  const number = { name: "number", regex: /\b0x[\da-fA-F]+\b|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/ };

  if (lang === "python") {
    return [
      { name: "comment", regex: /#[^\n]*/ },
      { name: "string",  regex: /"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/ },
      { name: "keyword", regex: /\b(?:False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/ },
      { name: "builtin", regex: /\b(?:abs|all|any|bin|bool|bytes|callable|chr|dict|dir|divmod|enumerate|eval|exec|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|isinstance|issubclass|iter|len|list|locals|map|max|min|next|object|oct|open|ord|pow|print|property|range|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|vars|zip)\b/ },
      { name: "function", regex: /\b([a-zA-Z_]\w*)\s*(?=\()/ },
      number,
      { name: "decorator", regex: /@[a-zA-Z_]\w*/ },
    ];
  }

  if (lang === "html") {
    return [
      { name: "comment",   regex: /<!--[\s\S]*?-->/ },
      { name: "tag",       regex: /<\/?[a-zA-Z][a-zA-Z0-9]*/ },
      { name: "attribute", regex: /\b[a-zA-Z-]+(?=\s*=)/ },
      { name: "string",    regex: /"[^"]*"|'[^']*'/ },
      { name: "punctuation", regex: /[<>\/]|=/ },
    ];
  }

  if (lang === "css") {
    return [
      { name: "comment",   regex: /\/\*[\s\S]*?\*\// },
      { name: "string",   regex: /"[^"]*"|'[^']*'/ },
      { name: "property", regex: /[\w-]+\s*(?=:)/ },
      { name: "number",   regex: /-?\d+(?:\.\d+)?(?:%|px|em|rem|vh|vw|vmin|vmax|pt|pc|cm|mm|in|ex|ch|fr|deg|rad|turn|s|ms)?\b/ },
      { name: "keyword",  regex: /\b(?:important|inherit|initial|unset|auto|none|normal|bold|italic|solid|dashed|dotted|transparent|absolute|relative|fixed|sticky|flex|grid|block|inline|inline-block|table|hidden|visible|scroll|overflow|center|left|right|top|bottom)\b/ },
      { name: "type",     regex: /\b[A-Z][\w-]*/ },
      { name: "function", regex: /[\w-]+\s*(?=\()/ },
      { name: "attribute", regex: /\.[a-zA-Z][\w-]*|#[a-zA-Z][\w-]*/ },
      { name: "punctuation", regex: /[{}:;,]/ },
    ];
  }

  if (lang === "json") {
    return [
      { name: "property", regex: /"(?:[^"\\]|\\.)*"\s*(?=:)/ },
      { name: "string",   regex: /"(?:[^"\\]|\\.)*"/ },
      { name: "number",   regex: /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/ },
      { name: "keyword",  regex: /\b(?:true|false|null)\b/ },
      { name: "punctuation", regex: /[{}[\]:,]/ },
    ];
  }

  if (lang === "sql") {
    return [
      { name: "comment",  regex: /--[^\n]*|\/\*[\s\S]*?\*\// },
      { name: "string",   regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/ },
      { name: "keyword",  regex: /\b(?:SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DATABASE|DROP|ALTER|ADD|COLUMN|INDEX|PRIMARY|KEY|FOREIGN|REFERENCES|NOT|NULL|UNIQUE|DEFAULT|AUTO_INCREMENT|IF|EXISTS|DISTINCT|AS|AND|OR|IN|LIKE|BETWEEN|IS|COUNT|SUM|AVG|MAX|MIN|UNION|ALL|CASE|WHEN|THEN|ELSE|END)\b/i },
      number,
    ];
  }

  if (lang === "bash") {
    return [
      { name: "comment",  regex: /#[^\n]*/ },
      { name: "string",   regex: /"(?:[^"\\]|\\.)*"|'[^']*'/ },
      { name: "keyword",  regex: /\b(?:if|then|else|elif|fi|for|while|until|do|done|case|esac|function|return|export|local|readonly|declare|unset|source|alias|echo|printf|read|exit|break|continue|shift|set|unshift|test)\b/ },
      { name: "variable", regex: /\$\{?[a-zA-Z_][a-zA-Z0-9_]*\}?|\$\d/ },
      { name: "builtin",  regex: /\b(?:cd|ls|grep|sed|awk|cat|cp|mv|rm|mkdir|chmod|chown|find|xargs|sort|uniq|head|tail|curl|wget|git|npm|yarn|docker|kubectl)\b/ },
      number,
    ];
  }

  // Java, C#, C++, Go, Rust, PHP, Ruby — share JS-like tokenizer with custom keywords
  const kwMap = {
    java:    /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while|var|record|sealed|permits)\b/,
    csharp:  /\b(?:abstract|as|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|do|double|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|goto|if|implicit|in|int|interface|internal|is|lock|long|namespace|new|null|object|operator|out|override|params|private|protected|public|readonly|ref|return|sbyte|sealed|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|var|virtual|void|volatile|while|async|await|dynamic|record|init|with)\b/,
    cpp:     /\b(?:auto|break|case|catch|char|class|const|constexpr|continue|decltype|default|delete|do|double|else|enum|explicit|extern|false|final|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|nullptr|operator|override|private|protected|public|register|return|short|signed|sizeof|static|static_cast|struct|switch|template|this|throw|true|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|while)\b/,
    go:      /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go|goto|if|import|interface|map|package|range|return|select|struct|switch|type|var|true|false|nil|iota|append|cap|close|complex|copy|delete|imag|len|make|new|panic|print|println|real|recover)\b/,
    rust:    /\b(?:as|async|await|break|const|continue|crate|dyn|else|enum|extern|false|fn|for|if|impl|in|let|loop|match|mod|move|mut|pub|ref|return|self|Self|static|struct|super|trait|true|type|union|unsafe|use|where|while|i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|str|String|Vec|Option|Result|Some|None|Ok|Err)\b/,
    php:     /\b(?:abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|new|null|or|print|private|protected|public|readonly|require|require_once|return|static|switch|throw|trait|true|try|unset|use|var|while|xor|yield)\b/,
    ruby:    /\b(?:BEGIN|END|__ENCODING__|__END__|__FILE__|__LINE__|alias|and|begin|break|case|class|def|defined?|do|else|elsif|end|ensure|false|for|if|in|module|next|nil|not|or|redo|rescue|retry|return|self|super|then|true|undef|unless|until|when|while|yield)\b/,
  };

  const jsKeywords = /\b(?:abstract|arguments|await|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|eval|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|let|long|native|new|null|of|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|undefined|var|void|volatile|while|with|yield|async|from|as|type|interface|declare|readonly|namespace|module|keyof|infer|never|unknown|any)\b/;

  const kw = kwMap[lang] || jsKeywords;

  return [
    { name: "comment", regex: /\/\*[\s\S]*?\*\/|\/\/[^\n]*/ },
    { name: "string", regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/ },
    { name: "regex",   regex: /\/(?:[^/\\\n]|\\.)+\/[gimsuy]*/ },
    { name: "keyword", regex: kw },
    { name: "type",    regex: /\b[A-Z][A-Za-z0-9]*\b/ },
    { name: "function",regex: /\b([a-zA-Z_$][\w$]*)\s*(?=\()/ },
    number,
    { name: "boolean", regex: /\b(?:true|false|null|undefined|NaN|Infinity)\b/ },
    { name: "operator",regex: /[=!<>+\-*/%&|^~?]+/ },
    { name: "punctuation", regex: /[{}()[\];,.]/ },
    { name: "property",regex: /(?<=\.)[a-zA-Z_$][\w$]*/ },
    { name: "variable",regex: /\b[a-zA-Z_$][\w$]*\b/ },
  ];
}

// ─── Escape HTML for safe embedding ──────────────────────────────────────────
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ─── Build HTML output ────────────────────────────────────────────────────────
function buildHtml(code, lang, theme, showLineNumbers, wrapLines, fontSize, fontFamily) {
  const t = THEMES[theme];
  const tokens = tokenize(code, lang);
  const lines = [];
  let currentLine = [];

  const flushLine = () => { lines.push(currentLine); currentLine = []; };

  for (const tok of tokens) {
    const parts = tok.value.split("\n");
    for (let i = 0; i < parts.length; i++) {
      if (parts[i]) {
        currentLine.push({ type: tok.type, value: parts[i] });
      }
      if (i < parts.length - 1) flushLine();
    }
  }
  flushLine();

  const tokenColor = (type) => t.tokens[type] || t.text;

  const renderTokens = (lineTokens) =>
    lineTokens.map((tok) => {
      const color = tokenColor(tok.type);
      const escaped = escapeHtml(tok.value);
      if (tok.type === "text" || color === t.text) return escaped;
      return `<span style="color:${color}">${escaped}</span>`;
    }).join("");

  const paddingNum = showLineNumbers ? `${String(lines.length).length * 8 + 24}` : "24";

  const lineNumWidth = showLineNumbers ? `${String(lines.length).length + 2}ch` : "0";
  const lineNumStyle = showLineNumbers
    ? `display:inline-block;width:${lineNumWidth};text-align:right;margin-right:16px;color:${t.lineNumColor};user-select:none;background:${t.lineNumBg};padding:0 8px 0 0;border-right:1px solid ${t.border};`
    : "";

  const codeLines = lines.map((lineTokens, i) => {
    const lineNum = showLineNumbers
      ? `<span style="${lineNumStyle}">${i + 1}</span>`
      : "";
    return `<div style="white-space:${wrapLines ? "pre-wrap" : "pre"};min-height:1.5em;">${lineNum}${renderTokens(lineTokens)}</div>`;
  }).join("\n");

  return `<pre style="margin:0;padding:16px ${showLineNumbers ? "16px 16px 0" : "24px"};background:${t.bg};color:${t.text};font-family:${fontFamily};font-size:${fontSize}px;line-height:1.6;border-radius:8px;overflow:auto;border:1px solid ${t.border};">\n<code>${codeLines}\n</code></pre>`;
}

// ─── Sample snippets ──────────────────────────────────────────────────────────
const SAMPLES = {
  javascript: `// Fibonacci with memoization
function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

const result = fibonacci(10);
console.log(\`Fibonacci(10) = \${result}\`); // 55`,

  python: `# Decorator example
from functools import wraps

def timer(func):
    """Measure execution time."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        import time
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def compute(n: int) -> int:
    return sum(range(n))`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hello World</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header class="hero">
    <h1>Welcome to My Site</h1>
    <p>Built with <strong>HTML5</strong> &amp; CSS3</p>
    <a href="#start" class="btn btn-primary">Get Started</a>
  </header>
</body>
</html>`,

  css: `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}`,

  json: `{
  "name": "my-app",
  "version": "2.1.0",
  "description": "A modern Next.js application",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "license": "MIT"
}`,
};

const FONT_FAMILIES = [
  { id: "'Fira Code', 'Cascadia Code', monospace", label: "Fira Code" },
  { id: "'JetBrains Mono', monospace",             label: "JetBrains Mono" },
  { id: "'Source Code Pro', monospace",            label: "Source Code Pro" },
  { id: "'Courier New', monospace",                label: "Courier New" },
  { id: "monospace",                               label: "System Mono" },
];

export default function SourceCodeHighlighter() {
  const [code, setCode] = useState(SAMPLES["javascript"]);
  const [lang, setLang] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [wrapLines, setWrapLines] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0].id);
  const [outputMode, setOutputMode] = useState("preview"); // preview | html
  const [toastNotice, setToastNotice] = useState("");
  const previewRef = useRef(null);

  const showToast = (msg) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(""), 3000);
  };

  const highlightedHtml = useMemo(() =>
    buildHtml(code, lang, theme, showLineNumbers, wrapLines, fontSize, fontFamily),
    [code, lang, theme, showLineNumbers, wrapLines, fontSize, fontFamily]
  );

  const handleLangChange = (newLang) => {
    setLang(newLang);
    if (SAMPLES[newLang] && !Object.values(SAMPLES).includes(code)) return;
    if (SAMPLES[newLang]) setCode(SAMPLES[newLang]);
  };

  const handleDownloadHtml = () => {
    const full = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Code Snippet</title>\n</head>\n<body style="background:#1a1a2e;padding:32px;display:flex;justify-content:center;">\n${highlightedHtml}\n</body>\n</html>`;
    downloadFile(full, `snippet-${lang}.html`, "text/html");
    showToast("✓ HTML file downloaded");
  };

  const currentTheme = THEMES[theme];

  return (
    <div className="space-y-5">

      {/* ── Hero Banner ────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #0d1117 0%, #161b22 60%, #0c1a2e 100%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-xl flex-shrink-0">
            🖊️
          </div>
          <div>
            <div className="font-extrabold text-white text-sm tracking-wide">Source Code Highlighter</div>
            <div className="text-[11px] text-violet-300/70 font-medium mt-0.5">
              {LANGUAGES.length} languages • {Object.keys(THEMES).length} themes • Blog &amp; Email ready
            </div>
          </div>
        </div>

        {/* Theme Quick Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(THEMES).map(([key, t]) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              title={t.name}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all border ${
                theme === key
                  ? "border-violet-400 text-violet-300"
                  : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"
              }`}
              style={{ background: t.bg }}
            >
              <span style={{ color: t.tokens.keyword }}>{t.name}</span>
            </button>
          ))}
        </div>
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-violet-500/10 pointer-events-none" />
      </div>

      {/* ── Main Studio Layout ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* ─── Left: Input Panel ─────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Language Selector + Controls */}
          <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm space-y-4">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              1. Language &amp; Configuration
            </div>

            {/* Language grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleLangChange(l.id)}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-bold text-center truncate cursor-pointer border transition-all ${
                    lang === l.id
                      ? "bg-violet-600 border-violet-600 text-white shadow-sm"
                      : "bg-slate-50 dark:bg-[#182333] border-slate-200 dark:border-[#2a3c53] text-slate-600 dark:text-slate-300 hover:border-violet-400 dark:hover:border-violet-600"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Options row */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-400">
                <input type="checkbox" checked={showLineNumbers} onChange={(e) => setShowLineNumbers(e.target.checked)}
                  className="w-4 h-4 rounded accent-violet-600" />
                Line Numbers
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-400">
                <input type="checkbox" checked={wrapLines} onChange={(e) => setWrapLines(e.target.checked)}
                  className="w-4 h-4 rounded accent-violet-600" />
                Word Wrap
              </label>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>Font Size:</span>
                <div className="flex gap-1">
                  {[12, 13, 14, 15, 16].map((s) => (
                    <button key={s} onClick={() => setFontSize(s)}
                      className={`w-7 h-6 rounded text-[11px] font-bold cursor-pointer transition-all ${
                        fontSize === s ? "bg-violet-600 text-white" : "bg-slate-100 dark:bg-[#182333] text-slate-600 dark:text-slate-400"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Font Family */}
            <div className="flex items-center gap-2 flex-wrap text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>Font:</span>
              {FONT_FAMILIES.map((f) => (
                <button key={f.id} onClick={() => setFontFamily(f.id)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                    fontFamily === f.id ? "bg-violet-600 text-white" : "bg-slate-100 dark:bg-[#182333] text-slate-500 dark:text-slate-400 hover:bg-slate-200"
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Code Input Editor */}
          <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-[#223247] bg-slate-50 dark:bg-[#111a27]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 ml-1">
                  {LANGUAGES.find((l) => l.id === lang)?.label || lang} Editor
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setCode(""); showToast("✓ Editor cleared"); }}
                  className="text-[11px] font-semibold text-slate-400 hover:text-rose-500 cursor-pointer transition-colors"
                >
                  Clear
                </button>
                {SAMPLES[lang] && (
                  <button
                    onClick={() => setCode(SAMPLES[lang])}
                    className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
                  >
                    Load Sample
                  </button>
                )}
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              placeholder={`Paste your ${lang} code here…`}
              rows={20}
              className="w-full p-4 bg-transparent font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-200 resize-none outline-none placeholder-slate-400"
              style={{ fontFamily, fontSize: `${fontSize}px`, tabSize: 2 }}
            />
            <div className="flex items-center justify-between px-4 py-2 border-t border-slate-100 dark:border-[#1a2740] text-[10px] text-slate-400 font-mono">
              <span>{code.split("\n").length} lines</span>
              <span>{code.length} chars</span>
            </div>
          </div>
        </div>

        {/* ─── Right: Output Panel ───────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Output mode tabs + actions */}
          <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                2. Output
              </div>
              <div className="flex gap-1 bg-slate-100 dark:bg-[#111a27] rounded-lg p-0.5">
                <button onClick={() => setOutputMode("preview")}
                  className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-all ${
                    outputMode === "preview"
                      ? "bg-white dark:bg-[#182333] text-violet-600 dark:text-violet-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}>
                  👁 Preview
                </button>
                <button onClick={() => setOutputMode("html")}
                  className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-all ${
                    outputMode === "html"
                      ? "bg-white dark:bg-[#182333] text-violet-600 dark:text-violet-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}>
                  &lt;/&gt; HTML
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <CopyButton text={highlightedHtml} label="Copy HTML" className="text-xs" />
              <button
                onClick={handleDownloadHtml}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download .html
              </button>
              <button
                onClick={() => { downloadFile(code, `snippet.${lang === "javascript" ? "js" : lang === "python" ? "py" : lang === "typescript" ? "ts" : lang}`, "text/plain"); showToast("✓ Raw code downloaded"); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-[#1f2f44] hover:bg-slate-900 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                Download Raw
              </button>
            </div>

            {/* Toast */}
            {toastNotice && (
              <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold">
                {toastNotice}
              </div>
            )}
          </div>

          {/* Live Preview or HTML Source */}
          {outputMode === "preview" ? (
            <div
              ref={previewRef}
              className="rounded-2xl border border-slate-200 dark:border-[#223247] overflow-auto shadow-inner min-h-[420px]"
              style={{ background: currentTheme.bg }}
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-[#223247] overflow-hidden shadow-inner min-h-[420px] flex flex-col">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-[#223247] bg-slate-50 dark:bg-[#111a27]">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Generated HTML</span>
                <span className="text-[10px] text-slate-400 font-mono">{highlightedHtml.length} chars</span>
              </div>
              <textarea
                readOnly
                value={highlightedHtml}
                rows={22}
                className="flex-1 p-4 bg-white dark:bg-[#0d1625] font-mono text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 resize-none outline-none"
              />
            </div>
          )}

          {/* Usage Tips */}
          <div className="bg-slate-50 dark:bg-[#111a27] rounded-xl border border-slate-200 dark:border-[#223247] p-4 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">💡 How to use</div>
            <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
              <li>→ Paste code in the editor, choose language + theme</li>
              <li>→ Switch to <strong className="text-slate-700 dark:text-slate-300">HTML tab</strong> to copy the highlighted markup</li>
              <li>→ Paste HTML directly into blog posts, Notion, or email templates</li>
              <li>→ Download <code className="text-violet-600 dark:text-violet-400">.html</code> for a standalone shareable snippet page</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
