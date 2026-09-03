"use client";

import { useState } from "react";

const KG_TO_LBS = 2.2046226218;

export default function WeightConverter() {
  const [kg, setKg] = useState(1);
  const [lbs, setLbs] = useState(kg * KG_TO_LBS);

  function handleKgChange(v) {
    const num = Number(v);
    setKg(num);
    setLbs(num * KG_TO_LBS);
  }

  function handleLbsChange(v) {
    const num = Number(v);
    setLbs(num);
    setKg(num / KG_TO_LBS);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center">
      <div>
        <label className="text-sm text-slate-600 block mb-1">Kilograms</label>
        <input
          type="number"
          value={kg}
          onChange={(e) => handleKgChange(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 w-40"
        />
      </div>
      <span className="text-slate-400 mt-5">=</span>
      <div>
        <label className="text-sm text-slate-600 block mb-1">Pounds</label>
        <input
          type="number"
          value={lbs}
          onChange={(e) => handleLbsChange(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 w-40"
        />
      </div>
    </div>
  );
}
