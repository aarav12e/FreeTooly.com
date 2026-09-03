"use client";

import { useState, useMemo } from "react";
import CopyButton from "@/components/CopyButton";

// ─── 3GPP TS 38.104 Global Frequency Raster Definition ────────────────────────
// Range 1: 0 - 3000 MHz (ΔF_Global = 5 kHz)
// Range 2: 3000 - 24250 MHz (ΔF_Global = 15 kHz)
// Range 3: 24250 - 100000 MHz (ΔF_Global = 60 kHz)

const RASTER_RANGES = [
  {
    range: 1,
    name: "0 - 3000 MHz (FR1 Low/Mid)",
    fMin: 0,
    fMax: 3000,
    fRefOffs: 0,
    deltaF: 0.005, // 5 kHz in MHz
    deltaFKhz: 5,
    nRefOffs: 0,
    nRefMin: 0,
    nRefMax: 599999,
  },
  {
    range: 2,
    name: "3000 - 24250 MHz (FR1 High / C-Band)",
    fMin: 3000,
    fMax: 24250,
    fRefOffs: 3000,
    deltaF: 0.015, // 15 kHz in MHz
    deltaFKhz: 15,
    nRefOffs: 600000,
    nRefMin: 600000,
    nRefMax: 2016666,
  },
  {
    range: 3,
    name: "24250 - 100000 MHz (FR2 mmWave)",
    fMin: 24250.08,
    fMax: 100000,
    fRefOffs: 24250.08,
    deltaF: 0.06, // 60 kHz in MHz
    deltaFKhz: 60,
    nRefOffs: 2016667,
    nRefMin: 2016667,
    nRefMax: 3279165,
  },
];

