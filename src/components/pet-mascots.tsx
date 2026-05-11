// Premium inline SVG mascots for ClaudeTrader modules.
// 96x96 viewBox; scale via className.
import type { ReactElement } from "react";

type PetSvgProps = { className?: string; warn?: boolean };

// shared subtle face used by some pets
function Face({ cx = 48, cy = 54, w = 14, eyeColor = "oklch(0.16 0.04 265)" }) {
  return (
    <g>
      <circle cx={cx - w / 2} cy={cy} r="2.4" fill={eyeColor} />
      <circle cx={cx + w / 2} cy={cy} r="2.4" fill={eyeColor} />
      <circle cx={cx - w / 2 + 0.7} cy={cy - 0.7} r="0.7" fill="oklch(1 0 0 / 80%)" />
      <circle cx={cx + w / 2 + 0.7} cy={cy - 0.7} r="0.7" fill="oklch(1 0 0 / 80%)" />
      <path d={`M${cx - 5} ${cy + 6} Q${cx} ${cy + 9} ${cx + 5} ${cy + 6}`} stroke={eyeColor} strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </g>
  );
}

export function CoreyMascot({ className }: PetSvgProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none">
      <defs>
        <radialGradient id="coreyHalo" cx="0.5" cy="0.5" r="0.55">
          <stop offset="0%" stopColor="oklch(0.78 0.18 240 / 55%)" />
          <stop offset="100%" stopColor="oklch(0.78 0.18 240 / 0%)" />
        </radialGradient>
        <linearGradient id="coreyBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.82 0.13 240)" />
          <stop offset="55%" stopColor="oklch(0.55 0.18 250)" />
          <stop offset="100%" stopColor="oklch(0.32 0.14 260)" />
        </linearGradient>
        <linearGradient id="coreyVisor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.20 0.06 260)" />
          <stop offset="100%" stopColor="oklch(0.10 0.04 265)" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="50" r="42" fill="url(#coreyHalo)" />
      {/* antenna */}
      <line x1="48" y1="8" x2="48" y2="20" stroke="oklch(0.78 0.18 240)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="48" cy="8" r="3.2" fill="oklch(0.85 0.18 240)" className="anim-pulse-soft" />
      <circle cx="48" cy="8" r="6" fill="oklch(0.78 0.18 240 / 25%)" className="anim-pulse-soft" />
      {/* body */}
      <rect x="18" y="22" width="60" height="54" rx="18" fill="url(#coreyBody)" stroke="oklch(1 0 0 / 22%)" />
      <rect x="18" y="22" width="60" height="20" rx="18" fill="oklch(1 0 0 / 6%)" />
      {/* visor */}
      <rect x="26" y="36" width="44" height="24" rx="10" fill="url(#coreyVisor)" stroke="oklch(0.78 0.18 240 / 40%)" />
      <circle cx="40" cy="48" r="3" fill="oklch(0.92 0.16 240)" className="anim-pulse-soft" />
      <circle cx="56" cy="48" r="3" fill="oklch(0.92 0.16 240)" className="anim-pulse-soft" />
      <rect x="32" y="42" width="16" height="2" rx="1" fill="oklch(0.78 0.18 240 / 40%)" />
      {/* CT badge */}
      <rect x="34" y="64" width="28" height="9" rx="3" fill="oklch(0.18 0.04 265)" stroke="oklch(0.78 0.18 240 / 50%)" />
      <text x="48" y="71" textAnchor="middle" fontSize="6.5" fill="oklch(0.85 0.16 240)" fontWeight="800" fontFamily="ui-sans-serif,system-ui">CT</text>
      {/* side bolts */}
      <circle cx="22" cy="48" r="1.8" fill="oklch(1 0 0 / 35%)" />
      <circle cx="74" cy="48" r="1.8" fill="oklch(1 0 0 / 35%)" />
    </svg>
  );
}

