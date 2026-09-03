"use client";

import { useMemo, useState } from "react";

const TO_METERS = {
  meter: 1,
  kilometer: 1000,
  centimeter: 0.01,
  millimeter: 0.001,
  mile: 1609.344,
  yard: 0.9144,
  foot: 0.3048,
  inch: 0.0254,
};

export default function LengthConverter() {
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState("meter");
  const [to, setTo] = useState("foot");

  const result = useMemo(() => {
    const meters = value * TO_METERS[from];
    return meters / TO_METERS[to];
  }, [value, from, to]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-32"
        />
        <select value={from} onChange={(e) => setFrom(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-40">
          {Object.keys(TO_METERS).map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <span className="text-slate-400">→</span>
        <select value={to} onChange={(e) => setTo(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-40">
          {Object.keys(TO_METERS).map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-5 text-xl font-bold text-brand-600">
        {value} {from} = {result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {to}
      </div>
    </div>
  );
}
