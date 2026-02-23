import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { ArrowRight } from "lucide-react";

const SERVICE_IMAGES = {
  ranked: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/df5bd3ab1_image-removebg-preview.png",
  brawler: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/255e63843_image-removebg-preview1.png",
  trophies: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/e669ec30e_image-removebg-preview2.png",
  matcherino: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/68d6f3ca3_image-removebg-preview__3_-removebg-preview1.png",
  winstreak: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/30dfa89aa_image-removebg-preview4.png",
  prestige: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/623c221ee_image-removebg-preview5.png",
};

const IMAGE_SIZES = {
  ranked: "w-16 h-16",
  brawler: "w-16 h-16",
  trophies: "w-16 h-16",
  matcherino: "w-20 h-20",
  winstreak: "w-20 h-20",
  prestige: "w-24 h-24",
};

// Burst particle that originates from the logo center and flies outward
function BurstParticle({ angle, distance, delay, duration, children }) {
  const rad = (angle * Math.PI) / 180;
  const tx = Math.cos(rad) * distance;
  const ty = Math.sin(rad) * distance;

  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      // logo is roughly at top-left: left~40px, top~40px inside p-8 card
      style={{ left: 68, top: 40, translateX: "-50%", translateY: "-50%" }}
      initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: [0, tx * 0.4, tx],
        y: [0, ty * 0.4, ty],
        scale: [0.5, 1, 0.8],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

function makeParticles(count, renderChild, opts = {}) {
  const { distMin = 30, distMax = 70, dur = 2.6 } = opts;
  return Array.from({ length: count }).map((_, i) => {
    const angle = (360 / count) * i + (Math.random() * 20 - 10);
    const distance = distMin + Math.random() * (distMax - distMin);
    return { angle, distance, delay: (i / count) * dur, duration: dur, index: i };
  });
}

function RankedEffect() {
  const labels = ["+ELO", "+ELO", "+ELO", "+ELO", "+ELO", "+ELO", "+ELO", "+ELO", "+ELO", "+ELO", "+ELO", "+ELO"];
  const particles = makeParticles(12, null, { distMin: 25, distMax: 65, dur: 2.8 });
  return (
    <>
      {particles.map((p, i) => (
        <BurstParticle key={i} angle={p.angle} distance={p.distance} delay={p.delay} duration={p.duration}>
          <span className="text-[10px] font-bold text-purple-400/90">{labels[i % labels.length]}</span>
        </BurstParticle>
      ))}
    </>
  );
}

function WinstreakEffect() {
  const particles = makeParticles(12, null, { distMin: 25, distMax: 60, dur: 2.6 });
  return (
    <>
      {particles.map((p, i) => (
        <BurstParticle key={i} angle={p.angle} distance={p.distance} delay={p.delay} duration={p.duration}>
          <span className="text-sm" style={{ filter: "hue-rotate(260deg) saturate(3) brightness(1.3)" }}>🔥</span>
        </BurstParticle>
      ))}
    </>
  );
}

function MatcherinoEffect() {
  const particles = makeParticles(12, null, { distMin: 25, distMax: 60, dur: 1.9 });
  return (
    <>
      {particles.map((p, i) => (
        <BurstParticle key={i} angle={p.angle} distance={p.distance} delay={p.delay} duration={p.duration}>
          <span className="text-[11px] text-purple-400/90">♥</span>
        </BurstParticle>
      ))}
    </>
  );
}

function TrophiesEffect() {
  const shapes = ["●", "■", "▲", "◆"];
  const colors = ["text-purple-400", "text-violet-400", "text-fuchsia-400", "text-purple-300"];
  const particles = makeParticles(12, null, { distMin: 25, distMax: 65, dur: 1.7 });
  return (
    <>
      {particles.map((p, i) => (
        <BurstParticle key={i} angle={p.angle} distance={p.distance} delay={p.delay} duration={p.duration}>
          <span className={`text-[9px] ${colors[i % colors.length]}`}>{shapes[i % shapes.length]}</span>
        </BurstParticle>
      ))}
    </>
  );
}

function PrestigeEffect() {
  const nums = ["1", "99", "7", "42", "13", "88", "5", "77", "3", "66", "9", "100"];
  const particles = makeParticles(12, null, { distMin: 25, distMax: 65, dur: 2 });
  return (
    <>
      {particles.map((p, i) => (
        <BurstParticle key={i} angle={p.angle} distance={p.distance} delay={p.delay} duration={p.duration}>
          <span className="text-[10px] font-bold text-purple-400/90">{nums[i % nums.length]}</span>
        </BurstParticle>
      ))}
    </>
  );
}

function BrawlerEffect() {
  const labels = ["+10", "+8", "+10", "+8", "+10", "+8", "+10", "+8", "+10", "+8", "+10", "+8"];
  const particles = makeParticles(12, null, { distMin: 25, distMax: 65, dur: 1.9 });
  return (
    <>
      {particles.map((p, i) => (
        <BurstParticle key={i} angle={p.angle} distance={p.distance} delay={p.delay} duration={p.duration}>
          <span className="text-[10px] font-bold text-purple-400/90">{labels[i % labels.length]}</span>
        </BurstParticle>
      ))}
    </>
  );
}

function CardEffect({ id }) {
  if (id === "ranked") return <RankedEffect />;
  if (id === "brawler") return <BrawlerEffect />;
  if (id === "winstreak") return <WinstreakEffect />;
  if (id === "matcherino") return <MatcherinoEffect />;
  if (id === "trophies") return <TrophiesEffect />;
  if (id === "prestige") return <PrestigeEffect />;
  return null;
}

export default function ServiceCard({ service, index }) {
  const { id, title, description, icon: Icon, startingPrice, gradient, popular } = service;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={createPageUrl("ServiceDetail") + `?service=${id}`}>
        <div className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden hover:border-purple-500/40 transition-all duration-500 cursor-pointer">
          {popular && (
            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold uppercase tracking-wider">
              Popular
            </div>
          )}

          {/* Glow effect on hover */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${gradient} blur-xl`} style={{ opacity: 0 }} />
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500 bg-gradient-to-br ${gradient}`} />

          {/* Floating particles */}
          <CardEffect id={id} />

          <div className="relative p-8 flex flex-col h-full">
            {SERVICE_IMAGES[id] ? (
              <div className="mb-6 w-fit">
                <img
                  src={SERVICE_IMAGES[id]}
                  alt={title}
                  className={`${IMAGE_SIZES[id]} object-contain`}
                  style={{
                    transform: id === "ranked" ? "rotate(-12deg)" : id === "winstreak" ? "rotate(8deg)" : id === "trophies" ? "rotate(-8deg)" : "none",
                    filter: (id === "matcherino" || id === "brawler" || id === "ranked") ? "brightness(1.4) saturate(1.2)" : "none"
                  }}
                />
              </div>
            ) : (
              <div className={`inline-flex p-3.5 rounded-2xl bg-gradient-to-br ${gradient} mb-6 w-fit`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
            )}

            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">{description}</p>

            <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Starting at</span>
                <p className="text-2xl font-black text-white">${startingPrice}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 group-hover:bg-purple-500/20 transition-colors duration-300">
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors duration-300 group-hover:translate-x-0.5 transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}