export function ShieldyMascot({ className, warn }: PetSvgProps) {
  const tone = warn ? "85" : "152";
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none">
      <defs>
        <radialGradient id="sHalo" cx="0.5" cy="0.5" r="0.55">
          <stop offset="0%" stopColor={`oklch(0.80 0.18 ${tone} / 55%)`} />
          <stop offset="100%" stopColor={`oklch(0.80 0.18 ${tone} / 0%)`} />
        </radialGradient>
        <linearGradient id="sBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`oklch(0.85 0.18 ${tone})`} />
          <stop offset="100%" stopColor={`oklch(0.42 0.16 ${warn ? "60" : "160"})`} />
        </linearGradient>
      </defs>
      <circle cx="48" cy="50" r="42" fill="url(#sHalo)" className={warn ? "anim-shimmer" : ""} />
      <path d="M48 12 L78 22 V50 C78 68 64 82 48 88 C32 82 18 68 18 50 V22 Z"
        fill="url(#sBody)" stroke="oklch(1 0 0 / 28%)" strokeWidth="1.5" />
      <path d="M48 12 L78 22 V36 C66 32 54 32 48 32 Z" fill="oklch(1 0 0 / 10%)" />
      {/* helmet stripe */}
      <rect x="34" y="22" width="28" height="5" rx="1.5" fill="oklch(0.20 0.04 265)" />
      <rect x="36" y="23.5" width="24" height="1.5" fill="oklch(1 0 0 / 25%)" />
      {/* face */}
      <Face />
      {/* center cross/plus */}
      <path d="M48 36 L48 50 M41 43 L55 43" stroke="oklch(1 0 0 / 60%)" strokeWidth="2.5" strokeLinecap="round" />
      {warn && <circle cx="68" cy="22" r="4" fill="oklch(0.85 0.18 60)" className="anim-pulse-soft" />}
    </svg>
  );
}

export function WickMascot({ className }: PetSvgProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none">
      <defs>
        <radialGradient id="wHalo" cx="0.5" cy="0.45" r="0.55">
          <stop offset="0%" stopColor="oklch(0.85 0.18 60 / 55%)" />
          <stop offset="100%" stopColor="oklch(0.85 0.18 60 / 0%)" />
        </radialGradient>
        <linearGradient id="wFlame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.95 0.18 95)" />
          <stop offset="60%" stopColor="oklch(0.78 0.20 60)" />
          <stop offset="100%" stopColor="oklch(0.55 0.22 30)" />
        </linearGradient>
        <linearGradient id="wWax" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.95 0.05 80)" />
          <stop offset="100%" stopColor="oklch(0.75 0.10 60)" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="50" r="42" fill="url(#wHalo)" className="anim-shimmer" />
      {/* flame */}
      <g className="anim-flicker" style={{ transformOrigin: "48px 30px" }}>
        <path d="M48 6 C42 18 38 22 38 32 C38 42 43 46 48 46 C53 46 58 42 58 32 C58 22 54 18 48 6 Z" fill="url(#wFlame)" />
        <path d="M48 14 C45 22 43 24 43 30 C43 36 46 38 48 38 C50 38 53 36 53 30 C53 24 51 22 48 14 Z" fill="oklch(0.98 0.10 95)" opacity="0.7" />
      </g>
      {/* wax body */}
      <path d="M30 50 Q48 44 66 50 L64 84 Q48 88 32 84 Z" fill="url(#wWax)" stroke="oklch(0.55 0.12 60 / 50%)" />
      {/* drips */}
      <path d="M32 60 Q34 66 32 72" stroke="oklch(0.55 0.12 60 / 50%)" strokeWidth="1.5" fill="none" />
      <path d="M64 58 Q62 64 64 70" stroke="oklch(0.55 0.12 60 / 50%)" strokeWidth="1.5" fill="none" />
      <Face cy={68} />
    </svg>
  );
}

