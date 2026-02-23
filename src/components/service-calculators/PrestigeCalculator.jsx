import React, { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Shield } from "lucide-react";
import { PRESTIGE_SINGLE, PRESTIGE_BULK } from "../PriceCalculator";

export default function PrestigeCalculator({ onPriceChange }) {
  const [quantity, setQuantity] = useState(1);
  const isBulk = quantity >= 3;
  const price = quantity * (isBulk ? PRESTIGE_BULK : PRESTIGE_SINGLE);

  React.useEffect(() => { onPriceChange?.(price, quantity); }, [price]);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
        <h3 className="text-lg font-bold text-white">Select Prestige Count</h3>

        {/* Initial buttons - single vs bulk */}
        {quantity < 3 && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setQuantity(1)}
              className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                quantity === 1
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                  : "border-white/10 bg-white/[0.02] text-slate-300 hover:border-cyan-500/30"
              }`}
            >
              Single<br/><span className="text-sm">${PRESTIGE_SINGLE}</span>
            </button>
            <button
              onClick={() => setQuantity(3)}
              className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                isBulk
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                  : "border-white/10 bg-white/[0.02] text-slate-300 hover:border-cyan-500/30"
              }`}
            >
              Bulk (3+)<br/><span className="text-sm">${PRESTIGE_BULK}/ea</span>
            </button>
          </div>
        )}

        {/* Slider for 3+ prestiges */}
        {isBulk && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-300">Number of Prestiges</span>
              <span className="text-sm font-bold text-cyan-400">{quantity}</span>
            </div>
            <input
              type="range"
              min={3}
              max={10}
              step={1}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>3</span><span>10</span>
            </div>
            <button
              onClick={() => setQuantity(1)}
              className="w-full mt-4 p-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-semibold hover:bg-cyan-500/20 transition-all"
            >
              ← Back to single
            </button>
          </div>
        )}
      </div>

      <motion.div
        key={price}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6"
      >
        <div className="flex flex-col items-center mb-6">
          <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">Your Price</p>
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-slate-400">$</span>
            <span className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              {price.toFixed(2)}
            </span>
            <span className="text-sm text-slate-500 ml-1">USD</span>
          </div>
          {isBulk && <p className="text-xs text-cyan-400 mt-2">Bulk discount applied!</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: DollarSign, label: "Total Price", value: `$${price.toFixed(2)}` },
            { icon: Shield, label: "Guarantee", value: "100%" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 rounded-xl bg-white/[0.03]">
              <stat.icon className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className="text-sm font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}