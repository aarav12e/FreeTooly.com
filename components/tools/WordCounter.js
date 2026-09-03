"use client";

import { useMemo, useState } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed === "" ? 0 : (trimmed.match(/[.!?]+/g) || []).length;
    const paragraphs = trimmed === "" ? 0 : trimmed.split(/\n+/).filter((p) => p.trim() !== "").length;
    return { words, characters, charactersNoSpaces, sentences, paragraphs };
  }, [text]);

  return (
    <div>
      <textarea
        className="tool-input"
        rows={10}
        placeholder="Start typing or paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 text-center">
        <Stat label="Words" value={stats.words} />
        <Stat label="Characters" value={stats.characters} />
        <Stat label="Chars (no spaces)" value={stats.charactersNoSpaces} />
        <Stat label="Sentences" value={stats.sentences} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-brand-50 rounded-lg py-3">
      <div className="text-xl font-bold text-brand-600">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