export function SparkyMascot({ className }: PetSvgProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none">
      <defs>
        <radialGradient id="spHalo" cx="0.5" cy="0.5" r="0.55">
          <stop offset="0%" stopColor="oklch(0.72 0.22 300 / 55%)" />
          <stop offset="100%" stopColor="oklch(0.72 0.22 300 / 0%)" />
        </radialGradient>
        <linearGradient id="spBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.20 300)" />
          <stop offset="100%" stopColor="oklch(0.40 0.22 285)" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="50" r="42" fill="url(#spHalo)" className="anim-shimmer" />
      {/* helmet plume */}
      <path d="M30 32 L48 16 L66 32 Z" fill="oklch(0.55 0.18 290)" stroke="oklch(1 0 0 / 25%)" />
      <rect x="44" y="10" width="8" height="14" rx="2" fill="oklch(0.85 0.18 320)" className="anim-pulse-soft" />
      {/* head */}
      <rect x="22" y="32" width="52" height="46" rx="16" fill="url(#spBody)" stroke="oklch(1 0 0 / 22%)" />
      <rect x="22" y="32" width="52" height="14" rx="16" fill="oklch(1 0 0 / 8%)" />
      {/* visor slit */}
      <rect x="30" y="48" width="36" height="10" rx="3" fill="oklch(0.16 0.04 265)" />
      <rect x="34" y="51" width="6" height="4" rx="1" fill="oklch(0.92 0.18 320)" className="anim-pulse-soft" />
      <rect x="56" y="51" width="6" height="4" rx="1" fill="oklch(0.92 0.18 320)" className="anim-pulse-soft" />
      {/* crossed swords */}
      <g stroke="oklch(0.92 0.04 290)" strokeWidth="2.5" strokeLinecap="round">
        <line x1="14" y1="44" x2="32" y2="62" />
        <line x1="82" y1="44" x2="64" y2="62" />
      </g>
      <circle cx="14" cy="44" r="2" fill="oklch(0.85 0.18 320)" />
      <circle cx="82" cy="44" r="2" fill="oklch(0.85 0.18 320)" />
      {/* sparks */}
      <g className="anim-shimmer" fill="oklch(0.92 0.18 320)">
        <circle cx="20" cy="20" r="1.4" />
        <circle cx="76" cy="22" r="1" />
        <circle cx="84" cy="68" r="1.2" />
      </g>
    </svg>
  );
}

export function LunaMascot({ className }: PetSvgProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none">
      <defs>
        <radialGradient id="lHalo" cx="0.5" cy="0.5" r="0.55">
          <stop offset="0%" stopColor="oklch(0.78 0.20 300 / 55%)" />
          <stop offset="100%" stopColor="oklch(0.78 0.20 300 / 0%)" />
        </radialGradient>
        <radialGradient id="lMoon" cx="0.4" cy="0.4" r="0.7">
          <stop offset="0%" stopColor="oklch(0.92 0.14 300)" />
          <stop offset="100%" stopColor="oklch(0.55 0.20 280)" />
        </radialGradient>
        <linearGradient id="lHood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.45 0.18 285)" />
          <stop offset="100%" stopColor="oklch(0.25 0.12 280)" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="50" r="42" fill="url(#lHalo)" className="anim-shimmer" />
      {/* hood */}
      <path d="M20 56 Q24 26 48 22 Q72 26 76 56 L76 80 Q48 86 20 80 Z" fill="url(#lHood)" stroke="oklch(1 0 0 / 18%)" />
      <path d="M48 22 L48 56" stroke="oklch(1 0 0 / 12%)" />
      {/* moon face */}
      <circle cx="48" cy="50" r="18" fill="url(#lMoon)" />
      <path d="M56 38 A 14 14 0 1 0 60 62 A 11 11 0 1 1 56 38 Z" fill="oklch(0.96 0.06 290)" opacity="0.85" />
      <circle cx="42" cy="48" r="2.2" fill="oklch(0.20 0.04 265)" />
      <circle cx="50" cy="48" r="2.2" fill="oklch(0.20 0.04 265)" />
      <path d="M42 56 Q47 60 52 56" stroke="oklch(0.20 0.04 265)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* stars */}
      <g className="anim-shimmer" fill="oklch(0.95 0.10 290)">
        <circle cx="14" cy="20" r="1.4" />
        <circle cx="82" cy="24" r="1.6" />
        <circle cx="84" cy="68" r="1.2" />
        <circle cx="12" cy="62" r="1" />
      </g>
    </svg>
  );
}

