"use client";

import { useState, useMemo } from "react";
import CopyButton from "@/components/CopyButton";

// ─── 5G NR Band Presets ────────────────────────────────────────────────────────
const NR_BANDS = [
  // FR1 Sub-6 GHz
  { id: "n1",   name: "n1 (2100 MHz)",  freq: 2100,  fr: "FR1", maxBW: 20,  mu: [0,1] },
  { id: "n3",   name: "n3 (1800 MHz)",  freq: 1800,  fr: "FR1", maxBW: 25,  mu: [0,1] },
  { id: "n5",   name: "n5 (850 MHz)",   freq: 850,   fr: "FR1", maxBW: 15,  mu: [0,1] },
  { id: "n7",   name: "n7 (2600 MHz)",  freq: 2600,  fr: "FR1", maxBW: 20,  mu: [0,1] },
  { id: "n28",  name: "n28 (700 MHz)",  freq: 700,   fr: "FR1", maxBW: 30,  mu: [0,1] },
  { id: "n38",  name: "n38 (2600 MHz TDD)",freq:2600,fr: "FR1", maxBW: 100, mu: [0,1,2] },
  { id: "n41",  name: "n41 (2500 MHz)", freq: 2500,  fr: "FR1", maxBW: 100, mu: [0,1,2,3] },
  { id: "n77",  name: "n77 (3700 MHz)", freq: 3700,  fr: "FR1", maxBW: 100, mu: [0,1,2,3] },
  { id: "n78",  name: "n78 (3500 MHz)", freq: 3500,  fr: "FR1", maxBW: 100, mu: [0,1,2,3] },
  { id: "n79",  name: "n79 (4500 MHz)", freq: 4500,  fr: "FR1", maxBW: 100, mu: [0,1,2,3] },
  // FR2 mmWave
  { id: "n257", name: "n257 (28 GHz)",  freq: 28000, fr: "FR2", maxBW: 400, mu: [2,3] },
  { id: "n258", name: "n258 (26 GHz)",  freq: 26000, fr: "FR2", maxBW: 400, mu: [2,3] },
  { id: "n260", name: "n260 (39 GHz)",  freq: 39000, fr: "FR2", maxBW: 400, mu: [2,3] },
  { id: "n261", name: "n261 (28 GHz US)",freq:28000, fr: "FR2", maxBW: 400, mu: [2,3] },
];

// ─── Subcarrier Spacing (μ) table ─────────────────────────────────────────────
const MU_CONFIG = {
  0: { scs: 15,  slotDuration: 1,    slotsPerSubframe: 1,  label: "μ=0 (15 kHz)" },
  1: { scs: 30,  slotDuration: 0.5,  slotsPerSubframe: 2,  label: "μ=1 (30 kHz)" },
  2: { scs: 60,  slotDuration: 0.25, slotsPerSubframe: 4,  label: "μ=2 (60 kHz)" },
  3: { scs: 120, slotDuration: 0.125,slotsPerSubframe: 8,  label: "μ=3 (120 kHz)" },
};

// ─── Max PRBs per bandwidth per SCS (3GPP TS 38.101) ─────────────────────────
// [bandwidth_MHz] -> { scs_kHz: maxPRBs }
const BW_PRB_TABLE = {
  5:   { 15: 25,  30: 11, 60: null },
  10:  { 15: 52,  30: 24, 60: 11  },
  15:  { 15: 79,  30: 38, 60: 18  },
  20:  { 15: 106, 30: 51, 60: 24  },
  25:  { 15: 133, 30: 65, 60: 31  },
  30:  { 15: 160, 30: 78, 60: 38  },
  40:  { 15: 216, 30: 106,60: 51  },
  50:  { 15: 270, 30: 133,60: 65  },
  60:  { 15: null,30: 162,60: 79  },
  70:  { 15: null,30: 189,60: 93  },
  80:  { 15: null,30: 217,60: 107 },
  90:  { 15: null,30: 245,60: 121 },
  100: { 15: null,30: 273,60: 135 },
  200: { 60: 66,  120: 33         },
  400: { 60: 132, 120: 66         },
};

