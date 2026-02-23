import React from "react";
import { motion } from "framer-motion";
import { RANKS } from "./RankSelector";
import { DollarSign, Shield, AlertCircle } from "lucide-react";

// ── Ranked ──────────────────────────────────────────────────────────────────
const RANKED_STEP_PRICES = {
  "D1-D2": 2,  "D2-D3": 2,  "D3-M1": 3,
  "M1-M2": 4,  "M2-M3": 5,  "M3-L1": 6,
  "L1-L2": 7,  "L2-L3": 10, "L3-MA1": 13,
  "MA1-MA2": 35,"MA2-MA3": 85,"MA3-PRO": 150,
};

export function calculateRankedPrice(currentRank, desiredRank, p11Count = 0) {
  return calculateRankedPriceWithBrawlers(currentRank, desiredRank, p11Count);
}

// Legacy alias used by ServiceDetail
export function calculatePrice(currentRank, _cd, desiredRank, _dd, p11Count = 0) {
  return calculateRankedPriceWithBrawlers(currentRank, desiredRank, p11Count);
}

// ── Brawler (per brawler trophies) ─────────────────────────────────────────
const BRAWLER_TIERS = [
  [0, 750, 1],
  [750, 900, 1.25],
  [900, 1000, 1.5],
  [1000, 1100, 2],
  [1100, 1200, 2.25],
  [1200, 1300, 2.5],
  [1300, 1400, 2.75],
  [1400, 1500, 3.25],
  [1500, 1600, 3.75],
  [1600, 1700, 4.25],
  [1700, 1800, 5.25],
  [1800, 1900, 5.75],
  [1900, 2000, 6.25],
];

export function calculateBrawlerPrice(from, to) {
  if (to <= from) return 0;
  let total = 0;
  for (const [min, max, pricePerFifty] of BRAWLER_TIERS) {
    if (from >= max) continue;
    if (to <= min) break;
    const segFrom = Math.max(from, min);
    const segTo = Math.min(to, max);
    total += ((segTo - segFrom) / 50) * pricePerFifty;
  }
  return total;
}

// ── Trophies (global) ───────────────────────────────────────────────────────
const TROPHY_TIERS = [
  [0, 10000, 6],
  [10000, 20000, 8],
  [20000, 30000, 12],
  [30000, 40000, 14],
  [40000, 50000, 15],
  [50000, 60000, 16],
  [60000, 70000, 20],
  [70000, 80000, 22],
  [80000, 90000, 24],
  [90000, 100000, 30],
  [100000, 125000, 36],
  [125000, 150000, 40],
];

export function calculateTrophyPrice(from, to) {
  if (to <= from) return 0;
  let total = 0;
  for (const [min, max, pricePerK] of TROPHY_TIERS) {
    if (from >= max) continue;
    if (to <= min) break;
    const segFrom = Math.max(from, min);
    const segTo = Math.min(to, max);
    total += ((segTo - segFrom) / 1000) * pricePerK;
  }
  return total;
}

// ── Ranked Brawler-based pricing (Masters steps) ───────────────────────────
// Keys: number of Power 11 brawlers. Value: price for that step.
export const RANKED_BRAWLER_PRICES = {
  "MA1-MA2": { 12: 30, 20: 30, 30: 30, 40: 30, 50: 30, 60: 30, 70: 30, 80: 30, 90: 30 },
  "MA2-MA3": { 12: 60, 20: 60, 30: 60, 40: 60, 50: 60, 60: 60, 70: 60, 80: 60, 90: 60 },
  "MA3-PRO": { 12: 105, 20: 105, 30: 105, 40: 105, 50: 105, 60: 105, 70: 105, 80: 105, 90: 105 },
};

const BRAWLER_BREAKPOINTS = [12, 20, 30, 40, 50, 60, 70, 80, 90];

export function getBrawlerBreakpoint(count) {
  // Return the highest breakpoint <= count
  let bp = 12;
  for (const b of BRAWLER_BREAKPOINTS) {
    if (count >= b) bp = b;
  }
  return bp;
}

export function calculateRankedPriceWithBrawlers(currentRank, desiredRank, p11Count) {
  const ci = RANKS.findIndex(r => r.id === currentRank);
  const di = RANKS.findIndex(r => r.id === desiredRank);
  if (di <= ci) return 0;
  const bp = getBrawlerBreakpoint(p11Count);
  let total = 0;
  for (let step = ci; step < di; step++) {
    const key = `${RANKS[step].id}-${RANKS[step + 1].id}`;
    if (RANKED_BRAWLER_PRICES[key]) {
      total += RANKED_BRAWLER_PRICES[key][bp] || 0;
    } else {
      total += RANKED_STEP_PRICES[key] || 0;
    }
  }
  return total;
}

// ── Winstreak ───────────────────────────────────────────────────────────────
export const WINSTREAK_TIERS = [
  { wins: 50, price: 23 },
  { wins: 69, price: 33 },
  { wins: 101, price: 51 },
  { wins: 111, price: 63 },
  { wins: 125, price: 77 },
  { wins: 200, price: 115 },
];

// ── Prestige ────────────────────────────────────────────────────────────────
export const PRESTIGE_SINGLE = 35;
export const PRESTIGE_BULK = 30;

// ── Matcherino ──────────────────────────────────────────────────────────────
export const MATCHERINO_TIERS = [
  { label: "60-70 Brawlers", price: 290 },
  { label: "70-80 Brawlers", price: 270 },
  { label: "80+ Brawlers", price: 250 },
];

// ── Default PriceCalculator (Ranked) ───────────────────────────────────────
export default function PriceCalculator({ currentRank, currentDivision, desiredRank, desiredDivision, p11Count = 0 }) {
  const price = calculatePrice(currentRank, currentDivision, desiredRank, desiredDivision, p11Count);
  const currentRankObj = RANKS.find(r => r.id === currentRank);
  const desiredRankObj = RANKS.find(r => r.id === desiredRank);
  const isMastersOrAbove = ["MA1", "MA2", "MA3", "PRO"].includes(desiredRank);

  return (
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
            <span className="text-5xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {price.toFixed(2)}
            </span>
            <span className="text-sm text-slate-500 ml-1">USD</span>
          </div>
        ) : (
          <p className="text-slate-500 text-lg">Select a higher desired rank</p>
        )}
      </div>

      {price > 0 && (
        <div className="flex items-center justify-center gap-3 mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentRankObj?.color }} />
            <span className="text-sm font-semibold text-slate-300">{currentRankObj?.label}</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: desiredRankObj?.color }} />
            <span className="text-sm font-semibold text-slate-300">{desiredRankObj?.label}</span>
          </div>
        </div>
      )}



      {price > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: DollarSign, label: "Total Price", value: `$${price.toFixed(2)}` },
            { icon: Shield, label: "Guarantee", value: "100%" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 rounded-xl bg-white/[0.03]">
              <stat.icon className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className="text-sm font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}