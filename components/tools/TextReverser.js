"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function TextReverser() {
  const [text, setText] = useState("");
  const [reversed, setReversed] = useState("");

  const reverseText = () => {
    setReversed(text.split("").reverse().join(""));
  };

  const clearText = () => {
    setText("");
    setReversed("");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Input text
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Reverse every character while preserving spaces and line breaks.
          </p>
        </div>
        <span className="w-fit rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-300">
          {text.length} characters
        </span>
      </div>

      <textarea
        className="tool-input min-h-[180px] resize-y text-base leading-7"
        rows={7}
        placeholder="Type text to reverse..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto"
          onClick={clearText}
          disabled={!text && !reversed}
        >
          Clear
        </button>
        <button
          type="button"
          className="w-full rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:bg-cyan-400 dark:text-slate-950 dark:shadow-cyan-400/15 dark:hover:bg-cyan-300 sm:w-auto"
          onClick={reverseText}
          disabled={!text}
        >
          Reverse Text
        </button>
      </div>

      <div className="border-t border-slate-200 pt-5 dark:border-slate-700">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
              Reversed result
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your reversed text will appear here.</p>
          </div>
          <CopyButton text={reversed} />
        </div>
        <textarea
          className="tool-output min-h-[180px] resize-y text-base leading-7"
          rows={7}
          readOnly
          value={reversed}
          placeholder="Your reversed text will appear here..."
        />
      </div>
    </div>
  );
}
