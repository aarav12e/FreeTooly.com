"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const TEENS = [
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
const SCALES = ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion"];

function convertNumberToWords(num) {
  if (isNaN(num)) return "Please enter a valid number";
  if (num === 0) return "Zero";

  let isNegative = num < 0;
  num = Math.abs(num);

  function convertGroup(n) {
    let result = "";
    if (n >= 100) {
      result += ONES[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      result += TENS[Math.floor(n / 10)] + (n % 10 !== 0 ? "-" + ONES[n % 10] : "") + " ";
    } else if (n >= 10) {
      result += TEENS[n - 10] + " ";
    } else if (n > 0) {
      result += ONES[n] + " ";
    }
    return result.trim();
  }

  let parts = [];
  let scaleIndex = 0;

  while (num > 0 && scaleIndex < SCALES.length) {
    let chunk = num % 1000;
    if (chunk > 0) {
      let groupStr = convertGroup(chunk);
      if (SCALES[scaleIndex]) {
        groupStr += " " + SCALES[scaleIndex];
      }
      parts.unshift(groupStr);
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return (isNegative ? "Negative " : "") + parts.join(", ");
}

export default function NumbersToWords() {
  const [numInput, setNumInput] = useState("12450");
  const [caseFormat, setCaseFormat] = useState("title");

  const words = convertNumberToWords(parseInt(numInput, 10));
  const formattedWords =
    caseFormat === "lower"
      ? words.toLowerCase()
      : caseFormat === "upper"
      ? words.toUpperCase()
      : words;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Numbers to Words Converter</h2>
        <p className="text-sm text-slate-500 mb-6">
          Convert numeric values and currency amounts into spelled-out English words.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Enter Number</label>
            <input
              type="number"
              value={numInput}
              onChange={(e) => setNumInput(e.target.value)}
              placeholder="e.g. 52400"
              className="w-full p-3.5 text-base bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono font-bold"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600">Letter Case:</span>
            <select
              value={caseFormat}
              onChange={(e) => setCaseFormat(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none font-medium"
            >
              <option value="title">Title Case (Twelve Thousand)</option>
              <option value="lower">lowercase (twelve thousand)</option>
              <option value="upper">UPPERCASE (TWELVE THOUSAND)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">Spelled Out in Words</label>
              {formattedWords && <CopyButton text={formattedWords} />}
            </div>
            <div className="p-4 bg-slate-900 text-cyan-300 font-medium text-sm sm:text-base rounded-xl border border-slate-800">
              {formattedWords || "Zero"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