export function HermesMascot({ className }: PetSvgProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none">
      <defs>
        <radialGradient id="hHalo" cx="0.5" cy="0.5" r="0.55">
          <stop offset="0%" stopColor="oklch(0.78 0.14 230 / 55%)" />
          <stop offset="100%" stopColor="oklch(0.78 0.14 230 / 0%)" />
        </radialGradient>
        <linearGradient id="hHelm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.85 0.10 230)" />
          <stop offset="100%" stopColor="oklch(0.40 0.14 240)" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="50" r="42" fill="url(#hHalo)" />
      {/* wings */}
      <g className="anim-bob">
        <path d="M14 44 Q22 30 38 40 Q34 46 14 50 Z" fill="oklch(0.92 0.06 230)" stroke="oklch(1 0 0 / 20%)" />
        <path d="M82 44 Q74 30 58 40 Q62 46 82 50 Z" fill="oklch(0.92 0.06 230)" stroke="oklch(1 0 0 / 20%)" />
        <path d="M16 48 Q24 38 36 44" stroke="oklch(1 0 0 / 30%)" fill="none" />
        <path d="M80 48 Q72 38 60 44" stroke="oklch(1 0 0 / 30%)" fill="none" />
      </g>
      {/* helmet/head */}
      <rect x="26" y="32" width="44" height="48" rx="16" fill="url(#hHelm)" stroke="oklch(1 0 0 / 22%)" />
      <path d="M26 42 Q48 28 70 42" stroke="oklch(0.95 0.16 80)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* visor wings (small gold) */}
      <path d="M26 38 L18 30 L26 32 Z" fill="oklch(0.92 0.16 80)" />
      <path d="M70 38 L78 30 L70 32 Z" fill="oklch(0.92 0.16 80)" />
      <Face cy={56} />
      {/* sensor light */}
      <circle cx="48" cy="70" r="2.5" fill="oklch(0.85 0.18 230)" className="anim-pulse-soft" />
    </svg>
  );
}

export function RocketMascot({ className }: PetSvgProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none">
      <defs>
        <radialGradient id="rkHalo" cx="0.5" cy="0.5" r="0.55">
          <stop offset="0%" stopColor="oklch(0.85 0.18 60 / 55%)" />
          <stop offset="100%" stopColor="oklch(0.85 0.18 60 / 0%)" />
        </radialGradient>
        <linearGradient id="rkBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.96 0.04 250)" />
          <stop offset="100%" stopColor="oklch(0.65 0.10 250)" />
        </linearGradient>
        <linearGradient id="rkFlame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.95 0.18 80)" />
          <stop offset="100%" stopColor="oklch(0.62 0.22 30)" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="50" r="42" fill="url(#rkHalo)" />
      <g className="anim-bob">
        {/* body */}
        <path d="M48 10 C60 20 64 36 64 50 L64 70 L32 70 L32 50 C32 36 36 20 48 10 Z"
          fill="url(#rkBody)" stroke="oklch(1 0 0 / 25%)" />
        {/* nose tip */}
        <path d="M48 10 C52 16 54 22 56 28 L40 28 C42 22 44 16 48 10 Z" fill="oklch(0.78 0.18 240)" />
        {/* window */}
        <circle cx="48" cy="38" r="8" fill="oklch(0.18 0.04 265)" stroke="oklch(0.78 0.18 240)" strokeWidth="2" />
        <circle cx="44" cy="34" r="2" fill="oklch(1 0 0 / 60%)" />
        <circle cx="44" cy="38" r="1.2" fill="oklch(0.92 0.16 240)" className="anim-pulse-soft" />
        <circle cx="50" cy="38" r="1.2" fill="oklch(0.92 0.16 240)" className="anim-pulse-soft" />
        {/* fins */}
        <path d="M32 56 L20 68 L32 68 Z" fill="oklch(0.65 0.22 25)" stroke="oklch(1 0 0 / 18%)" />
        <path d="M64 56 L76 68 L64 68 Z" fill="oklch(0.65 0.22 25)" stroke="oklch(1 0 0 / 18%)" />
        {/* engine band */}
        <rect x="32" y="64" width="32" height="6" fill="oklch(0.30 0.05 260)" />
        <rect x="32" y="66" width="32" height="2" fill="oklch(1 0 0 / 20%)" />
      </g>
      {/* flame */}
      <g className="anim-flicker">
        <path d="M38 70 Q48 92 58 70 Q54 80 48 80 Q42 80 38 70 Z" fill="url(#rkFlame)" />
        <path d="M44 70 Q48 84 52 70 Q50 76 48 76 Q46 76 44 70 Z" fill="oklch(0.98 0.10 95)" />
      </g>
    </svg>
  );
}

