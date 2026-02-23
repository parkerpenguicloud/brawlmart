import React from "react";

const BREAKPOINTS = [12, 20, 30, 40, 50, 60, 70, 80, 90];

export default function Power11Selector({ count, onChange, label = "Power 11 Brawlers", description = "How many Power 11 brawlers do you have? This affects pricing for Masters and above." }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">{label}</h3>
        <p className="text-sm text-slate-500 mt-1">
          {description}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-slate-300">Count</span>
        <span className="text-lg font-black text-yellow-400">{count}</span>
      </div>
      <input
        type="range"
        min={12}
        max={90}
        step={1}
        value={count}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-yellow-500"
      />
      <div className="flex justify-between text-xs text-slate-600">
        <span>12</span><span>90</span>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {BREAKPOINTS.map(bp => (
          <button
            key={bp}
            onClick={() => onChange(bp)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              count >= bp && (BREAKPOINTS.indexOf(bp) === BREAKPOINTS.length - 1 || count < BREAKPOINTS[BREAKPOINTS.indexOf(bp) + 1])
                ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
                : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20"
            }`}
          >
            {bp}+
          </button>
        ))}
      </div>
    </div>
  );
}