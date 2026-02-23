import React, { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Shield } from "lucide-react";
import { calculateBrawlerPrice } from "../PriceCalculator";

const MAX_TROPHIES = 2000;
const STEP = 50;

function TrophyInput({ label, value, onChange, min, max }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-slate-300">{label}</span>
        <span className="text-sm font-bold text-purple-400">{value.toLocaleString()} 🏆</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={STEP}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-purple-500"
      />
      <div className="flex justify-between text-xs text-slate-600 mt-1">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function BrawlerCalculator({ onPriceChange }) {
  const [current, setCurrent] = useState(0);
  const [desired, setDesired] = useState(100);

  const price = calculateBrawlerPrice(current, desired);

  React.useEffect(() => { onPriceChange?.(price, current, desired); }, [price]);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
        <h3 className="text-lg font-bold text-white">Select Trophy Range</h3>
        <TrophyInput
          label="Current Trophies"
          value={current}
          onChange={v => { setCurrent(v); if (desired <= v) setDesired(Math.min(v + STEP, MAX_TROPHIES)); }}
          min={0}
          max={MAX_TROPHIES - STEP}
        />
        <TrophyInput
          label="Desired Trophies"
          value={desired}
          onChange={v => setDesired(v)}
          min={current + STEP}
          max={MAX_TROPHIES}
        />
      </div>

      <motion.div
        key={price}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6"
      >
        <div className="text-center mb-6">
          <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">Your Price</p>
          {price > 0 ? (
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-sm text-slate-400">$</span>
              <span className="text-5xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                {price.toFixed(2)}
              </span>
              <span className="text-sm text-slate-500 ml-1">USD</span>
            </div>
          ) : (
            <p className="text-slate-500 text-lg">Select a higher desired trophy count</p>
          )}
        </div>
        {price > 0 && (
          <div className="flex items-center justify-center gap-3 mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm font-semibold text-slate-300">
            {current.toLocaleString()} 🏆 → {desired.toLocaleString()} 🏆
          </div>
        )}
        {price > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: DollarSign, label: "Total Price", value: `$${price.toFixed(2)}` },
              { icon: Shield, label: "Guarantee", value: "100%" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 rounded-xl bg-white/[0.03]">
                <stat.icon className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <p className="text-xs text-slate-500">{stat.label}</p>
                <p className="text-sm font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}