export function SpikeMascot({ className }: PetSvgProps) {
  const spikes = Array.from({ length: 12 }).map((_, i) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const x1 = 48 + Math.cos(a) * 26;
    const y1 = 52 + Math.sin(a) * 22;
    const x2 = 48 + Math.cos(a) * 38;
    const y2 = 52 + Math.sin(a) * 30;
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="oklch(0.65 0.22 25)" strokeWidth="3" strokeLinecap="round" />;
  });
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none">
      <defs>
        <radialGradient id="spkHalo" cx="0.5" cy="0.5" r="0.55">
          <stop offset="0%" stopColor="oklch(0.65 0.22 25 / 55%)" />
          <stop offset="100%" stopColor="oklch(0.65 0.22 25 / 0%)" />
        </radialGradient>
        <radialGradient id="spkBody" cx="0.4" cy="0.4" r="0.7">
          <stop offset="0%" stopColor="oklch(0.62 0.18 25)" />
          <stop offset="100%" stopColor="oklch(0.32 0.16 25)" />
        </radialGradient>
      </defs>
      <circle cx="48" cy="50" r="42" fill="url(#spkHalo)" className="anim-spike" />
      <g className="anim-spike">{spikes}</g>
      <ellipse cx="48" cy="52" rx="28" ry="22" fill="url(#spkBody)" stroke="oklch(1 0 0 / 22%)" />
      {/* warning triangle on chest */}
      <path d="M48 44 L54 56 L42 56 Z" fill="oklch(0.92 0.18 80)" stroke="oklch(0.20 0.04 265)" strokeWidth="0.8" />
      <rect x="47" y="48" width="2" height="4" rx="1" fill="oklch(0.20 0.04 265)" />
      <circle cx="48" cy="54.5" r="0.8" fill="oklch(0.20 0.04 265)" />
      {/* eyes */}
      <ellipse cx="38" cy="48" rx="3" ry="3.5" fill="oklch(0.96 0.05 80)" />
      <ellipse cx="58" cy="48" rx="3" ry="3.5" fill="oklch(0.96 0.05 80)" />
      <circle cx="38" cy="49" r="1.4" fill="oklch(0.16 0.04 265)" />
      <circle cx="58" cy="49" r="1.4" fill="oklch(0.16 0.04 265)" />
    </svg>
  );
}

export const MASCOTS: Record<string, (p: PetSvgProps) => ReactElement> = {
  corey: CoreyMascot,
  shieldy: (p) => <ShieldyMascot {...p} warn />,
  wick: WickMascot,
  sparky: SparkyMascot,
  luna: LunaMascot,
  hermes: HermesMascot,
  rocket: RocketMascot,
  spike: SpikeMascot,
};
