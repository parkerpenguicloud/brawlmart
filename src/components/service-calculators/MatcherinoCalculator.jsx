import React, { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Shield } from "lucide-react";
import { MATCHERINO_TIERS } from "../PriceCalculator";

export default function MatcherinoCalculator({ onPriceChange }) {
  const [selected, setSelected] = useState(null);
  const price = selected !== null ? MATCHERINO_TIERS[selected].price : 0;

  React.useEffect(() => { onPriceChange?.(price, selected); }, [price]);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">Select Your Brawler Range</h3>
        <p className="text-sm text-slate-500">Price is for a full session with an elite coach.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MATCHERINO_TIERS.map((tier, i) => (
            <button
              key={tier.label}
              onClick={() => setSelected(i)}
              className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                selected === i
                  ? "border-violet-500/50 bg-violet-500/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <p className="text-sm font-semibold text-white">{tier.label}</p>
              <p className="text-xl font-black text-violet-400 mt-2">${tier.price}</p>
            </button>
          ))}
        </div>
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
              <span className="text-5xl font-black bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                {price.toFixed(2)}
              </span>
              <span className="text-sm text-slate-500 ml-1">USD</span>
            </div>
          ) : (
            <p className="text-slate-500 text-lg">Select a brawler range above</p>
          )}
        </div>
        {price > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: DollarSign, label: "Total Price", value: `$${price.toFixed(2)}` },
              { icon: Shield, label: "Guarantee", value: "100%" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 rounded-xl bg-white/[0.03]">
                <stat.icon className="w-4 h-4 text-violet-400 mx-auto mb-1" />
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