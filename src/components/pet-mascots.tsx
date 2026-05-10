// Friendly inline SVG mascots for ClaudeTrader modules.
// All sized 96x96 viewBox; scale via className.

type PetSvgProps = { className?: string };

export function CoreyMascot({ className }: PetSvgProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none">
      <defs>
        <linearGradient id="cBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.15 240)" />
          <stop offset="100%" stopColor="oklch(0.50 0.18 250)" />
        </linearGradient>
      </defs>
      <line x1="48" y1="10" x2="48" y2="22" stroke="oklch(0.72 0.18 240)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="48" cy="10" r="3" fill="oklch(0.78 0.18 240)" className="anim-pulse-soft" />
      <rect x="20" y="22" width="56" height="50" rx="14" fill="url(#cBody)" stroke="oklch(1 0 0 / 20%)" />
      <rect x="28" y="34" width="40" height="22" rx="8" fill="oklch(0.16 0.04 265)" />
      <circle cx="40" cy="45" r="3.5" fill="oklch(0.78 0.18 240)" className="anim-pulse-soft" />
      <circle cx="56" cy="45" r="3.5" fill="oklch(0.78 0.18 240)" className="anim-pulse-soft" />
      <rect x="36" y="62" width="24" height="3" rx="1.5" fill="oklch(1 0 0 / 30%)" />
      <rect x="34" y="76" width="28" height="10" rx="3" fill="oklch(0.30 0.05 265)" stroke="oklch(1 0 0 / 15%)" />
      <text x="48" y="83" textAnchor="middle" fontSize="6" fill="oklch(0.78 0.18 240)" fontWeight="700">CT</text>
    </svg>
  );
}

export function ShieldyMascot({ className, warn }: PetSvgProps & { warn?: boolean }) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none">
      <defs>
        <linearGradient id="sBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={warn ? "oklch(0.85 0.16 85)" : "oklch(0.78 0.16 152)"} />
          <stop offset="100%" stopColor={warn ? "oklch(0.55 0.18 60)" : "oklch(0.45 0.16 160)"} />
        </linearGradient>
      </defs>
      <path d="M48 12 L78 22 V50 C78 68 64 80 48 86 C32 80 18 68 18 50 V22 Z"
        fill="url(#sBody)" stroke="oklch(1 0 0 / 25%)" strokeWidth="1.5"
        className={warn ? "anim-shimmer" : ""} />
      <rect x="36" y="20" width="24" height="6" rx="2" fill="oklch(0.20 0.04 265)" />
      <circle cx="42" cy="46" r="3" fill="oklch(0.16 0.04 265)" />
      <circle cx="54" cy="46" r="3" fill="oklch(0.16 0.04 265)" />
      <path d="M40 58 Q48 64 56 58" stroke="oklch(0.16 0.04 265)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M48 32 L48 44 M42 38 L54 38" stroke="oklch(1 0 0 / 50%)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function WickMascot({ className }: PetSvgProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none">
      <defs>
        <linearGradient id="wFlame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.92 0.15 80)" />
          <stop offset="100%" stopColor="oklch(0.70 0.20 30)" />
        </linearGradient>
      </defs>
      <path d="M48 8 C44 18 40 22 40 30 C40 38 44 42 48 42 C52 42 56 38 56 30 C56 22 52 18 48 8 Z"
        fill="url(#wFlame)" className="anim-flicker" />
      <line x1="48" y1="42" x2="48" y2="50" stroke="oklch(0.30 0.04 265)" strokeWidth="2" />
      <rect x="30" y="50" width="36" height="36" rx="8" fill="oklch(0.92 0.06 80)" stroke="oklch(0.78 0.10 80)" />
      <circle cx="40" cy="64" r="3" fill="oklch(0.20 0.04 265)" />
      <circle cx="56" cy="64" r="3" fill="oklch(0.20 0.04 265)" />
      <path d="M40 74 Q48 80 56 74" stroke="oklch(0.20 0.04 265)" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function SparkyMascot({ className }: PetSvgProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none">
      <defs>
        <linearGradient id="spB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.20 300)" />
          <stop offset="100%" stopColor="oklch(0.45 0.22 290)" />
        </linearGradient>
      </defs>
      <ellipse cx="48" cy="84" rx="24" ry="3" fill="oklch(0.70 0.20 300 / 25%)" className="anim-shimmer" />
      <path d="M28 32 L48 18 L68 32 L68 38 L28 38 Z" fill="oklch(0.30 0.10 290)" stroke="oklch(1 0 0 / 25%)" />
      <rect x="22" y="38" width="52" height="42" rx="14" fill="url(#spB)" stroke="oklch(1 0 0 / 20%)" />
      <circle cx="38" cy="54" r="4" fill="oklch(0.95 0.04 290)" />
      <circle cx="58" cy="54" r="4" fill="oklch(0.95 0.04 290)" />
      <rect x="36" y="66" width="24" height="3" rx="1.5" fill="oklch(0.20 0.04 265)" />
      <line x1="14" y1="50" x2="26" y2="62" stroke="oklch(0.85 0.10 290)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="82" y1="50" x2="70" y2="62" stroke="oklch(0.85 0.10 290)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function LunaMascot({ className }: PetSvgProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none">
      <defs>
        <radialGradient id="lG" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="oklch(0.85 0.18 290)" />
          <stop offset="100%" stopColor="oklch(0.50 0.20 280)" />
        </radialGradient>
      </defs>
      <circle cx="48" cy="50" r="32" fill="url(#lG)" stroke="oklch(1 0 0 / 25%)" className="anim-shimmer" />
      <path d="M58 30 A 24 24 0 1 0 64 64 A 18 18 0 1 1 58 30 Z" fill="oklch(0.95 0.05 290)" opacity="0.85" />
      <circle cx="40" cy="48" r="3" fill="oklch(0.20 0.04 265)" />
      <circle cx="52" cy="48" r="3" fill="oklch(0.20 0.04 265)" />
      <path d="M40 60 Q48 64 56 60" stroke="oklch(0.20 0.04 265)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <g className="anim-shimmer">
        <circle cx="20" cy="20" r="1.5" fill="oklch(0.95 0.10 290)" />
        <circle cx="80" cy="28" r="1.5" fill="oklch(0.95 0.10 290)" />
        <circle cx="78" cy="76" r="1.5" fill="oklch(0.95 0.10 290)" />
      </g>
    </svg>
  );
}

