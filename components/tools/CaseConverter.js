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
  const [selectedTransform, setSelectedTransform] = useState(transforms[0]);

  const convertText = () => {
    setOutput(selectedTransform.fn(text));
  };

  const selectTransform = (transform) => {
    setSelectedTransform(transform);
    setOutput(text ? transform.fn(text) : "");
  };

  const clearText = () => {
    setText("");
    setOutput("");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Input text
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Choose a style below, then convert your text.
          </p>
        </div>
        <span className="w-fit rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-300">
          {text.length} characters
        </span>
      </div>

      <textarea
        className="tool-input min-h-[180px] resize-y text-base leading-7"
        rows={7}
        placeholder="Enter text to convert..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-700/70 dark:bg-slate-900/40">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Conversion style</p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Selected: {selectedTransform.label}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {transforms.map((t) => (
          <button
            key={t.label}
            type="button"
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              selectedTransform.label === t.label
                ? "border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-600/20 dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950"
                : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-cyan-700 dark:hover:bg-slate-800"
            }`}
            onClick={() => selectTransform(t)}
          >
            {t.label}
          </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto"
          onClick={clearText}
          disabled={!text && !output}
        >
          Clear
        </button>
        <button
          type="button"
          className="w-full rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:bg-cyan-400 dark:text-slate-950 dark:shadow-cyan-400/15 dark:hover:bg-cyan-300 sm:w-auto"
          onClick={convertText}
          disabled={!text.trim()}
        >
          Convert to {selectedTransform.label}
        </button>
      </div>

      {output !== "" && (
        <div className="border-t border-slate-200 pt-5 dark:border-slate-700">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                Converted result
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Ready to copy and use.</p>
            </div>
            <CopyButton text={output} />
          </div>
          <textarea className="tool-output min-h-[180px] resize-y text-base leading-7" rows={7} readOnly value={output} />
        </div>
      )}
    </div>
  );
}