// ─── 5G NR Bands Database (3GPP TS 38.101-1 & TS 38.101-2) ──────────────────
const NR_BANDS_DB = [
  // FR1 Bands
  { band: "n1", name: "2100 MHz", fr: "FR1", mode: "FDD", ulMin: 1920, ulMax: 1980, dlMin: 2110, dlMax: 2170, ulArfcnMin: 384000, ulArfcnMax: 396000, dlArfcnMin: 422000, dlArfcnMax: 434000 },
  { band: "n2", name: "1900 MHz PCS", fr: "FR1", mode: "FDD", ulMin: 1850, ulMax: 1910, dlMin: 1930, dlMax: 1990, ulArfcnMin: 370000, ulArfcnMax: 382000, dlArfcnMin: 386000, dlArfcnMax: 398000 },
  { band: "n3", name: "1800 MHz DCS", fr: "FR1", mode: "FDD", ulMin: 1710, ulMax: 1785, dlMin: 1805, dlMax: 1880, ulArfcnMin: 342000, ulArfcnMax: 357000, dlArfcnMin: 361000, dlArfcnMax: 376000 },
  { band: "n5", name: "850 MHz Cellular", fr: "FR1", mode: "FDD", ulMin: 824, ulMax: 849, dlMin: 869, dlMax: 894, ulArfcnMin: 164800, ulArfcnMax: 169800, dlArfcnMin: 173800, dlArfcnMax: 178800 },
  { band: "n7", name: "2600 MHz IMT-E", fr: "FR1", mode: "FDD", ulMin: 2500, ulMax: 2570, dlMin: 2620, dlMax: 2690, ulArfcnMin: 500000, ulArfcnMax: 514000, dlArfcnMin: 524000, dlArfcnMax: 538000 },
  { band: "n8", name: "900 MHz GSM", fr: "FR1", mode: "FDD", ulMin: 880, ulMax: 915, dlMin: 925, dlMax: 960, ulArfcnMin: 176000, ulArfcnMax: 183000, dlArfcnMin: 185000, dlArfcnMax: 192000 },
  { band: "n12", name: "700 MHz a/b/c", fr: "FR1", mode: "FDD", ulMin: 699, ulMax: 716, dlMin: 729, dlMax: 746, ulArfcnMin: 139800, ulArfcnMax: 143200, dlArfcnMin: 145800, dlArfcnMax: 149200 },
  { band: "n20", name: "800 MHz DD", fr: "FR1", mode: "FDD", ulMin: 832, ulMax: 862, dlMin: 791, dlMax: 821, ulArfcnMin: 166400, ulArfcnMax: 172400, dlArfcnMin: 158200, dlArfcnMax: 164200 },
  { band: "n25", name: "1900 MHz Extended", fr: "FR1", mode: "FDD", ulMin: 1850, ulMax: 1915, dlMin: 1930, dlMax: 1995, ulArfcnMin: 370000, ulArfcnMax: 383000, dlArfcnMin: 386000, dlArfcnMax: 399000 },
  { band: "n28", name: "700 MHz APT", fr: "FR1", mode: "FDD", ulMin: 703, ulMax: 748, dlMin: 758, dlMax: 803, ulArfcnMin: 140600, ulArfcnMax: 149600, dlArfcnMin: 151600, dlArfcnMax: 160600 },
  { band: "n38", name: "2600 MHz TDD", fr: "FR1", mode: "TDD", ulMin: 2570, ulMax: 2620, dlMin: 2570, dlMax: 2620, ulArfcnMin: 514000, ulArfcnMax: 524000, dlArfcnMin: 514000, dlArfcnMax: 524000 },
  { band: "n40", name: "2300 MHz TDD", fr: "FR1", mode: "TDD", ulMin: 2300, ulMax: 2400, dlMin: 2300, dlMax: 2400, ulArfcnMin: 460000, ulArfcnMax: 480000, dlArfcnMin: 460000, dlArfcnMax: 480000 },
  { band: "n41", name: "2500 MHz BRS/EBS", fr: "FR1", mode: "TDD", ulMin: 2496, ulMax: 2690, dlMin: 2496, dlMax: 2690, ulArfcnMin: 499200, ulArfcnMax: 537999, dlArfcnMin: 499200, dlArfcnMax: 537999 },
  { band: "n48", name: "3500 MHz CBRS", fr: "FR1", mode: "TDD", ulMin: 3550, ulMax: 3700, dlMin: 3550, dlMax: 3700, ulArfcnMin: 636667, ulArfcnMax: 646666, dlArfcnMin: 636667, dlArfcnMax: 646666 },
  { band: "n66", name: "1700/2100 MHz AWS", fr: "FR1", mode: "FDD", ulMin: 1710, ulMax: 1780, dlMin: 2110, dlMax: 2200, ulArfcnMin: 342000, ulArfcnMax: 356000, dlArfcnMin: 422000, dlArfcnMax: 440000 },
  { band: "n70", name: "2000 MHz AWS-4", fr: "FR1", mode: "FDD", ulMin: 1695, ulMax: 1710, dlMin: 1995, dlMax: 2020, ulArfcnMin: 339000, ulArfcnMax: 342000, dlArfcnMin: 399000, dlArfcnMax: 404000 },
  { band: "n71", name: "600 MHz US", fr: "FR1", mode: "FDD", ulMin: 663, ulMax: 698, dlMin: 617, dlMax: 652, ulArfcnMin: 132600, ulArfcnMax: 139600, dlArfcnMin: 123400, dlArfcnMax: 130400 },
  { band: "n77", name: "3700 MHz C-Band", fr: "FR1", mode: "TDD", ulMin: 3300, ulMax: 4200, dlMin: 3300, dlMax: 4200, ulArfcnMin: 620000, ulArfcnMax: 680000, dlArfcnMin: 620000, dlArfcnMax: 680000 },
  { band: "n78", name: "3500 MHz Global 5G", fr: "FR1", mode: "TDD", ulMin: 3300, ulMax: 3800, dlMin: 3300, dlMax: 3800, ulArfcnMin: 620000, ulArfcnMax: 653333, dlArfcnMin: 620000, dlArfcnMax: 653333 },
  { band: "n79", name: "4500 MHz Japan/China", fr: "FR1", mode: "TDD", ulMin: 4400, ulMax: 5000, dlMin: 4400, dlMax: 5000, ulArfcnMin: 693334, ulArfcnMax: 733333, dlArfcnMin: 693334, dlArfcnMax: 733333 },

  // FR2 mmWave Bands
  { band: "n257", name: "28 GHz mmWave", fr: "FR2", mode: "TDD", ulMin: 26500, ulMax: 29500, dlMin: 26500, dlMax: 29500, ulArfcnMin: 2054167, ulArfcnMax: 2104166, dlArfcnMin: 2054167, dlArfcnMax: 2104166 },
  { band: "n258", name: "26 GHz mmWave", fr: "FR2", mode: "TDD", ulMin: 24250, ulMax: 27500, dlMin: 24250, dlMax: 27500, ulArfcnMin: 2016667, ulArfcnMax: 2070833, dlArfcnMin: 2016667, dlArfcnMax: 2070833 },
  { band: "n260", name: "39 GHz mmWave", fr: "FR2", mode: "TDD", ulMin: 37000, ulMax: 40000, dlMin: 37000, dlMax: 40000, ulArfcnMin: 2229167, ulArfcnMax: 2279166, dlArfcnMin: 2229167, dlArfcnMax: 2279166 },
  { band: "n261", name: "28 GHz US mmWave", fr: "FR2", mode: "TDD", ulMin: 27500, ulMax: 28350, dlMin: 27500, dlMax: 28350, ulArfcnMin: 2070834, ulArfcnMax: 2084999, dlArfcnMin: 2070834, dlArfcnMax: 2084999 },
];

