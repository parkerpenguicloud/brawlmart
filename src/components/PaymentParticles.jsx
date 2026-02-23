import React from "react";
import { motion } from "framer-motion";

const Particle = ({ delay, duration, color }) => {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${color}`}
      style={{
        width: Math.random() * 8 + 2,
        height: Math.random() * 8 + 2,
      }}
      initial={{
        x: 0,
        y: 0,
        opacity: 0.6,
      }}
      animate={{
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        opacity: 0,
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
};

export function PayPalParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      {[...Array(4)].map((_, i) => (
        <Particle
          key={i}
          delay={i * 0.3}
          duration={2}
          color="bg-blue-400/50"
        />
      ))}
    </div>
  );
}

export function ApplePayParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      {[...Array(4)].map((_, i) => (
        <Particle
          key={i}
          delay={i * 0.3}
          duration={2}
          color="bg-slate-300/70"
        />
      ))}
    </div>
  );
}

export function PaymentParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 3 + Math.random() * 2,
    delay: Math.random() * 0.5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 w-screen h-screen">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            opacity: 0.6,
          }}
          animate={{
            x: `${particle.x + (Math.random() - 0.5) * 30}%`,
            y: `${particle.y - 50}%`,
            opacity: 0,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}