// ─── Modulation coding table ───────────────────────────────────────────────────
const MODULATIONS = [
  { id: "qpsk",    label: "QPSK",      bitsPerSymbol: 2,  qm: 2,  codeRate: 308/1024 },
  { id: "16qam",   label: "16-QAM",    bitsPerSymbol: 4,  qm: 4,  codeRate: 616/1024 },
  { id: "64qam",   label: "64-QAM",    bitsPerSymbol: 6,  qm: 6,  codeRate: 873/1024 },
  { id: "256qam",  label: "256-QAM",   bitsPerSymbol: 8,  qm: 8,  codeRate: 948/1024 },
  { id: "1024qam", label: "1024-QAM",  bitsPerSymbol: 10, qm: 10, codeRate: 948/1024 },
];

// ─── Overhead ratios (approximate) ───────────────────────────────────────────
const OVERHEAD = {
  dl: { dmrs: 0.143, pdcch: 0.043, sss: 0.01, pss: 0.01, pbch: 0.007 },
  ul: { dmrs: 0.143, pucch: 0.02 },
};

function formatThroughput(bps) {
  if (bps >= 1e9) return `${(bps / 1e9).toFixed(3)} Gbps`;
  if (bps >= 1e6) return `${(bps / 1e6).toFixed(2)} Mbps`;
  if (bps >= 1e3) return `${(bps / 1e3).toFixed(1)} Kbps`;
  return `${bps.toFixed(0)} bps`;
}

// ─── 3GPP TS 38.214 Section 4.1.2 formula ────────────────────────────────────
function calcThroughput({ prbs, mu, modId, layers, scalingFactor, direction }) {
  const muCfg = MU_CONFIG[mu];
  if (!muCfg) return null;

  const mod = MODULATIONS.find((m) => m.id === modId);
  if (!mod) return null;

  // Slots per second
  const slotsPerSec = 1000 / muCfg.slotDuration;

  // OH = overhead factor
  const ohFactors = direction === "dl" ? OVERHEAD.dl : OVERHEAD.ul;
  const totalOH = Object.values(ohFactors).reduce((a, b) => a + b, 0);
  const oh = 1 - totalOH;

  // 3GPP formula: Throughput = Σ{ v_Layers × Q_m × f × R_max × N_PRB × 12 × (1 - OH) } × (slots/s × 14)
  // where 14 = OFDM symbols per slot, 12 = subcarriers per PRB
  const throughput =
    layers * mod.qm * scalingFactor * mod.codeRate * prbs * 12 * oh * (slotsPerSec * 14);

  return throughput;
}

const SCENARIOS = [
  { name: "Indoor Hotspot",    band: "n258", bw: 400, mu: 3, mod: "256qam",  dlLayers: 4, ulLayers: 2, sf: 1,   tddRatio: "7:3" },
  { name: "Dense Urban 5G",    band: "n78",  bw: 100, mu: 1, mod: "256qam",  dlLayers: 4, ulLayers: 2, sf: 1,   tddRatio: "7:3" },
  { name: "Sub-6 GHz Wide",    band: "n77",  bw: 100, mu: 1, mod: "64qam",   dlLayers: 2, ulLayers: 1, sf: 0.75,tddRatio: "7:3" },
  { name: "Rural Coverage",    band: "n28",  bw: 20,  mu: 0, mod: "16qam",   dlLayers: 2, ulLayers: 1, sf: 0.5, tddRatio: "3:1" },
  { name: "mmWave Peak",       band: "n257", bw: 400, mu: 3, mod: "256qam",  dlLayers: 8, ulLayers: 4, sf: 1,   tddRatio: "8:2" },
];