// ─── Quick Presets ─────────────────────────────────────────────────────────────
const PRESET_LIST = [
  { label: "n78 C-Band (3.5 GHz)", arfcn: 636666, freq: 3549.99, band: "n78" },
  { label: "n77 C-Band (3.7 GHz)", arfcn: 646666, freq: 3699.99, band: "n77" },
  { label: "n41 Mid-Band (2.5 GHz)", arfcn: 518598, freq: 2592.99, band: "n41" },
  { label: "n28 APT (700 MHz)", arfcn: 156100, freq: 780.50, band: "n28" },
  { label: "n71 Low-Band (600 MHz)", arfcn: 126900, freq: 634.50, band: "n71" },
  { label: "n1 Mid-Band (2.1 GHz)", arfcn: 428000, freq: 2140.00, band: "n1" },
  { label: "n257 mmWave (28 GHz)", arfcn: 2079167, freq: 28000.08, band: "n257" },
  { label: "n260 mmWave (39 GHz)", arfcn: 2254167, freq: 38500.08, band: "n260" },
];

// ─── Core Calculations ────────────────────────────────────────────────────────
// NR-ARFCN to Frequency (MHz)
function arfcnToFreq(nRef) {
  if (isNaN(nRef) || nRef < 0 || nRef > 3279165) return null;

  for (const r of RASTER_RANGES) {
    if (nRef >= r.nRefMin && nRef <= r.nRefMax) {
      const freqMhz = r.fRefOffs + r.deltaF * (nRef - r.nRefOffs);
      return {
        freqMhz: Number(freqMhz.toFixed(6)),
        freqGhz: Number((freqMhz / 1000).toFixed(6)),
        freqKhz: Number((freqMhz * 1000).toFixed(3)),
        range: r,
      };
    }
  }
  return null;
}

// Frequency (MHz) to NR-ARFCN
function freqToArfcn(freqMhz) {
  if (isNaN(freqMhz) || freqMhz < 0 || freqMhz > 100000) return null;

  for (const r of RASTER_RANGES) {
    if (freqMhz >= r.fMin && freqMhz <= r.fMax) {
      const rawNRef = r.nRefOffs + (freqMhz - r.fRefOffs) / r.deltaF;
      const exactNRef = Math.round(rawNRef);
      const calculatedFreq = r.fRefOffs + r.deltaF * (exactNRef - r.nRefOffs);
      const isExactRaster = Math.abs(calculatedFreq - freqMhz) < 1e-5;

      return {
        arfcn: exactNRef,
        exactFreqMhz: Number(calculatedFreq.toFixed(6)),
        isExactRaster,
        freqDeltaKhz: Number((Math.abs(calculatedFreq - freqMhz) * 1000).toFixed(3)),
        range: r,
      };
    }
  }
  return null;
}

// GSCN to Frequency (SSB Center Frequency)
function gscnToFreq(gscn) {
  if (isNaN(gscn) || gscn < 1 || gscn > 26639) return null;

  if (gscn <= 7498) {
    // 0 - 3000 MHz: GSCN = 3N + (M - 3)/2, where M in {1, 3, 5}
    const N = Math.floor(gscn / 3);
    const rem = gscn % 3;
    let M = 3;
    if (rem === 0) M = 3;
    else if (rem === 1) M = 5;
    else if (rem === 2) M = 1;
    const freqKhz = N * 1200 + M * 50;
    const freqMhz = freqKhz / 1000;
    return { freqMhz: Number(freqMhz.toFixed(4)), freqKhz, rangeLabel: "0 - 3000 MHz (FR1)" };
  } else if (gscn <= 22255) {
    // 3000 - 24250 MHz: GSCN = 7499 + N, SS_REF = 3000 MHz + N * 1.44 MHz
    const N = gscn - 7499;
    const freqMhz = 3000 + N * 1.44;
    return { freqMhz: Number(freqMhz.toFixed(4)), freqKhz: Number((freqMhz * 1000).toFixed(1)), rangeLabel: "3000 - 24250 MHz (FR1)" };
  } else {
    // 24250 - 100000 MHz: GSCN = 22256 + N, SS_REF = 24250.08 MHz + N * 17.28 MHz
    const N = gscn - 22256;
    const freqMhz = 24250.08 + N * 17.28;
    return { freqMhz: Number(freqMhz.toFixed(4)), freqKhz: Number((freqMhz * 1000).toFixed(1)), rangeLabel: "24250 - 100000 MHz (FR2 mmWave)" };
  }
}

