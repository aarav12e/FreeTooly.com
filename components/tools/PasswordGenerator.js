"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import CopyButton from "@/components/CopyButton";

// Comprehensive character sets
const CHAR_SETS = {
  upper: {
    id: "upper",
    label: "Uppercase Letters",
    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    example: "A-Z",
    ambiguous: "IO",
  },
  lower: {
    id: "lower",
    label: "Lowercase Letters",
    chars: "abcdefghijklmnopqrstuvwxyz",
    example: "a-z",
    ambiguous: "lo",
  },
  numbers: {
    id: "numbers",
    label: "Numbers",
    chars: "0123456789",
    example: "0-9",
    ambiguous: "018",
  },
  symbols: {
    id: "symbols",
    label: "Special Symbols",
    chars: "!@#$%^&*()_+-=[]{}|;:,.<>?/~`",
    example: "!@#$%^&*",
    ambiguous: "|;:,.",
  },
};

const WORD_LIST = [
  "falcon", "galaxy", "quantum", "matrix", "crypto", "shield", "nexus", "vertex",
  "vortex", "cosmic", "cyber", "shadow", "blaze", "aurora", "zenith", "hyper",
  "orbital", "stellar", "beacon", "dynamo", "phantom", "vector", "radiant", "titan",
  "pulse", "cipher", "glacier", "prism", "horizon", "velocity", "eclipse", "timber",
  "thunder", "flame", "spark", "summit", "canyon", "voyage", "solaris", "nebula",
  "circuit", "atomic", "fusion", "plasma", "signal", "binary", "gateway", "anchor",
  "cobalt", "iron", "quartz", "safari", "meteor", "cascade", "mirage", "legend"
];

// Helper: Cryptographically secure random integer in [0, max)
function getSecureRandomInt(max) {
  if (max <= 0) return 0;
  const array = new Uint32Array(1);
  const maxUint = 0xffffffff;
  const limit = maxUint - (maxUint % max);
  let val;
  do {
    window.crypto.getRandomValues(array);
    val = array[0];
  } while (val >= limit);
  return val % max;
}

