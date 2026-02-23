import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const RANK_IMAGES = {
  diamond: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/71cc468ce_image.png",
  mythic: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/1056ba9c5_image.png",
  legendary: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/8567a1357_image.png",
  masters: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/cd7b51950_image.png",
  pro: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/414dce2a4_image.png",
};

// Brawl Stars ranked tiers
export const RANKS = [
  { id: "D1", label: "Diamond 1", tier: 1, color: "#00BFFF", bg: "from-cyan-400/30 to-cyan-600/10", img: RANK_IMAGES.diamond },
  { id: "D2", label: "Diamond 2", tier: 2, color: "#00BFFF", bg: "from-cyan-400/30 to-cyan-600/10", img: RANK_IMAGES.diamond },
  { id: "D3", label: "Diamond 3", tier: 3, color: "#00BFFF", bg: "from-cyan-400/30 to-cyan-600/10", img: RANK_IMAGES.diamond },
  { id: "M1", label: "Mythic 1", tier: 4, color: "#d946ef", bg: "from-fuchsia-500/30 to-fuchsia-700/10", img: RANK_IMAGES.mythic },
  { id: "M2", label: "Mythic 2", tier: 5, color: "#d946ef", bg: "from-fuchsia-500/30 to-fuchsia-700/10", img: RANK_IMAGES.mythic },
  { id: "M3", label: "Mythic 3", tier: 6, color: "#d946ef", bg: "from-fuchsia-500/30 to-fuchsia-700/10", img: RANK_IMAGES.mythic },
  { id: "L1", label: "Legendary 1", tier: 7, color: "#ef4444", bg: "from-red-500/30 to-red-700/10", img: RANK_IMAGES.legendary },
  { id: "L2", label: "Legendary 2", tier: 8, color: "#ef4444", bg: "from-red-500/30 to-red-700/10", img: RANK_IMAGES.legendary },
  { id: "L3", label: "Legendary 3", tier: 9, color: "#ef4444", bg: "from-red-500/30 to-red-700/10", img: RANK_IMAGES.legendary },
  { id: "MA1", label: "Masters 1", tier: 10, color: "#EAB308", bg: "from-yellow-500/30 to-yellow-700/10", img: RANK_IMAGES.masters },
  { id: "MA2", label: "Masters 2", tier: 11, color: "#EAB308", bg: "from-yellow-500/30 to-yellow-700/10", img: RANK_IMAGES.masters },
  { id: "MA3", label: "Masters 3", tier: 12, color: "#EAB308", bg: "from-yellow-500/30 to-yellow-700/10", img: RANK_IMAGES.masters },
  { id: "PRO", label: "Pro", tier: 13, color: "#f59e0b", bg: "from-amber-500/30 to-amber-700/10", img: RANK_IMAGES.pro },
];

// For legacy compatibility
export const DIVISIONS = [];

function RankButton({ rank, isSelected, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative flex items-center gap-2 w-full p-3 rounded-xl border transition-all duration-200 ${
        disabled ? "opacity-30 cursor-not-allowed" :
        isSelected
          ? "border-purple-500/50 bg-purple-500/10 shadow-lg shadow-purple-500/5"
          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
      }`}
    >
      <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
        {rank.img ? (
          <img src={rank.img} alt={rank.label} className="w-8 h-8 object-contain" />
        ) : (
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${rank.bg} flex items-center justify-center border border-white/10`}>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: rank.color, boxShadow: `0 0 10px ${rank.color}60` }} />
          </div>
        )}
      </div>
      <span className={`font-semibold text-xs ${isSelected ? "text-white" : "text-slate-300"}`}>
        {rank.label}
      </span>
      {isSelected && (
        <div className="absolute right-2.5 w-2 h-2 rounded-full bg-purple-400" />
      )}
    </button>
  );
}

export default function RankSelector({ currentRank, setCurrentRank, desiredRank, setDesiredRank }) {
  const currentIndex = RANKS.findIndex(r => r.id === currentRank);

  return (
    <div className="space-y-8">
      {/* Current Rank */}
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Your Current Rank</h3>
        <p className="text-sm text-slate-500 mb-4">Select where you are now</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {RANKS.map((rank, i) => (
            <RankButton
              key={rank.id}
              rank={rank}
              isSelected={currentRank === rank.id}
              disabled={rank.id === "PRO"}
              onClick={() => {
                setCurrentRank(rank.id);
                // Reset desired if it's now lower or equal
                const di = RANKS.findIndex(r => r.id === desiredRank);
                if (di <= i) {
                  const next = RANKS[Math.min(i + 1, RANKS.length - 1)];
                  setDesiredRank(next.id);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center">
        <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20">
          <ArrowRight className="w-6 h-6 text-purple-400 rotate-90 sm:rotate-0" />
        </div>
      </div>

      {/* Desired Rank */}
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Desired Rank</h3>
        <p className="text-sm text-slate-500 mb-4">Select where you want to be</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {RANKS.map((rank, i) => (
            <RankButton
              key={rank.id}
              rank={rank}
              isSelected={desiredRank === rank.id}
              disabled={i <= currentIndex}
              onClick={() => setDesiredRank(rank.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}