export default function FiveGNRThroughput() {
  const [bandId, setBandId]         = useState("n78");
  const [bandwidth, setBandwidth]   = useState(100);
  const [mu, setMu]                 = useState(1);
  const [modId, setModId]           = useState("256qam");
  const [dlLayers, setDlLayers]     = useState(4);
  const [ulLayers, setUlLayers]     = useState(2);
  const [scalingFactor, setSF]      = useState(1);
  const [tddDl, setTddDl]           = useState(7);
  const [tddUl, setTddUl]           = useState(3);
  const [duplexMode, setDuplexMode] = useState("tdd"); // tdd | fdd
  const [activeTab, setActiveTab]   = useState("calc");

  const band = NR_BANDS.find((b) => b.id === bandId) || NR_BANDS[0];

  // Get PRBs for current bandwidth + SCS
  const scs = MU_CONFIG[mu]?.scs;
  const availablePRBs = BW_PRB_TABLE[bandwidth]?.[scs] ?? null;

  // TDD efficiency factors
  const tddTotal = tddDl + tddUl;
  const dlEff = duplexMode === "fdd" ? 1 : tddDl / tddTotal;
  const ulEff = duplexMode === "fdd" ? 1 : tddUl / tddTotal;

  const result = useMemo(() => {
    if (!availablePRBs) return null;

    const dl = calcThroughput({ prbs: availablePRBs, mu, modId, layers: dlLayers, scalingFactor, direction: "dl" });
    const ul = calcThroughput({ prbs: availablePRBs, mu, modId, layers: ulLayers, scalingFactor, direction: "ul" });

    if (!dl || !ul) return null;

    return {
      dlPeak: dl,
      ulPeak: ul,
      dlEffective: dl * dlEff,
      ulEffective: ul * ulEff,
      prbs: availablePRBs,
      spectralEffDl: (dl * dlEff) / (bandwidth * 1e6),
      spectralEffUl: (ul * ulEff) / (bandwidth * 1e6),
    };
  }, [availablePRBs, mu, modId, dlLayers, ulLayers, scalingFactor, dlEff, ulEff, bandwidth]);

  const applyScenario = (s) => {
    setBandId(s.band);
    setBandwidth(s.bw);
    setMu(s.mu);
    setModId(s.mod);
    setDlLayers(s.dlLayers);
    setUlLayers(s.ulLayers);
    setSF(s.sf);
    const [dl, ul] = s.tddRatio.split(":").map(Number);
    setTddDl(dl);
    setTddUl(ul);
  };

  const validBandwidths = Object.keys(BW_PRB_TABLE)
    .map(Number)
    .filter((bw) => BW_PRB_TABLE[bw]?.[scs] != null && bw <= band.maxBW);

  const summaryText = result
    ? `5G NR Throughput Summary
Band: ${band.name}
Bandwidth: ${bandwidth} MHz
SCS: ${MU_CONFIG[mu]?.label}
Modulation: ${MODULATIONS.find((m) => m.id === modId)?.label}
DL Layers: ${dlLayers} | UL Layers: ${ulLayers}
PRBs: ${result.prbs}

── Results ──────────────────────
DL Peak:        ${formatThroughput(result.dlPeak)}
UL Peak:        ${formatThroughput(result.ulPeak)}
DL Effective:   ${formatThroughput(result.dlEffective)}
UL Effective:   ${formatThroughput(result.ulEffective)}
DL Spectral Eff: ${result.spectralEffDl.toFixed(2)} bps/Hz
UL Spectral Eff: ${result.spectralEffUl.toFixed(2)} bps/Hz`
    : "";

  const TabBtn = ({ id, label }) => (
    <button onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
        activeTab === id
          ? "bg-white dark:bg-[#182333] text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-[#2a3c53]"
          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
      }`}>
      {label}
    </button>
  );

  return (
    <div className="space-y-5">

      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #050d1f 0%, #0a1628 60%, #03111e 100%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-xl flex-shrink-0">
            📶
          </div>
          <div>
            <div className="font-extrabold text-white text-sm tracking-wide">5G NR Throughput Calculator</div>
            <div className="text-[11px] text-cyan-300/70 font-medium mt-0.5">
              3GPP TS 38.214 §4.1.2 compliant · FR1 & FR2 · TDD/FDD
            </div>
          </div>
        </div>

        {result && (
          <div className="flex items-center gap-5 flex-wrap">
            <div className="text-center">
              <div className="text-lg font-extrabold text-cyan-300 leading-none">{formatThroughput(result.dlEffective)}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">DL Throughput</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-lg font-extrabold text-emerald-300 leading-none">{formatThroughput(result.ulEffective)}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">UL Throughput</div>
            </div>
          </div>
        )}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-cyan-500/10 pointer-events-none" />
      </div>

      {/* ── Quick Scenario Presets ────────────────────────────────────────── */}
      <div className="bg-slate-50 dark:bg-[#111a27] border border-slate-200 dark:border-[#223247] rounded-2xl p-4">
        <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
          ⚡ Quick Scenario Presets
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SCENARIOS.map((s) => (
            <button key={s.name} onClick={() => applyScenario(s)}
              className="p-2.5 rounded-xl bg-white dark:bg-[#182333] border border-slate-200 dark:border-[#2a3c53] hover:border-cyan-500 dark:hover:border-cyan-500/60 text-left cursor-pointer group transition-all">
              <div className="text-[11px] font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-tight">{s.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{s.band} · {s.bw}MHz</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Navigation ────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-slate-100 dark:bg-[#111a27] p-1 rounded-xl border border-slate-200 dark:border-[#223247]">
        <TabBtn id="calc"    label="⚙️ Parameters" />
        <TabBtn id="results" label="📊 Results" />
        <TabBtn id="formula" label="📐 Formula" />
      </div>

      {/* ── PARAMETERS TAB ───────────────────────────────────────────────── */}
      {activeTab === "calc" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Left Column */}
          <div className="space-y-4">

            {/* Band Selection */}
            <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm space-y-3">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">1. NR Band</div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Select Band <span className="font-normal text-slate-400">({band.fr} · {band.freq >= 1000 ? `${band.freq/1000} GHz` : `${band.freq} MHz`})</span>
                </label>
                <select value={bandId} onChange={(e) => { setBandId(e.target.value); }}
                  className="tool-input text-sm font-mono cursor-pointer">
                  <optgroup label="FR1 — Sub-6 GHz">
                    {NR_BANDS.filter((b) => b.fr === "FR1").map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="FR2 — mmWave">
                    {NR_BANDS.filter((b) => b.fr === "FR2").map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#182333] border border-slate-200 dark:border-[#2a3c53]">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Frequency Range</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{band.fr}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#182333] border border-slate-200 dark:border-[#2a3c53]">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Max Bandwidth</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{band.maxBW} MHz</div>
                </div>
              </div>
            </div>

            {/* Bandwidth + SCS */}
            <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm space-y-3">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">2. Bandwidth & Numerology</div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Channel Bandwidth (MHz)</label>
                <div className="flex flex-wrap gap-1.5">
                  {[5,10,15,20,25,30,40,50,60,70,80,90,100,200,400]
                    .filter((bw) => bw <= band.maxBW)
                    .map((bw) => {
                      const valid = BW_PRB_TABLE[bw]?.[scs] != null;
                      return (
                        <button key={bw} onClick={() => valid && setBandwidth(bw)} disabled={!valid}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                            bandwidth === bw
                              ? "bg-cyan-600 text-white shadow-sm"
                              : valid
                              ? "bg-slate-100 dark:bg-[#182333] text-slate-600 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 hover:border-cyan-400 border border-transparent"
                              : "bg-slate-50 dark:bg-[#161f2d] text-slate-300 dark:text-slate-700 opacity-40 cursor-not-allowed border border-transparent"
                          }`}>
                          {bw}
                        </button>
                      );
                    })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Subcarrier Spacing (Numerology μ)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {band.mu.map((m) => (
                    <button key={m} onClick={() => setMu(m)}
                      className={`py-2 px-1.5 rounded-xl text-center font-bold text-[11px] cursor-pointer border transition-all ${
                        mu === m
                          ? "bg-cyan-600 border-cyan-600 text-white shadow-sm"
                          : "bg-slate-50 dark:bg-[#182333] border-slate-200 dark:border-[#2a3c53] text-slate-600 dark:text-slate-300 hover:border-cyan-400"
                      }`}>
                      <div>{MU_CONFIG[m]?.label}</div>
                      <div className={`text-[10px] font-normal mt-0.5 ${mu === m ? "text-cyan-100" : "text-slate-400"}`}>
                        {MU_CONFIG[m]?.scs} kHz SCS
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {availablePRBs !== null ? (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <span>✓</span>
                  <span>{availablePRBs} PRBs available for {bandwidth} MHz at {scs} kHz SCS</span>
                </div>
              ) : (
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>This bandwidth + SCS combination is not defined in 3GPP TS 38.101</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">

            {/* Modulation + Layers */}
            <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm space-y-3">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">3. Modulation & MIMO</div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Modulation Scheme</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {MODULATIONS.map((m) => (
                    <button key={m.id} onClick={() => setModId(m.id)}
                      className={`py-2.5 px-2 rounded-xl border text-center cursor-pointer transition-all ${
                        modId === m.id
                          ? "bg-cyan-600 border-cyan-600 text-white shadow-sm"
                          : "bg-slate-50 dark:bg-[#182333] border-slate-200 dark:border-[#2a3c53] text-slate-700 dark:text-slate-300 hover:border-cyan-400"
                      }`}>
                      <div className="font-bold text-xs">{m.label}</div>
                      <div className={`text-[10px] mt-0.5 ${modId === m.id ? "text-cyan-100" : "text-slate-400"}`}>
                        {m.bitsPerSymbol} bits/sym
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">DL MIMO Layers</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {[1,2,4,8].map((l) => (
                      <button key={l} onClick={() => setDlLayers(l)}
                        className={`w-10 h-9 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          dlLayers === l ? "bg-cyan-600 text-white" : "bg-slate-100 dark:bg-[#182333] text-slate-600 dark:text-slate-400"
                        }`}>
                        {l}×
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">UL MIMO Layers</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {[1,2,4].map((l) => (
                      <button key={l} onClick={() => setUlLayers(l)}
                        className={`w-10 h-9 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          ulLayers === l ? "bg-emerald-600 text-white" : "bg-slate-100 dark:bg-[#182333] text-slate-600 dark:text-slate-400"
                        }`}>
                        {l}×
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Duplex Mode + Scaling */}
            <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm space-y-3">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">4. Duplex & Scaling</div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Duplex Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "tdd", label: "TDD", desc: "Time Division Duplex" },
                    { id: "fdd", label: "FDD", desc: "Frequency Division Duplex" },
                  ].map((d) => (
                    <button key={d.id} onClick={() => setDuplexMode(d.id)}
                      className={`py-2.5 px-3 rounded-xl border text-left cursor-pointer transition-all ${
                        duplexMode === d.id
                          ? "bg-slate-800 dark:bg-white border-slate-800 dark:border-white text-white dark:text-slate-900 shadow-sm"
                          : "bg-slate-50 dark:bg-[#182333] border-slate-200 dark:border-[#2a3c53] text-slate-700 dark:text-slate-300"
                      }`}>
                      <div className="font-bold text-xs">{d.label}</div>
                      <div className={`text-[10px] mt-0.5 ${duplexMode === d.id ? "opacity-70" : "text-slate-400"}`}>{d.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {duplexMode === "tdd" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    TDD DL:UL Slot Ratio — {tddDl}:{tddUl}
                  </label>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {[["8:2","8","2"],["7:3","7","3"],["6:4","6","4"],["5:5","5","5"],["4:6","4","6"]].map(([label, dl, ul]) => (
                      <button key={label}
                        onClick={() => { setTddDl(Number(dl)); setTddUl(Number(ul)); }}
                        className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                          tddDl === Number(dl) && tddUl === Number(ul)
                            ? "bg-cyan-600 text-white"
                            : "bg-slate-100 dark:bg-[#182333] text-slate-600 dark:text-slate-300"
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Scaling Factor (f) — {scalingFactor}
                  <span className="ml-2 font-normal text-slate-400">3GPP §4.1.2, Table 4.1.2-2</span>
                </label>
                <div className="flex gap-2">
                  {[1, 0.8, 0.75, 0.4].map((sf) => (
                    <button key={sf} onClick={() => setSF(sf)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        scalingFactor === sf ? "bg-cyan-600 text-white" : "bg-slate-100 dark:bg-[#182333] text-slate-600 dark:text-slate-300"
                      }`}>
                      {sf}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── RESULTS TAB ──────────────────────────────────────────────────── */}
      {activeTab === "results" && (
        <div className="space-y-4">
          {!result ? (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-700/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center">
              <span className="text-3xl">⚠️</span>
              <div className="font-bold text-sm text-amber-700 dark:text-amber-400">Invalid Parameter Combination</div>
              <div className="text-xs text-amber-600 dark:text-amber-500">
                The selected bandwidth ({bandwidth} MHz) and SCS ({scs} kHz) combination is not valid per 3GPP TS 38.101.
                Please go back and adjust the parameters.
              </div>
            </div>
          ) : (
            <>
              {/* Big Numbers */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "DL Peak Rate",       value: formatThroughput(result.dlPeak),       color: "text-cyan-600 dark:text-cyan-300",    bg: "bg-cyan-500/10",     border: "border-cyan-500/20" },
                  { label: "UL Peak Rate",        value: formatThroughput(result.ulPeak),       color: "text-emerald-600 dark:text-emerald-300",bg:"bg-emerald-500/10", border: "border-emerald-500/20" },
                  { label: "DL Effective Rate",   value: formatThroughput(result.dlEffective),  color: "text-blue-600 dark:text-blue-300",    bg: "bg-blue-500/10",     border: "border-blue-500/20" },
                  { label: "UL Effective Rate",   value: formatThroughput(result.ulEffective),  color: "text-violet-600 dark:text-violet-300",bg: "bg-violet-500/10",   border: "border-violet-500/20" },
                ].map((card) => (
                  <div key={card.label} className={`${card.bg} ${card.border} border rounded-2xl p-4 text-center`}>
                    <div className={`text-xl font-extrabold ${card.color} leading-none`}>{card.value}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-1.5">{card.label}</div>
                  </div>
                ))}
              </div>

              {/* Detail Table */}
              <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] shadow-sm overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-[#1a2740] bg-slate-50 dark:bg-[#111a27] flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Calculation Details</span>
                  <CopyButton text={summaryText} label="Copy Summary" />
                </div>
                <div className="divide-y divide-slate-100 dark:divide-[#1a2740]">
                  {[
                    { label: "Selected Band",         value: band.name },
                    { label: "Channel Bandwidth",     value: `${bandwidth} MHz` },
                    { label: "Numerology (μ)",        value: MU_CONFIG[mu]?.label },
                    { label: "Subcarrier Spacing",    value: `${scs} kHz` },
                    { label: "Available PRBs",        value: result.prbs },
                    { label: "Modulation",            value: MODULATIONS.find((m) => m.id === modId)?.label },
                    { label: "Code Rate",             value: MODULATIONS.find((m) => m.id === modId)?.codeRate.toFixed(4) },
                    { label: "DL MIMO Layers",        value: dlLayers },
                    { label: "UL MIMO Layers",        value: ulLayers },
                    { label: "Scaling Factor (f)",    value: scalingFactor },
                    { label: "Duplex Mode",           value: duplexMode.toUpperCase() },
                    { label: "TDD DL Efficiency",     value: duplexMode === "tdd" ? `${(dlEff * 100).toFixed(0)}% (${tddDl}:${tddUl} ratio)` : "N/A (FDD)" },
                    { label: "DL Spectral Efficiency",value: `${result.spectralEffDl.toFixed(2)} bps/Hz` },
                    { label: "UL Spectral Efficiency",value: `${result.spectralEffUl.toFixed(2)} bps/Hz` },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-[#182333] transition-colors">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{row.label}</span>
                      <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Throughput Bar */}
              <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm space-y-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Visual Throughput Comparison</div>
                {[
                  { label: "DL Peak",     value: result.dlPeak,      max: result.dlPeak,      color: "bg-cyan-500" },
                  { label: "DL Effective",value: result.dlEffective,  max: result.dlPeak,      color: "bg-blue-500" },
                  { label: "UL Peak",     value: result.ulPeak,      max: result.dlPeak,      color: "bg-emerald-500" },
                  { label: "UL Effective",value: result.ulEffective,  max: result.dlPeak,      color: "bg-violet-500" },
                ].map((bar) => (
                  <div key={bar.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">{bar.label}</span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white">{formatThroughput(bar.value)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-[#182333] overflow-hidden">
                      <div className={`h-full rounded-full ${bar.color} transition-all duration-500`}
                        style={{ width: `${Math.min(100, (bar.value / bar.max) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── FORMULA TAB ──────────────────────────────────────────────────── */}
      {activeTab === "formula" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-5 shadow-sm space-y-4">
            <div className="font-bold text-sm text-slate-900 dark:text-white">3GPP TS 38.214 §4.1.2 — NR Maximum Data Rate</div>

            <div className="p-4 rounded-xl bg-slate-900 dark:bg-[#0a0f1a] border border-slate-700 dark:border-[#2a3c53] font-mono text-xs leading-7 text-slate-300">
              <div className="text-cyan-400 text-[11px] mb-2">// Peak throughput formula</div>
              <div>Throughput = <span className="text-amber-300">v_layers</span> × <span className="text-violet-300">Q_m</span> × <span className="text-emerald-300">f</span> × <span className="text-rose-300">R_max</span></div>
              <div className="pl-16">× <span className="text-cyan-300">N_PRB</span> × 12 × <span className="text-yellow-300">OH_factor</span></div>
              <div className="pl-16">× <span className="text-pink-300">(slots/s)</span> × 14</div>
              <div className="mt-3 text-[10px] text-slate-500 border-t border-slate-700 pt-3 space-y-1">
                <div><span className="text-amber-300">v_layers</span> = Number of MIMO spatial layers</div>
                <div><span className="text-violet-300">Q_m</span>     = Modulation order (2=QPSK, 4=16QAM, 6=64QAM, 8=256QAM)</div>
                <div><span className="text-emerald-300">f</span>       = Scaling factor (1, 0.8, 0.75, or 0.4)</div>
                <div><span className="text-rose-300">R_max</span>  = Code rate (e.g. 948/1024 for 256-QAM)</div>
                <div><span className="text-cyan-300">N_PRB</span>  = Number of available Physical Resource Blocks</div>
                <div>12       = Subcarriers per PRB</div>
                <div><span className="text-yellow-300">OH</span>     = 1 − overhead (DMRS + PDCCH + SSB + PBCH...)</div>
                <div><span className="text-pink-300">slots/s</span>  = 1000 / slot_duration_ms (e.g. 2000 for μ=1)</div>
                <div>14       = OFDM symbols per normal slot</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: "Overhead Factors (DL)", items: [["DMRS", "14.3%"], ["PDCCH", "4.3%"], ["SSS/PSS", "2.0%"], ["PBCH", "0.7%"]] },
              { title: "Overhead Factors (UL)", items: [["DMRS", "14.3%"], ["PUCCH", "2.0%"]] },
              { title: "Numerology (SCS)",     items: [["μ=0", "15 kHz, 1ms slots"], ["μ=1", "30 kHz, 0.5ms"], ["μ=2", "60 kHz, 0.25ms"], ["μ=3", "120 kHz, 0.125ms"]] },
            ].map((box) => (
              <div key={box.title} className="bg-slate-50 dark:bg-[#111a27] rounded-xl border border-slate-200 dark:border-[#223247] p-3">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-2">{box.title}</div>
                {box.items.map(([k, v]) => (
                  <div key={k} className="flex justify-between text-[11px] py-0.5">
                    <span className="font-mono text-cyan-600 dark:text-cyan-400">{k}</span>
                    <span className="text-slate-600 dark:text-slate-400">{v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
