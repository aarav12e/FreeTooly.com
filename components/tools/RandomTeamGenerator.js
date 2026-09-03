"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function RandomTeamGenerator() {
  const [names, setNames] = useState("");
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState([]);

  function generate() {
    const list = names.split("\n").map((n) => n.trim()).filter(Boolean);
    if (list.length === 0) {
      setTeams([]);
      return;
    }
    const shuffled = shuffle(list);
    const count = Math.min(Math.max(teamCount, 1), list.length);
    const result = Array.from({ length: count }, () => []);
    shuffled.forEach((name, i) => {
      result[i % count].push(name);
    });
    setTeams(result);
  }

  const output = teams.map((team, i) => `Team ${i + 1}: ${team.join(", ")}`).join("\n");

  return (
    <div>
      <textarea
        className="tool-input"
        rows={6}
        placeholder="Enter one name per line..."
        value={names}
        onChange={(e) => setNames(e.target.value)}
      />
      <div className="flex items-center gap-3 mt-3">
        <label className="text-sm text-slate-600">Number of teams</label>
        <input
          type="number"
          min={1}
          value={teamCount}
          onChange={(e) => setTeamCount(Number(e.target.value))}
          className="border border-slate-200 rounded-lg px-3 py-2 w-24"
        />
        <button type="button" className="btn-primary text-sm" onClick={generate}>
          Generate Teams
        </button>
      </div>
      {teams.length > 0 && (
        <div className="mt-4">
          {teams.map((team, i) => (
            <div key={i} className="mb-2">
              <span className="font-semibold text-brand-600">Team {i + 1}:</span>{" "}
              <span className="text-slate-700">{team.join(", ")}</span>
            </div>
          ))}
          <div className="mt-2">
            <CopyButton text={output} />
          </div>
        </div>
      )}
    </div>
  );
}