// Helper: Fisher-Yates shuffle using crypto values
function secureShuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function PasswordGenerator() {
  const [mode, setMode] = useState("custom"); // "custom" | "passphrase" | "pin"
  
  // Custom password states
  const [length, setLength] = useState(18);
  const [options, setOptions] = useState({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
  });
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [batchPasswords, setBatchPasswords] = useState([]);
  const [copiedBatch, setCopiedBatch] = useState(false);

  // Passphrase states
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState("-");
  const [capitalizeWords, setCapitalizeWords] = useState(true);
  const [includeNumberInPassphrase, setIncludeNumberInPassphrase] = useState(true);

  // PIN states
  const [pinLength, setPinLength] = useState(6);

  // Toggle character options
  const toggleOption = (key) => {
    setOptions((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      // Ensure at least one is enabled
      const hasAny = Object.values(updated).some(Boolean);
      return hasAny ? updated : prev;
    });
  };

  // Generate strong random password
  const generateSingleCustom = useCallback(() => {
    let selectedSets = Object.entries(options).filter(([, enabled]) => enabled);
    if (selectedSets.length === 0) return "";

    const activeSetChars = selectedSets.map(([key]) => {
      let chars = CHAR_SETS[key].chars;
      if (excludeAmbiguous) {
        const amb = CHAR_SETS[key].ambiguous;
        chars = chars.split("").filter((c) => !amb.includes(c)).join("");
        if (!chars) chars = CHAR_SETS[key].chars; // fallback
      }
      return chars;
    });

    const fullPool = activeSetChars.join("");
    if (!fullPool) return "";

    const resultChars = [];

    // 1. Guaranteed at least 1 character from each selected set
    for (const chars of activeSetChars) {
      if (chars.length > 0 && resultChars.length < length) {
        const randIndex = getSecureRandomInt(chars.length);
        resultChars.push(chars[randIndex]);
      }
    }

    // 2. Fill the remaining length from the full pool
    while (resultChars.length < length) {
      const randIndex = getSecureRandomInt(fullPool.length);
      resultChars.push(fullPool[randIndex]);
    }

    // 3. Cryptographically shuffle to prevent predictable positions
    const shuffled = secureShuffle(resultChars);
    return shuffled.join("");
  }, [length, options, excludeAmbiguous]);

  // Generate passphrase
  const generateSinglePassphrase = useCallback(() => {
    const selectedWords = [];
    for (let i = 0; i < wordCount; i++) {
      const idx = getSecureRandomInt(WORD_LIST.length);
      let word = WORD_LIST[idx];
      if (capitalizeWords) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      selectedWords.push(word);
    }
    let res = selectedWords.join(separator);
    if (includeNumberInPassphrase) {
      const randNum = getSecureRandomInt(90) + 10; // 2-digit number
      res += `${separator}${randNum}`;
    }
    return res;
  }, [wordCount, separator, capitalizeWords, includeNumberInPassphrase]);

  // Generate PIN
  const generateSinglePin = useCallback(() => {
    const digits = "0123456789";
    let res = "";
    for (let i = 0; i < pinLength; i++) {
      res += digits[getSecureRandomInt(digits.length)];
    }
    return res;
  }, [pinLength]);

  // Unified generate handler
  const generate = useCallback(() => {
    if (typeof window === "undefined" || !window.crypto) return;

    if (mode === "custom") {
      const main = generateSingleCustom();
      setPassword(main);
      if (quantity > 1) {
        const batch = [main];
        for (let i = 1; i < quantity; i++) {
          batch.push(generateSingleCustom());
        }
        setBatchPasswords(batch);
      } else {
        setBatchPasswords([]);
      }
    } else if (mode === "passphrase") {
      const main = generateSinglePassphrase();
      setPassword(main);
      if (quantity > 1) {
        const batch = [main];
        for (let i = 1; i < quantity; i++) {
          batch.push(generateSinglePassphrase());
        }
        setBatchPasswords(batch);
      } else {
        setBatchPasswords([]);
      }
    } else if (mode === "pin") {
      const main = generateSinglePin();
      setPassword(main);
      if (quantity > 1) {
        const batch = [main];
        for (let i = 1; i < quantity; i++) {
          batch.push(generateSinglePin());
        }
        setBatchPasswords(batch);
      } else {
        setBatchPasswords([]);
      }
    }
  }, [mode, quantity, generateSingleCustom, generateSinglePassphrase, generateSinglePin]);

  // Auto-generate on mount or settings change
  useEffect(() => {
    generate();
  }, [generate]);

  // Calculate Entropy and Strength
  const strengthInfo = useMemo(() => {
    if (!password) {
      return { score: 0, label: "None", color: "bg-slate-200", text: "text-slate-400", time: "0s", entropy: 0 };
    }

    let poolSize = 0;
    if (mode === "custom") {
      if (options.upper) poolSize += 26;
      if (options.lower) poolSize += 26;
      if (options.numbers) poolSize += 10;
      if (options.symbols) poolSize += 30;
      if (excludeAmbiguous) poolSize -= 10;
      if (poolSize <= 0) poolSize = 10;
      const entropy = Math.round(password.length * Math.log2(poolSize));

      if (entropy < 36) {
        return { score: 1, label: "Very Weak", color: "bg-red-500", text: "text-red-600", time: "Seconds", entropy };
      } else if (entropy < 56) {
        return { score: 2, label: "Moderate", color: "bg-amber-500", text: "text-amber-600", time: "A few days", entropy };
      } else if (entropy < 80) {
        return { score: 3, label: "Strong", color: "bg-blue-600", text: "text-blue-600", time: "Several centuries", entropy };
      } else {
        return { score: 4, label: "Ultra Secure", color: "bg-emerald-600", text: "text-emerald-600", time: "Trillions of years", entropy };
      }
    } else if (mode === "passphrase") {
      const entropy = Math.round(wordCount * Math.log2(WORD_LIST.length) + (includeNumberInPassphrase ? Math.log2(100) : 0));
      if (entropy < 45) {
        return { score: 2, label: "Moderate", color: "bg-amber-500", text: "text-amber-600", time: "Months", entropy };
      } else if (entropy < 65) {
        return { score: 3, label: "Strong", color: "bg-blue-600", text: "text-blue-600", time: "Millennia", entropy };
      } else {
        return { score: 4, label: "Ultra Secure", color: "bg-emerald-600", text: "text-emerald-600", time: "Trillions of years", entropy };
      }
    } else {
      const entropy = Math.round(pinLength * Math.log2(10));
      if (pinLength <= 4) {
        return { score: 1, label: "Basic PIN", color: "bg-red-500", text: "text-red-600", time: "Instant", entropy };
      } else if (pinLength <= 6) {
        return { score: 2, label: "Standard PIN", color: "bg-amber-500", text: "text-amber-600", time: "Minutes", entropy };
      } else {
        return { score: 3, label: "Extended PIN", color: "bg-blue-600", text: "text-blue-600", time: "Days", entropy };
      }
    }
  }, [password, mode, options, excludeAmbiguous, wordCount, includeNumberInPassphrase, pinLength]);

  const copyAllBatch = async () => {
    if (!batchPasswords.length) return;
    try {
      await navigator.clipboard.writeText(batchPasswords.join("\n"));
      setCopiedBatch(true);
      setTimeout(() => setCopiedBatch(false), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Mode Selector Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          type="button"
          onClick={() => setMode("custom")}
          className={`flex-1 py-2 px-3 text-xs md:text-sm font-semibold rounded-lg transition-all ${
            mode === "custom"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          🔐 Custom Password
        </button>
        <button
          type="button"
          onClick={() => setMode("passphrase")}
          className={`flex-1 py-2 px-3 text-xs md:text-sm font-semibold rounded-lg transition-all ${
            mode === "passphrase"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          📖 Memorable Passphrase
        </button>
        <button
          type="button"
          onClick={() => setMode("pin")}
          className={`flex-1 py-2 px-3 text-xs md:text-sm font-semibold rounded-lg transition-all ${
            mode === "pin"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          🔢 Numeric PIN
        </button>
      </div>

      {/* Generated Output Card */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-3 md:p-4">
          <div className="overflow-x-auto select-all font-mono text-base md:text-lg font-bold text-slate-900 tracking-wider break-all">
            {password || "Click Generate below"}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Regenerate Button */}
            <button
              type="button"
              onClick={generate}
              title="Generate new password"
              className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 hover:text-blue-600 text-slate-600 transition active:scale-95 shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <CopyButton text={password} className="px-3.5 py-2" />
          </div>
        </div>

        {/* Strength & Entropy Indicator Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Security:</span>
              <span className={`font-bold ${strengthInfo.text}`}>{strengthInfo.label}</span>
              <span className="text-slate-400 font-normal">({strengthInfo.entropy} bits entropy)</span>
            </div>
            <div className="text-slate-500 hidden sm:block">
              Crack time: <span className="font-medium text-slate-700">{strengthInfo.time}</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1.5 h-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-full rounded-full transition-all duration-300 ${
                  step <= strengthInfo.score ? strengthInfo.color : "bg-slate-100"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Configuration Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
        {mode === "custom" && (
          <>
            {/* Length Control */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-800">Password Length</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                    {length} chars
                  </span>
                  <input
                    type="number"
                    min={4}
                    max={128}
                    value={length}
                    onChange={(e) => setLength(Math.max(4, Math.min(128, Number(e.target.value) || 4)))}
                    className="w-16 text-center text-sm font-semibold border border-slate-200 rounded-lg py-1 px-1.5 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={6}
                max={64}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-400 font-medium">Presets:</span>
                {[12, 16, 20, 24, 32, 64].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setLength(preset)}
                    className={`text-xs px-2.5 py-1 rounded-md font-semibold transition ${
                      length === preset
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Character Set Checkboxes */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-3">Included Characters</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(CHAR_SETS).map(([key, item]) => {
                  const isChecked = options[key];
                  return (
                    <label
                      key={key}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition select-none ${
                        isChecked
                          ? "border-blue-400 bg-blue-50/50 text-slate-900"
                          : "border-slate-200 bg-slate-50/50 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleOption(key)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <span className="text-sm font-semibold">{item.label}</span>
                      </div>
                      <span className="font-mono text-xs text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200/80">
                        {item.example}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Security Options */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer select-none text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={excludeAmbiguous}
                  onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div>
                  <span className="font-semibold text-slate-900">Exclude Ambiguous Characters</span>
                  <p className="text-xs text-slate-500">Avoids easily confused characters like (l, 1, I, O, 0, o, |)</p>
                </div>
              </label>
            </div>
          </>
        )}

        {mode === "passphrase" && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-800">Number of Words</label>
                <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                  {wordCount} words
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={8}
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Word Separator</label>
                <select
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="-">Hyphen (-)</option>
                  <option value="_">Underscore (_)</option>
                  <option value=".">Period (.)</option>
                  <option value=" ">Space ( )</option>
                  <option value="#">Hash (#)</option>
                </select>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={capitalizeWords}
                    onChange={(e) => setCapitalizeWords(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300"
                  />
                  Capitalize each word
                </label>
                <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNumberInPassphrase}
                    onChange={(e) => setIncludeNumberInPassphrase(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300"
                  />
                  Append random numbers
                </label>
              </div>
            </div>
          </div>
        )}

        {mode === "pin" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-slate-800">PIN Length</label>
              <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                {pinLength} Digits
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={16}
              value={pinLength}
              onChange={(e) => setPinLength(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex gap-2 mt-2">
              {[4, 6, 8, 12].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setPinLength(preset)}
                  className={`text-xs px-3 py-1 rounded-md font-semibold transition ${
                    pinLength === preset
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {preset} digits
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity (Bulk Generation) */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <label className="text-xs font-bold text-slate-600">Generate in Bulk:</label>
          <div className="flex gap-1.5">
            {[1, 5, 10].map((qty) => (
              <button
                key={qty}
                type="button"
                onClick={() => setQuantity(qty)}
                className={`text-xs px-3 py-1 rounded-lg font-bold border transition ${
                  quantity === qty
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {qty === 1 ? "1 Password" : `${qty} Passwords`}
              </button>
            ))}
          </div>
        </div>

        {/* Highlighted Generate Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={generate}
            className="w-full group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 active:scale-[0.99] rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-200 cursor-pointer"
          >
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Generate New Password</span>
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>

      {/* Multiple Passwords Batch List (when quantity > 1) */}
      {quantity > 1 && batchPasswords.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800">Generated {quantity} Passwords</h4>
            <button
              type="button"
              onClick={copyAllBatch}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
            >
              {copiedBatch ? "✓ Copied All" : "Copy All"}
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {batchPasswords.map((pwd, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition font-mono text-sm"
              >
                <span className="truncate mr-2 text-slate-900 font-semibold">{pwd}</span>
                <CopyButton text={pwd} className="px-2.5 py-1 text-xs" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
