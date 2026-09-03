"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

function beautifyCss(css) {
  const compact = css.replace(/\s+/g, " ").trim();
  let output = "";
  let indent = 0;

  for (let i = 0; i < compact.length; i += 1) {
    const char = compact[i];

    if (char === "{") {
      output += " {\n";
      indent += 1;
      output += "  ".repeat(indent);
    } else if (char === "}") {
      output = output.replace(/\s+$/, "");
      indent = Math.max(indent - 1, 0);
      output += "\n" + "  ".repeat(indent) + "}\n" + "  ".repeat(indent);
    } else if (char === ";") {
      output += ";\n" + "  ".repeat(indent);
    } else {
      output += char;
    }
  }

  return output
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function CssBeautifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <div>
      <textarea
        className="tool-input"
        rows={8}
        placeholder="Paste minified or unformatted CSS..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="button"
        className="btn-primary text-sm mt-3"
        onClick={() => setOutput(beautifyCss(input))}
      >
        Beautify CSS
      </button>
      {output && (
        <div className="mt-4">
          <pre className="tool-output whitespace-pre-wrap overflow-auto max-h-96">{output}</pre>
          <div className="mt-2">
            <CopyButton text={output} />
          </div>
        </div>
      )}
    </div>
  );
}
