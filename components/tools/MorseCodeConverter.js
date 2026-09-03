"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

const MORSE = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---",
  K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-",
  W: ".--", X: "-..-", Y: "-.--", Z: "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.", ".": ".-.-.-", ",": "--..--", "?": "..--..",
  "'": ".----.", "!": "-.-.--", "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...", ";": "-.-.-.",
  "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-", '"': ".-..-.", "$": "...-..-", "@": ".--.-."
};

const REVERSE_MORSE = Object.fromEntries(Object.entries(MORSE).map(([character, code]) => [code, character]));

function encodeMorse(value) {
  return value
    .toUpperCase()
    .split(/\n/)
    .map((line) => line.split(" ").map((word) => Array.from(word).map((character) => MORSE[character] || "").filter(Boolean).join(" ")).join(" / "))
    .join("\n");
}

function decodeMorse(value) {
  return value
    .split(/\n/)
    .map((line) => line.split("/").map((word) => word.trim().split(/\s+/).filter(Boolean).map((code) => REVERSE_MORSE[code] || "�").join("" )).join(" "))
    .join("\n");
}

export default function MorseCodeConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("text");
  const [error, setError] = useState("");

  const convert = () => {
    setError("");
    if (!input.trim()) {
      setOutput("");
      return;
    }
    if (mode === "text") {
      setOutput(encodeMorse(input));
      return;
    }
    if (/[^.\-\s/\n]/.test(input)) {
      setError("Morse code can only contain dots, dashes, spaces, and slashes.");
      setOutput("");
      return;
    }
    setOutput(decodeMorse(input));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => { setMode("text"); setInput(""); setOutput(""); setError(""); }} className={`rounded-lg px-4 py-2 text-sm font-bold ${mode === "text" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}>
          Text to Morse
        </button>
        <button type="button" onClick={() => { setMode("morse"); setInput(""); setOutput(""); setError(""); }} className={`rounded-lg px-4 py-2 text-sm font-bold ${mode === "morse" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}>
          Morse to Text
        </button>
      </div>
      <textarea
        className="tool-input font-mono"
        rows={6}
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={mode === "text" ? "Type normal text here..." : "Enter Morse code, for example: .... . .-.. .-.. --- / .-- --- .-. .-.. -.."}
      />
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={convert} className="ct-btn-primary">Convert</button>
        <button type="button" onClick={() => { setInput(""); setOutput(""); setError(""); }} className="ct-btn-secondary">Clear</button>
      </div>
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      {output && (
        <div className="space-y-2">
          <textarea className="tool-output font-mono" rows={6} readOnly value={output} />
          <CopyButton text={output} />
        </div>
      )}
      <p className="text-xs text-slate-500">Use spaces between letters and / between words when decoding Morse.</p>
    </div>
  );
}
