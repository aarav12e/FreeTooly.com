"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState([]);

  function generate() {
    const list = Array.from({ length: Math.min(Math.max(count, 1), 100) }, () =>
      crypto.randomUUID()
    );
    setUuids(list);
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <label className="text-sm text-slate-600">How many?</label>
        <input
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="border border-slate-200 rounded-lg px-3 py-2 w-24"
        />
        <button type="button" className="btn-primary text-sm" onClick={generate}>
          Generate
        </button>
      </div>
      {uuids.length > 0 && (
        <div className="mt-4">
          <textarea className="tool-output" rows={Math.min(uuids.length, 12)} readOnly value={uuids.join("\n")} />
          <div className="mt-2">
            <CopyButton text={uuids.join("\n")} />
          </div>
        </div>
      )}
    </div>
  );
}
