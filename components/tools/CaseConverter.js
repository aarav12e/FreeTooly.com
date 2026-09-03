"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

function toTitleCase(str) {
  return str.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.substring(1).toLowerCase());
}

function toSentenceCase(str) {
  return str
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
}

function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
}

function toSnakeCase(str) {
  return str
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .toLowerCase();
}

function toKebabCase(str) {
  return toSnakeCase(str).replace(/_/g, "-");
}

const transforms = [
  { label: "UPPER CASE", fn: (s) => s.toUpperCase() },
  { label: "lower case", fn: (s) => s.toLowerCase() },
  { label: "Title Case", fn: toTitleCase },
  { label: "Sentence case", fn: toSentenceCase },
  { label: "camelCase", fn: toCamelCase },
  { label: "snake_case", fn: toSnakeCase },
  { label: "kebab-case", fn: toKebabCase },
];

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");

  return (
    <div>
      <textarea
        className="tool-input"
        rows={6}
        placeholder="Enter text to convert..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex flex-wrap gap-2 mt-3">
        {transforms.map((t) => (
          <button
            key={t.label}
            type="button"
            className="btn-secondary text-sm"
            onClick={() => setOutput(t.fn(text))}
          >
            {t.label}
          </button>
        ))}
      </div>
      {output !== "" && (
        <div className="mt-4">
          <textarea className="tool-output" rows={6} readOnly value={output} />
          <div className="mt-2">
            <CopyButton text={output} />
          </div>
        </div>
      )}
    </div>
  );
}