export function HermesMascot({ className }: PetSvgProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none">
      <defs>
        <linearGradient id="hB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.14 230)" />
          <stop offset="100%" stopColor="oklch(0.50 0.16 240)" />
        </linearGradient>
      </defs>
      <path d="M14 46 Q26 30 38 44 Q30 50 14 46 Z" fill="oklch(0.85 0.10 230)" className="anim-bob" />
      <path d="M82 46 Q70 30 58 44 Q66 50 82 46 Z" fill="oklch(0.85 0.10 230)" className="anim-bob" />
      <rect x="28" y="32" width="40" height="40" rx="14" fill="url(#hB)" stroke="oklch(1 0 0 / 20%)" />
      <path d="M28 38 Q48 26 68 38" stroke="oklch(0.92 0.10 80)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="52" r="3" fill="oklch(0.20 0.04 265)" />
      <circle cx="56" cy="52" r="3" fill="oklch(0.20 0.04 265)" />
      <path d="M40 62 Q48 66 56 62" stroke="oklch(0.20 0.04 265)" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function RocketMascot({ className }: PetSvgProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none">
      <defs>
        <linearGradient id="rB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.92 0.05 250)" />
          <stop offset="100%" stopColor="oklch(0.70 0.10 250)" />
        </linearGradient>
      </defs>
      <g className="anim-bob">
        <path d="M48 14 C58 22 62 36 62 50 L62 70 L34 70 L34 50 C34 36 38 22 48 14 Z"
          fill="url(#rB)" stroke="oklch(1 0 0 / 25%)" />
        <circle cx="48" cy="40" r="6" fill="oklch(0.20 0.04 265)" stroke="oklch(0.78 0.18 240)" strokeWidth="2" />
        <path d="M34 56 L22 64 L34 64 Z" fill="oklch(0.65 0.22 25)" />
        <path d="M62 56 L74 64 L62 64 Z" fill="oklch(0.65 0.22 25)" />
        <circle cx="42" cy="50" r="1.5" fill="oklch(0.78 0.18 240)" />
        <circle cx="54" cy="50" r="1.5" fill="oklch(0.78 0.18 240)" />
      </g>
      <path d="M40 72 Q48 88 56 72 Q52 80 48 80 Q44 80 40 72 Z"
        fill="oklch(0.82 0.18 60)" className="anim-flicker" />
    </svg>
  );
}

export function SpikeMascot({ className }: PetSvgProps) {
  const spikes = Array.from({ length: 10 }).map((_, i) => {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const x1 = 48 + Math.cos(a) * 28;
    const y1 = 50 + Math.sin(a) * 22;
    const x2 = 48 + Math.cos(a) * 40;
    const y2 = 50 + Math.sin(a) * 30;
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="oklch(0.65 0.22 25)" strokeWidth="3" strokeLinecap="round" />;
  });
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none">
      <g className="anim-spike">{spikes}</g>
      <ellipse cx="48" cy="50" rx="28" ry="22" fill="oklch(0.45 0.18 25)" stroke="oklch(1 0 0 / 20%)" />
      <ellipse cx="38" cy="46" rx="3" ry="4" fill="oklch(0.95 0.05 80)" />
      <ellipse cx="58" cy="46" rx="3" ry="4" fill="oklch(0.95 0.05 80)" />
      <circle cx="38" cy="47" r="1.5" fill="oklch(0.16 0.04 265)" />
      <circle cx="58" cy="47" r="1.5" fill="oklch(0.16 0.04 265)" />
      <path d="M40 58 Q48 62 56 58" stroke="oklch(0.16 0.04 265)" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export const MASCOTS: Record<string, (p: PetSvgProps & { warn?: boolean }) => JSX.Element> = {
  corey: CoreyMascot,
  shieldy: (p) => <ShieldyMascot {...p} warn />,
  wick: WickMascot,
  sparky: SparkyMascot,
  luna: LunaMascot,
  hermes: HermesMascot,
  rocket: RocketMascot,
  spike: SpikeMascot,
};
