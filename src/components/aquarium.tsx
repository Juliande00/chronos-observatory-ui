import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Severity = "ok" | "warn" | "critical";

const CREATURES = [
  { id: "health", emoji: "🐟", color: "text-cyan-300", label: "Health Fish", top: 18, dur: 38, delay: 0, size: "text-3xl" },
  { id: "guardian", emoji: "🐠", color: "text-amber-200", label: "Safety Guardian", top: 32, dur: 46, delay: 4, size: "text-2xl" },
  { id: "predator", emoji: "🦈", color: "text-rose-400", label: "Risk Predator", top: 55, dur: 28, delay: 2, size: "text-4xl" },
  { id: "jelly", emoji: "🪼", color: "text-violet-300", label: "Drift Jellyfish", top: 70, dur: 52, delay: 6, size: "text-2xl" },
  { id: "eel", emoji: "🐍", color: "text-emerald-300", label: "Endpoint Eel", top: 80, dur: 34, delay: 1, size: "text-2xl" },
  { id: "ray", emoji: "🥏", color: "text-lime-300", label: "XGBoost Ray", top: 45, dur: 50, delay: 8, size: "text-2xl" },
  { id: "lantern", emoji: "💡", color: "text-blue-300", label: "Hermes Lantern", top: 25, dur: 42, delay: 10, size: "text-xl" },
  { id: "squid", emoji: "🦑", color: "text-amber-300", label: "CandleSight Squid", top: 60, dur: 44, delay: 5, size: "text-2xl" },
  { id: "swarm", emoji: "🐡", color: "text-orange-400", label: "Battle Swarm", top: 38, dur: 30, delay: 3, size: "text-xl" },
  { id: "whale", emoji: "🐋", color: "text-blue-400", label: "Memory Whale", top: 85, dur: 65, delay: 12, size: "text-5xl" },
] as const;

export const AQUARIUM_RESIDENTS = CREATURES.map((c) => ({
  id: c.id,
  emoji: c.emoji,
  label: c.label,
  represents: {
    health: "API & Endpoint Health",
    guardian: "Safety Locks & Auth Integrity",
    predator: "Active Risk / Safety Violation",
    jelly: "Drift Detection between systems",
    eel: "Endpoint Latency",
    ray: "XGBoost Shadow Model",
    lantern: "Hermes Bias Layer",
    squid: "CandleSight Pattern Engine",
    swarm: "Battle Arena Strategy Swarm",
    whale: "Long-term Memory Store",
  }[c.id],
}));

export function useAquariumToggle() {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    const v = typeof window !== "undefined" ? localStorage.getItem("mirofish.aquarium") : null;
    if (v !== null) setEnabled(v === "1");
  }, []);
  const toggle = () => {
    setEnabled((e) => {
      const next = !e;
      try { localStorage.setItem("mirofish.aquarium", next ? "1" : "0"); } catch {}
      return next;
    });
  };
  return { enabled, toggle };
}

export function Aquarium({ severity = "ok" }: { severity?: Severity }) {
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl",
        severity === "critical" ? "opacity-90" : severity === "warn" ? "opacity-80" : "opacity-70",
      )}
    >
      {/* Water gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.25_0.10_240_/_70%),oklch(0.12_0.05_265_/_95%)_60%,oklch(0.08_0.04_265)_100%)]" />
      {/* Caustic light streaks */}
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,oklch(0.85_0.15_220_/_8%)_50%,transparent_70%)] anim-scan" />
      {/* Bubbles */}
      {!reduced && Array.from({ length: severity === "critical" ? 6 : 14 }).map((_, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full bg-cyan-200/30 blur-[1px]"
          style={{
            left: `${(i * 7 + 3) % 100}%`,
            width: `${4 + (i % 5) * 2}px`,
            height: `${4 + (i % 5) * 2}px`,
            animation: `bubbleUp ${10 + (i % 6) * 3}s linear ${i * 0.7}s infinite`,
          }}
        />
      ))}
      {/* Creatures */}
      {CREATURES.filter((c) => {
        if (c.id === "predator") return severity !== "ok";
        if (c.id === "guardian") return true;
        return true;
      }).map((c) => {
        const fast = severity === "critical" || (severity === "warn" && c.id === "eel");
        const dur = reduced ? 0 : fast ? Math.max(12, c.dur * 0.6) : c.dur;
        return (
          <span
            key={c.id}
            title={c.label}
            className={cn("absolute select-none drop-shadow-[0_0_8px_currentColor]", c.color, c.size)}
            style={{
              top: `${c.top}%`,
              left: "-10%",
              animation: dur ? `swim ${dur}s linear ${c.delay}s infinite` : undefined,
              filter: severity === "critical" && c.id === "predator" ? "drop-shadow(0 0 12px #f43f5e)" : undefined,
            }}
          >
            {c.emoji}
          </span>
        );
      })}
      <style>{`
        @keyframes swim { 0% { transform: translateX(0) } 50% { transform: translateX(60vw) translateY(-6px) } 100% { transform: translateX(120vw) } }
        @keyframes bubbleUp { 0% { transform: translateY(0) scale(1); opacity: 0 } 10% { opacity: .8 } 100% { transform: translateY(-100vh) scale(1.4); opacity: 0 } }
      `}</style>
    </div>
  );
}