// Find Matching 5G Bands for a given frequency
function findMatchingBands(freqMhz, arfcn) {
  if (!freqMhz && !arfcn) return [];
  const f = freqMhz;
  const matches = [];

  for (const b of NR_BANDS_DB) {
    let dlMatch = false;
    let ulMatch = false;

    if (f !== null && f !== undefined) {
      dlMatch = f >= b.dlMin && f <= b.dlMax;
      ulMatch = f >= b.ulMin && f <= b.ulMax;
    } else if (arfcn !== null && arfcn !== undefined) {
      dlMatch = arfcn >= b.dlArfcnMin && arfcn <= b.dlArfcnMax;
      ulMatch = arfcn >= b.ulArfcnMin && arfcn <= b.ulArfcnMax;
    }

    if (dlMatch || ulMatch) {
      matches.push({
        ...b,
        isDl: dlMatch,
        isUl: ulMatch,
      });
    }
  }

  return matches;
}

export default function FiveGArfcnCalculator() {
  const [mode, setMode] = useState("arfcn-to-freq"); // "arfcn-to-freq" | "freq-to-arfcn" | "gscn" | "band-table"
  const [arfcnInput, setArfcnInput] = useState("636666");
  const [freqInput, setFreqInput] = useState("3550");
  const [freqUnit, setFreqUnit] = useState("MHz"); // "MHz" | "GHz" | "kHz"
  const [gscnInput, setGscnInput] = useState("7856");
  const [searchFilter, setSearchFilter] = useState("");
  const [toastNotice, setToastNotice] = useState("");

  const showToast = (msg) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(""), 3000);
  };

  // Convert input frequency to MHz for calculation
  const normalizedFreqMhz = useMemo(() => {
    const val = parseFloat(freqInput);
    if (isNaN(val)) return null;
    if (freqUnit === "GHz") return val * 1000;
    if (freqUnit === "kHz") return val / 1000;
    return val;
  }, [freqInput, freqUnit]);

  // ARFCN -> Freq Result
  const arfcnResult = useMemo(() => {
    const nRef = parseInt(arfcnInput, 10);
    if (isNaN(nRef)) return null;
    const res = arfcnToFreq(nRef);
    if (!res) return null;
    const bands = findMatchingBands(res.freqMhz, nRef);
    return { ...res, bands, nRef };
  }, [arfcnInput]);

  // Freq -> ARFCN Result
  const freqResult = useMemo(() => {
    if (normalizedFreqMhz === null) return null;
    const res = freqToArfcn(normalizedFreqMhz);
    if (!res) return null;
    const bands = findMatchingBands(res.exactFreqMhz, res.arfcn);
    return { ...res, bands, inputMhz: normalizedFreqMhz };
  }, [normalizedFreqMhz]);

  // GSCN Result
  const gscnResult = useMemo(() => {
    const val = parseInt(gscnInput, 10);
    if (isNaN(val)) return null;
    const res = gscnToFreq(val);
    if (!res) return null;
    const bands = findMatchingBands(res.freqMhz, null);
    return { ...res, gscn: val, bands };
  }, [gscnInput]);

  // Filtered Bands Table
  const filteredBands = useMemo(() => {
    if (!searchFilter.trim()) return NR_BANDS_DB;
    const q = searchFilter.trim().toLowerCase();
    return NR_BANDS_DB.filter(
      (b) =>
        b.band.toLowerCase().includes(q) ||
        b.name.toLowerCase().includes(q) ||
        b.fr.toLowerCase().includes(q) ||
        b.mode.toLowerCase().includes(q) ||
        String(b.dlMin).includes(q) ||
        String(b.dlMax).includes(q) ||
        String(b.dlArfcnMin).includes(q) ||
        String(b.dlArfcnMax).includes(q)
    );
  }, [searchFilter]);

  // Summary text for copy
  const activeSummary = useMemo(() => {
    if (mode === "arfcn-to-freq" && arfcnResult) {
      return `5G NR ARFCN to Frequency Conversion
NR-ARFCN: ${arfcnResult.nRef}
Frequency (MHz): ${arfcnResult.freqMhz} MHz
Frequency (GHz): ${arfcnResult.freqGhz} GHz
Frequency (kHz): ${arfcnResult.freqKhz.toLocaleString()} kHz
Raster Step (ΔF_Global): ${arfcnResult.range.deltaFKhz} kHz
3GPP Frequency Range: ${arfcnResult.range.name}
Matching Bands: ${arfcnResult.bands.map((b) => `${b.band} (${b.name}) [${b.isDl ? "DL" : ""}${b.isUl ? "UL" : ""}]`).join(", ") || "None"}`;
    }
    if (mode === "freq-to-arfcn" && freqResult) {
      return `5G NR Frequency to ARFCN Conversion
Input Frequency: ${freqResult.inputMhz} MHz
Calculated NR-ARFCN: ${freqResult.arfcn}
Exact Raster Frequency: ${freqResult.exactFreqMhz} MHz
On Exact Raster Step: ${freqResult.isExactRaster ? "Yes" : `No (Δ = ${freqResult.freqDeltaKhz} kHz)`}
Raster Step: ${freqResult.range.deltaFKhz} kHz
3GPP Frequency Range: ${freqResult.range.name}
Matching Bands: ${freqResult.bands.map((b) => `${b.band} (${b.name})`).join(", ") || "None"}`;
    }
    return "";
  }, [mode, arfcnResult, freqResult]);

  return (
    <div className="space-y-5">
      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #030d1a 0%, #08182d 60%, #031e36 100%)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-xl flex-shrink-0">
            📶
          </div>
          <div>
            <div className="font-extrabold text-white text-sm tracking-wide">5G NR ARFCN &amp; Frequency Calculator</div>
            <div className="text-[11px] text-cyan-300/70 font-medium mt-0.5">
              3GPP TS 38.104 Global Frequency Raster · FR1 &amp; FR2 · GSCN SSB
            </div>
          </div>
        </div>

        {/* Dynamic Quick Result Pill */}
        {mode === "arfcn-to-freq" && arfcnResult && (
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Calculated Freq</div>
              <div className="text-base font-extrabold text-cyan-300">{arfcnResult.freqMhz} MHz</div>
            </div>
            <div className="w-px h-7 bg-white/10" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Band Match</div>
              <div className="text-xs font-bold text-emerald-400">
                {arfcnResult.bands.length > 0 ? arfcnResult.bands.map((b) => b.band).join(", ") : "Out of band"}
              </div>
            </div>
          </div>
        )}

        {mode === "freq-to-arfcn" && freqResult && (
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">NR-ARFCN</div>
              <div className="text-base font-extrabold text-cyan-300">{freqResult.arfcn}</div>
            </div>
            <div className="w-px h-7 bg-white/10" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Band Match</div>
              <div className="text-xs font-bold text-emerald-400">
                {freqResult.bands.length > 0 ? freqResult.bands.map((b) => b.band).join(", ") : "Out of band"}
              </div>
            </div>
          </div>
        )}

        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-cyan-500/10 pointer-events-none" />
      </div>

      {/* ── Quick Presets Bar ─────────────────────────────────────────────── */}
      <div className="bg-slate-50 dark:bg-[#111a27] border border-slate-200 dark:border-[#223247] rounded-2xl p-3.5">
        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
          <span>⚡</span>
          <span>Popular 5G Band Presets</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {PRESET_LIST.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setArfcnInput(String(p.arfcn));
                setFreqInput(String(p.freq));
                setFreqUnit("MHz");
                showToast(`✓ Loaded preset: ${p.label}`);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#182333] border border-slate-200 dark:border-[#2a3c53] hover:border-cyan-500 text-left cursor-pointer group transition-all flex-shrink-0"
            >
              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                {p.band}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.freq} MHz</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Mode Selection Tabs ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 bg-slate-100 dark:bg-[#111a27] p-1 rounded-xl border border-slate-200 dark:border-[#223247]">
        {[
          { id: "arfcn-to-freq", label: "NR-ARFCN → Frequency", icon: "🔢" },
          { id: "freq-to-arfcn", label: "Frequency → NR-ARFCN", icon: "📡" },
          { id: "gscn",          label: "GSCN ↔ SSB Frequency",  icon: "🧭" },
          { id: "band-table",    label: "5G NR Band Reference", icon: "📋" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              mode === tab.id
                ? "bg-white dark:bg-[#182333] text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-[#2a3c53]"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Toast Message ─────────────────────────────────────────────────── */}
      {toastNotice && (
        <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
          {toastNotice}
        </div>
      )}

      {/* ── TAB 1: NR-ARFCN to Frequency ───────────────────────────────────── */}
      {mode === "arfcn-to-freq" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Input */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-5 shadow-sm space-y-4">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Input NR-ARFCN
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  NR Absolute Radio Frequency Channel Number (N_REF)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="3279165"
                    value={arfcnInput}
                    onChange={(e) => setArfcnInput(e.target.value)}
                    placeholder="e.g. 636666"
                    className="tool-input font-mono text-base font-bold pl-3 pr-20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    N_REF
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1.5 flex justify-between">
                  <span>Valid Range: 0 – 3,279,165</span>
                  <span>(0 – 100 GHz)</span>
                </div>
              </div>

              {/* Slider for easy exploration */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Coarse Adjustment
                </label>
                <input
                  type="range"
                  min="0"
                  max="2300000"
                  step="1000"
                  value={parseInt(arfcnInput, 10) || 0}
                  onChange={(e) => setArfcnInput(e.target.value)}
                  className="w-full accent-cyan-600 dark:accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Quick Range Indicators */}
              <div className="pt-1 space-y-1.5 text-[11px]">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Raster Boundaries:</div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#182333] border border-slate-200 dark:border-[#2a3c53]">
                  <span className="text-slate-600 dark:text-slate-400">Range 1 (0-3 GHz, ΔF=5kHz):</span>
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">0 – 599,999</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#182333] border border-slate-200 dark:border-[#2a3c53]">
                  <span className="text-slate-600 dark:text-slate-400">Range 2 (3-24.25 GHz, ΔF=15kHz):</span>
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">600,000 – 2,016,666</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#182333] border border-slate-200 dark:border-[#2a3c53]">
                  <span className="text-slate-600 dark:text-slate-400">Range 3 (24.25-100 GHz, ΔF=60kHz):</span>
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">2,016,667 – 3,279,165</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Results Display */}
          <div className="lg:col-span-7 space-y-4">
            {arfcnResult ? (
              <>
                {/* Highlight Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-300 leading-none">
                      {arfcnResult.freqMhz}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1.5">
                      Megahertz (MHz)
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-300 leading-none">
                      {arfcnResult.freqGhz}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1.5">
                      Gigahertz (GHz)
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-300 leading-none truncate">
                      {arfcnResult.freqKhz.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1.5">
                      Kilohertz (kHz)
                    </div>
                  </div>
                </div>

                {/* Calculation Details Breakdown */}
                <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] shadow-sm overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-[#1a2740] bg-slate-50 dark:bg-[#111a27] flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      3GPP TS 38.104 Specifications
                    </span>
                    <CopyButton text={activeSummary} label="Copy Specs" />
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-[#1a2740] text-xs">
                    <div className="flex justify-between px-4 py-2.5">
                      <span className="text-slate-500 dark:text-slate-400">Raster Range</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{arfcnResult.range.name}</span>
                    </div>
                    <div className="flex justify-between px-4 py-2.5">
                      <span className="text-slate-500 dark:text-slate-400">Global Raster Step (ΔF_Global)</span>
                      <span className="font-bold font-mono text-cyan-600 dark:text-cyan-400">
                        {arfcnResult.range.deltaFKhz} kHz ({arfcnResult.range.deltaF} MHz)
                      </span>
                    </div>
                    <div className="flex justify-between px-4 py-2.5">
                      <span className="text-slate-500 dark:text-slate-400">Reference Offset (F_REF-Offs)</span>
                      <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                        {arfcnResult.range.fRefOffs} MHz
                      </span>
                    </div>
                    <div className="flex justify-between px-4 py-2.5">
                      <span className="text-slate-500 dark:text-slate-400">ARFCN Offset (N_REF-Offs)</span>
                      <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                        {arfcnResult.range.nRefOffs}
                      </span>
                    </div>
                    <div className="flex justify-between px-4 py-2.5 bg-slate-50/50 dark:bg-[#111a27]/50">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold">Formula Applied</span>
                      <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        F = {arfcnResult.range.fRefOffs} + {arfcnResult.range.deltaF} × ({arfcnResult.nRef} - {arfcnResult.range.nRefOffs}) MHz
                      </span>
                    </div>
                  </div>
                </div>

                {/* Matching 5G Bands Section */}
                <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Matching 5G NR Operating Bands
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                      {arfcnResult.bands.length} Band{arfcnResult.bands.length === 1 ? "" : "s"} Found
                    </span>
                  </div>

                  {arfcnResult.bands.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#182333] text-center text-xs text-slate-400">
                      No standardized 3GPP operating band matches this frequency directly.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {arfcnResult.bands.map((b) => (
                        <div
                          key={b.band}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-[#182333] border border-slate-200 dark:border-[#2a3c53] flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-sm text-cyan-600 dark:text-cyan-400">{b.band}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#223247] font-bold text-slate-600 dark:text-slate-300">
                                {b.mode}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                                {b.fr}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{b.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              {b.isDl && b.isUl ? "DL + UL" : b.isDl ? "DL (Downlink)" : "UL (Uplink)"}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                              {b.dlMin}–{b.dlMax} MHz
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-700/30 rounded-2xl p-6 text-center">
                <div className="text-2xl mb-2">⚠️</div>
                <div className="font-bold text-sm text-amber-700 dark:text-amber-400">Invalid ARFCN Value</div>
                <div className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                  Please enter a valid 5G NR ARFCN between 0 and 3,279,165.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: Frequency to NR-ARFCN ───────────────────────────────────── */}
      {mode === "freq-to-arfcn" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Input */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-5 shadow-sm space-y-4">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Input Frequency
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Carrier Center Frequency
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    max="100000"
                    value={freqInput}
                    onChange={(e) => setFreqInput(e.target.value)}
                    placeholder="e.g. 3550"
                    className="tool-input font-mono text-base font-bold flex-1"
                  />
                  <div className="flex bg-slate-100 dark:bg-[#182333] p-1 rounded-xl border border-slate-200 dark:border-[#2a3c53]">
                    {["MHz", "GHz", "kHz"].map((u) => (
                      <button
                        key={u}
                        onClick={() => setFreqUnit(u)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                          freqUnit === u
                            ? "bg-cyan-600 text-white shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Jump Buttons */}
              <div className="pt-1">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Common Frequencies
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "700 MHz", freq: "700", unit: "MHz" },
                    { label: "1800 MHz", freq: "1800", unit: "MHz" },
                    { label: "2100 MHz", freq: "2100", unit: "MHz" },
                    { label: "2.6 GHz", freq: "2.6", unit: "GHz" },
                    { label: "3.5 GHz", freq: "3.5", unit: "GHz" },
                    { label: "3.7 GHz", freq: "3.7", unit: "GHz" },
                    { label: "28 GHz", freq: "28", unit: "GHz" },
                    { label: "39 GHz", freq: "39", unit: "GHz" },
                  ].map((cf) => (
                    <button
                      key={cf.label}
                      onClick={() => {
                        setFreqInput(cf.freq);
                        setFreqUnit(cf.unit);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-[#182333] border border-slate-200 dark:border-[#2a3c53] text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:border-cyan-500 cursor-pointer"
                    >
                      {cf.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-7 space-y-4">
            {freqResult ? (
              <>
                {/* Big Result Card */}
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6 text-center space-y-2">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Calculated 5G NR-ARFCN (N_REF)
                  </div>
                  <div className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-300 font-mono">
                    {freqResult.arfcn}
                  </div>
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Exact Raster Center: <span className="font-mono text-cyan-500 font-bold">{freqResult.exactFreqMhz} MHz</span>
                  </div>
                </div>

                {/* Exact Raster Step Validation */}
                <div
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                    freqResult.isExactRaster
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                      : "bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300"
                  }`}
                >
                  <span className="text-lg mt-0.5">{freqResult.isExactRaster ? "✓" : "ℹ️"}</span>
                  <div className="text-xs">
                    <div className="font-bold">
                      {freqResult.isExactRaster
                        ? "Frequency falls exactly on 3GPP Global Raster step."
                        : `Frequency rounded to nearest raster point (Δ = ${freqResult.freqDeltaKhz} kHz).`}
                    </div>
                    <div className="text-[11px] opacity-80 mt-0.5">
                      3GPP channel raster step for this range is {freqResult.range.deltaFKhz} kHz.
                    </div>
                  </div>
                </div>

                {/* Calculation Breakdown */}
                <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] shadow-sm overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-[#1a2740] bg-slate-50 dark:bg-[#111a27] flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      3GPP TS 38.104 Specifications
                    </span>
                    <CopyButton text={activeSummary} label="Copy Specs" />
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-[#1a2740] text-xs">
                    <div className="flex justify-between px-4 py-2.5">
                      <span className="text-slate-500 dark:text-slate-400">Applicable Raster Range</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{freqResult.range.name}</span>
                    </div>
                    <div className="flex justify-between px-4 py-2.5">
                      <span className="text-slate-500 dark:text-slate-400">Raster Step (ΔF_Global)</span>
                      <span className="font-bold font-mono text-cyan-600 dark:text-cyan-400">
                        {freqResult.range.deltaFKhz} kHz
                      </span>
                    </div>
                    <div className="flex justify-between px-4 py-2.5 bg-slate-50/50 dark:bg-[#111a27]/50">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold">Inverse Formula</span>
                      <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        N_REF = {freqResult.range.nRefOffs} + ({freqResult.inputMhz} - {freqResult.range.fRefOffs}) / {freqResult.range.deltaF}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Matching Bands */}
                <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm space-y-3">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Matching 5G NR Operating Bands
                  </div>
                  {freqResult.bands.length === 0 ? (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#182333] text-center text-xs text-slate-400">
                      No standardized 3GPP band contains this frequency.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {freqResult.bands.map((b) => (
                        <div
                          key={b.band}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-[#182333] border border-slate-200 dark:border-[#2a3c53] flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-sm text-cyan-600 dark:text-cyan-400">{b.band}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#223247] font-bold text-slate-600 dark:text-slate-300">
                                {b.mode}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{b.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              {b.isDl && b.isUl ? "DL + UL" : b.isDl ? "DL (Downlink)" : "UL (Uplink)"}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                              {b.dlMin}–{b.dlMax} MHz
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-700/30 rounded-2xl p-6 text-center">
                <div className="text-2xl mb-2">⚠️</div>
                <div className="font-bold text-sm text-amber-700 dark:text-amber-400">Invalid Frequency</div>
                <div className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                  Please enter a valid frequency between 0 and 100,000 MHz (100 GHz).
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: GSCN (Global Synchronization Channel Number) ───────────── */}
      {mode === "gscn" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-5 shadow-sm space-y-4">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                GSCN Synchronization Raster
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Input GSCN Number (1 – 26639)
                </label>
                <input
                  type="number"
                  min="1"
                  max="26639"
                  value={gscnInput}
                  onChange={(e) => setGscnInput(e.target.value)}
                  placeholder="e.g. 7856"
                  className="tool-input font-mono text-base font-bold"
                />
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Common GSCN SSB Presets
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "n78 (3.5 GHz)", gscn: "7856" },
                    { label: "n77 (3.7 GHz)", gscn: "7985" },
                    { label: "n41 (2.5 GHz)", gscn: "6240" },
                    { label: "n28 (700 MHz)", gscn: "1899" },
                    { label: "n257 (28 GHz)", gscn: "22473" },
                  ].map((g) => (
                    <button
                      key={g.label}
                      onClick={() => setGscnInput(g.gscn)}
                      className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-[#182333] border border-slate-200 dark:border-[#2a3c53] text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:border-cyan-500 cursor-pointer"
                    >
                      {g.label} (GSCN {g.gscn})
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#182333] text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border border-slate-200 dark:border-[#2a3c53]">
                💡 <strong>What is GSCN?</strong> In 5G NR, UE devices scan the <em>Synchronization Raster (GSCN)</em> rather than the full RF raster to quickly detect SS/PBCH blocks (SSB), drastically speeding up cell search.
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {gscnResult ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-5 text-center">
                    <div className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-300">
                      {gscnResult.freqMhz} MHz
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">
                      SSB Center Frequency (SS_REF)
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 text-center">
                    <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-300 font-mono">
                      {gscnResult.gscn}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">
                      GSCN Channel Number
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] shadow-sm overflow-hidden text-xs">
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-[#1a2740] bg-slate-50 dark:bg-[#111a27] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    SSB Raster Details (3GPP TS 38.104 §5.4.3)
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-[#1a2740]">
                    <div className="flex justify-between px-4 py-2.5">
                      <span className="text-slate-500">Frequency Range</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{gscnResult.rangeLabel}</span>
                    </div>
                    <div className="flex justify-between px-4 py-2.5">
                      <span className="text-slate-500">Center Frequency (kHz)</span>
                      <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                        {gscnResult.freqKhz.toLocaleString()} kHz
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-700/30 rounded-2xl p-6 text-center">
                <div className="text-2xl mb-2">⚠️</div>
                <div className="font-bold text-sm text-amber-700 dark:text-amber-400">Invalid GSCN Value</div>
                <div className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                  Please enter a valid GSCN between 1 and 26639.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: Complete 5G NR Band Reference Table ─────────────────────── */}
      {mode === "band-table" && (
        <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] shadow-sm overflow-hidden space-y-3 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              5G NR Operating Bands Database (3GPP TS 38.101-1 &amp; TS 38.101-2)
            </div>
            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search by band (e.g. n78, 3500, FDD, FR2)..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#182333] border border-slate-200 dark:border-[#2a3c53] text-xs font-mono outline-none focus:border-cyan-500"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-[#1a2740]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#111a27] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-[#1a2740]">
                <tr>
                  <th className="p-3 font-bold">NR Band</th>
                  <th className="p-3 font-bold">Common Name</th>
                  <th className="p-3 font-bold">FR</th>
                  <th className="p-3 font-bold">Mode</th>
                  <th className="p-3 font-bold">Uplink (MHz)</th>
                  <th className="p-3 font-bold">Downlink (MHz)</th>
                  <th className="p-3 font-bold">DL NR-ARFCN Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1a2740]">
                {filteredBands.map((b) => (
                  <tr key={b.band} className="hover:bg-slate-50/70 dark:hover:bg-[#182333]/70 transition-colors">
                    <td className="p-3 font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">{b.band}</td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{b.name}</td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px]">
                        {b.fr}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#223247] font-bold text-[10px] text-slate-700 dark:text-slate-300">
                        {b.mode}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">
                      {b.ulMin} – {b.ulMax}
                    </td>
                    <td className="p-3 font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {b.dlMin} – {b.dlMax}
                    </td>
                    <td className="p-3 font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                      {b.dlArfcnMin.toLocaleString()} – {b.dlArfcnMax.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
