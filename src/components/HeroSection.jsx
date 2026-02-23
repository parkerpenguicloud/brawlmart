import React from "react";
import { motion } from "framer-motion";
import { Zap, Shield, TrendingUp } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-28 px-6">
      {/* Background effects */}
        <div className="absolute inset-0">
          <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/c0dc293da_image.png" alt="background" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a]/60 via-[#150a2a]/40 to-[#0a0a1a]" />
        </div>
      
      <div className="relative max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8">
            <Zap className="w-3.5 h-3.5" />
            #1 Rated Boosting Service
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1]">
            Dominate The
            <motion.span
              className="block bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600 bg-clip-text text-transparent relative"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              <span
                className="absolute inset-0 block bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-700 bg-clip-text text-transparent blur-2xl opacity-60 select-none pointer-events-none"
                aria-hidden="true"
              >
                Competition
              </span>
              Competition
            </motion.span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Professional progression services trusted by thousands of players. From high level rank pushes to trophy grinds, placements, carries, and full account development.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 ml-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {[
            { icon: Shield, label: "100% Secure", sub: "Account safety guaranteed" },
            { icon: TrendingUp, label: "Fast Completion", sub: "Average 24hr completion" },
            { icon: Zap, label: "Pro Players", sub: "Top 0.1% boosters" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3 text-left flex-1">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <item.icon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{item.label}</p>
                <p className="text-slate-500 text-xs">{item.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}