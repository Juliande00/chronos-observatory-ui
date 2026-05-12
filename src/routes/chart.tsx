import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, X, Crosshair, Play, Pause, RotateCcw, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/chart")({
  head: () => ({ meta: [
    { title: "Paper Trading · ClaudeTrader" },
    { name: "description", content: "Candlestick-Chart mit simuliertem Paper-Trading. Keine Live-Orders." },
  ]}),
  component: ChartPage,
});

type Candle = { t: number; o: number; h: number; l: number; c: number; v: number };
type Side = "LONG" | "SHORT";
type Position = {
  id: string; symbol: string; side: Side; size: number;
  entry: number; sl?: number; tp?: number; openedAt: number;
};
type ClosedTrade = Position & { exit: number; pnl: number; closedAt: number; reason: "manual" | "sl" | "tp" };

const SYMBOLS = ["BTC/USDT", "ETH/USDT", "SOL/USDT"] as const;
const TFS = ["1m", "5m", "15m", "1h"] as const;

function seedRng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff; };
}

function genCandles(symbol: string, tf: string, count = 120): Candle[] {
  const base = { "BTC/USDT": 64000, "ETH/USDT": 3120, "SOL/USDT": 142 }[symbol] ?? 100;
  const vol = { "BTC/USDT": 220, "ETH/USDT": 14, "SOL/USDT": 1.2 }[symbol] ?? 1;
  const stepMs = { "1m": 60_000, "5m": 300_000, "15m": 900_000, "1h": 3_600_000 }[tf] ?? 60_000;
  const rnd = seedRng(symbol.charCodeAt(0) * 31 + tf.charCodeAt(0));
  const out: Candle[] = [];
  let price = base;
  const now = Date.now();
  for (let i = count - 1; i >= 0; i--) {
    const drift = (rnd() - 0.5) * vol * 0.6;
    const o = price;
    const c = Math.max(0.01, o + drift + Math.sin(i / 7) * vol * 0.15);
    const h = Math.max(o, c) + rnd() * vol * 0.5;
    const l = Math.min(o, c) - rnd() * vol * 0.5;
    out.push({ t: now - i * stepMs, o, h, l, c, v: rnd() * 1000 });
    price = c;
  }
  return out;
}

function ChartPage() {
  const [symbol, setSymbol] = useState<typeof SYMBOLS[number]>("BTC/USDT");
  const [tf, setTf] = useState<typeof TFS[number]>("5m");
  const [running, setRunning] = useState(true);
  const [candles, setCandles] = useState<Candle[]>(() => genCandles("BTC/USDT", "5m"));
  const [size, setSize] = useState(0.01);
  const [slPct, setSlPct] = useState(1.0); // %
  const [tpPct, setTpPct] = useState(2.0);
  const [positions, setPositions] = useState<Position[]>([]);
  const [closed, setClosed] = useState<ClosedTrade[]>([]);
  const [cursor, setCursor] = useState<{ x: number; y: number; price: number; time: number } | null>(null);

  // Reset chart on symbol/tf change
  useEffect(() => { setCandles(genCandles(symbol, tf)); }, [symbol, tf]);

  // Live tick: extend last candle
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setCandles((cs) => {
        const next = cs.slice();
        const last = { ...next[next.length - 1] };
        const v = { "BTC/USDT": 220, "ETH/USDT": 14, "SOL/USDT": 1.2 }[symbol] ?? 1;
        const drift = (Math.random() - 0.5) * v * 0.25;
        last.c = Math.max(0.01, last.c + drift);
        last.h = Math.max(last.h, last.c);
        last.l = Math.min(last.l, last.c);
        next[next.length - 1] = last;
        // 1 in 8 ticks: roll new candle
        if (Math.random() < 0.12) {
          next.shift();
          next.push({ t: Date.now(), o: last.c, h: last.c, l: last.c, c: last.c, v: 0 });
        }
        return next;
      });
    }, 900);
    return () => clearInterval(id);
  }, [running, symbol]);

  const price = candles[candles.length - 1]?.c ?? 0;

  // Auto SL/TP fills
  useEffect(() => {
    setPositions((open) => {
      const stillOpen: Position[] = [];
      const newlyClosed: ClosedTrade[] = [];
      for (const p of open) {
        const hitSL = p.sl !== undefined && (p.side === "LONG" ? price <= p.sl : price >= p.sl);
        const hitTP = p.tp !== undefined && (p.side === "LONG" ? price >= p.tp : price <= p.tp);
        if (hitSL || hitTP) {
          const exit = hitSL ? p.sl! : p.tp!;
          const pnl = (p.side === "LONG" ? exit - p.entry : p.entry - exit) * p.size;
          newlyClosed.push({ ...p, exit, pnl, closedAt: Date.now(), reason: hitSL ? "sl" : "tp" });
        } else stillOpen.push(p);
      }
      if (newlyClosed.length) setClosed((c) => [...newlyClosed, ...c].slice(0, 20));
      return stillOpen;
    });
  }, [price]);

  function placeOrder(side: Side) {
    const sl = side === "LONG" ? price * (1 - slPct / 100) : price * (1 + slPct / 100);
    const tp = side === "LONG" ? price * (1 + tpPct / 100) : price * (1 - tpPct / 100);
    setPositions((p) => [...p, {
      id: crypto.randomUUID(), symbol, side, size, entry: price, sl, tp, openedAt: Date.now(),
    }]);
  }
  function closePosition(id: string) {
    setPositions((open) => {
      const p = open.find((x) => x.id === id); if (!p) return open;
      const pnl = (p.side === "LONG" ? price - p.entry : p.entry - price) * p.size;
      setClosed((c) => [{ ...p, exit: price, pnl, closedAt: Date.now(), reason: "manual" as const }, ...c].slice(0, 20));
      return open.filter((x) => x.id !== id);
    });
  }
  function resetAll() {
    setPositions([]); setClosed([]); setCandles(genCandles(symbol, tf));
  }

  const stats = useMemo(() => {
    const realized = closed.reduce((a, b) => a + b.pnl, 0);
    const unreal = positions.reduce((a, p) => a + (p.side === "LONG" ? price - p.entry : p.entry - price) * p.size, 0);
    const wins = closed.filter((c) => c.pnl > 0).length;
    const wr = closed.length ? (wins / closed.length) * 100 : 0;
    return { realized, unreal, wr, n: closed.length };
  }, [closed, positions, price]);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <SectionTitle
            title="Paper Trading"
            subtitle="Candlestick-Chart mit simulierten Orders. Keine echten Trades, kein Exchange."
          />
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge tone="warning" dot>SIMULATION · Mock-Daten</StatusBadge>
        </div>
      </div>

      {/* Toolbar */}
      <GlassCard className="flex flex-wrap items-center gap-3">
        <Segmented value={symbol} onChange={(v) => setSymbol(v as any)} options={SYMBOLS as any} />
        <Segmented value={tf} onChange={(v) => setTf(v as any)} options={TFS as any} />
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setRunning((r) => !r)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_70%)] px-3 py-1.5 text-xs hover:bg-[oklch(0.25_0.04_265_/_80%)]">
            {running ? <><Pause className="h-3.5 w-3.5" /> Pause</> : <><Play className="h-3.5 w-3.5" /> Live</>}
          </button>
          <button onClick={resetAll}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_70%)] px-3 py-1.5 text-xs hover:bg-[oklch(0.25_0.04_265_/_80%)]">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </GlassCard>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Chart */}
        <GlassCard className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <h2 className="text-lg font-semibold">{symbol}</h2>
              <span className="text-2xl font-semibold tabular-nums text-gradient-primary">${price.toFixed(2)}</span>
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{tf} · sim</span>
            </div>
            {cursor && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Crosshair className="h-3.5 w-3.5" />
                <span className="tabular-nums">${cursor.price.toFixed(2)}</span>
              </div>
            )}
          </div>
          <CandleChart
            candles={candles}
            positions={positions}
            onHover={setCursor}
          />
        </GlassCard>

        {/* Order Panel */}
        <GlassCard className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Order Ticket <span className="text-muted-foreground">· paper</span></h3>
            <div className="mt-1 flex items-start gap-1.5 rounded-lg border border-warning/30 bg-warning/10 px-2.5 py-1.5 text-[11px] text-warning">
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
              Simulation. Keine echte Order, kein Exchange-Roundtrip.
            </div>
          </div>

          <Field label="Size">
            <input type="number" step="0.001" min={0.001} value={size}
              onChange={(e) => setSize(Math.max(0.001, +e.target.value || 0.001))}
              className="w-full rounded-lg border border-[var(--glass-border)] bg-[oklch(0.18_0.04_265_/_70%)] px-2.5 py-1.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </Field>

          <div className="grid grid-cols-2 gap-2">
            <Field label="Stop %">
              <input type="number" step="0.1" min={0.1} value={slPct}
                onChange={(e) => setSlPct(Math.max(0.1, +e.target.value || 0.1))}
                className="w-full rounded-lg border border-[var(--glass-border)] bg-[oklch(0.18_0.04_265_/_70%)] px-2.5 py-1.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </Field>
            <Field label="Target %">
              <input type="number" step="0.1" min={0.1} value={tpPct}
                onChange={(e) => setTpPct(Math.max(0.1, +e.target.value || 0.1))}
                className="w-full rounded-lg border border-[var(--glass-border)] bg-[oklch(0.18_0.04_265_/_70%)] px-2.5 py-1.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => placeOrder("LONG")}
              className="group inline-flex items-center justify-center gap-1.5 rounded-lg border border-success/40 bg-success/15 px-3 py-2 text-sm font-semibold text-success transition-all hover:bg-success/25 hover:shadow-[var(--shadow-glow-success)]">
              <TrendingUp className="h-4 w-4" /> Long
            </button>
            <button onClick={() => placeOrder("SHORT")}
              className="group inline-flex items-center justify-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/15 px-3 py-2 text-sm font-semibold text-destructive transition-all hover:bg-destructive/25 hover:shadow-[var(--shadow-glow-danger)]">
              <TrendingDown className="h-4 w-4" /> Short
            </button>
          </div>

          {/* PnL summary */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <Stat label="Open" value={positions.length.toString()} />
            <Stat label="Unrealized" value={`${stats.unreal >= 0 ? "+" : ""}$${stats.unreal.toFixed(2)}`}
              tone={stats.unreal >= 0 ? "success" : "danger"} />
            <Stat label="Realized" value={`${stats.realized >= 0 ? "+" : ""}$${stats.realized.toFixed(2)}`}
              tone={stats.realized >= 0 ? "success" : "danger"} />
            <Stat label="Trades" value={stats.n.toString()} />
            <Stat label="Winrate" value={`${stats.wr.toFixed(0)}%`} />
            <Stat label="Mode" value="Sim" />
          </div>
        </GlassCard>
      </div>

      {/* Open positions */}
      <GlassCard>
        <h3 className="mb-3 text-sm font-semibold">Offene Sim-Positionen</h3>
        {positions.length === 0 ? (
          <p className="text-xs text-muted-foreground">Keine offenen Positionen. Platziere oben Long oder Short.</p>
        ) : (
          <div className="space-y-2">
            {positions.map((p) => {
              const pnl = (p.side === "LONG" ? price - p.entry : p.entry - price) * p.size;
              const win = pnl >= 0;
              return (
                <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_60%)] px-3 py-2 text-xs">
                  <StatusBadge tone={p.side === "LONG" ? "success" : "danger"}>{p.side}</StatusBadge>
                  <span className="font-medium">{p.symbol}</span>
                  <span className="text-muted-foreground">size {p.size}</span>
                  <span className="text-muted-foreground">entry <span className="text-foreground tabular-nums">${p.entry.toFixed(2)}</span></span>
                  <span className="text-muted-foreground">SL <span className="text-destructive/80 tabular-nums">${p.sl?.toFixed(2)}</span></span>
                  <span className="text-muted-foreground">TP <span className="text-success/80 tabular-nums">${p.tp?.toFixed(2)}</span></span>
                  <span className={cn("ml-auto font-semibold tabular-nums", win ? "text-success" : "text-destructive")}>
                    {win ? "+" : ""}${pnl.toFixed(2)}
                  </span>
                  <button onClick={() => closePosition(p.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-[var(--glass-border)] bg-[oklch(0.18_0.04_265_/_80%)] px-2 py-1 text-[11px] hover:bg-[oklch(0.25_0.04_265_/_80%)]">
                    <X className="h-3 w-3" /> Close
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* History */}
      {closed.length > 0 && (
        <GlassCard>
          <h3 className="mb-3 text-sm font-semibold">Trade History <span className="text-muted-foreground">· letzte 20</span></h3>
          <div className="space-y-1.5">
            {closed.map((c) => (
              <div key={c.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_50%)] px-2.5 py-1.5 text-[11px]">
                <StatusBadge tone={c.side === "LONG" ? "success" : "danger"}>{c.side}</StatusBadge>
                <span>{c.symbol}</span>
                <span className="text-muted-foreground tabular-nums">${c.entry.toFixed(2)} → ${c.exit.toFixed(2)}</span>
                <StatusBadge tone={c.reason === "tp" ? "success" : c.reason === "sl" ? "danger" : "muted"}>{c.reason.toUpperCase()}</StatusBadge>
                <span className={cn("ml-auto font-semibold tabular-nums", c.pnl >= 0 ? "text-success" : "text-destructive")}>
                  {c.pnl >= 0 ? "+" : ""}${c.pnl.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Paper-Trading-Modus · Preisdaten sind synthetisch generiert · keine Verbindung zu Börsen oder Wallets.
      </p>
    </div>
  );
}

function CandleChart({
  candles, positions, onHover,
}: {
  candles: Candle[];
  positions: Position[];
  onHover: (c: { x: number; y: number; price: number; time: number } | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 380 });

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((es) => {
      const r = es[0].contentRect;
      setSize({ w: r.width, h: Math.max(280, Math.min(480, r.width * 0.45)) });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const padL = 6, padR = 56, padT = 10, padB = 22;
  const innerW = Math.max(50, size.w - padL - padR);
  const innerH = Math.max(50, size.h - padT - padB);
  const high = Math.max(...candles.map((c) => c.h), ...positions.flatMap((p) => [p.sl ?? p.entry, p.tp ?? p.entry, p.entry]));
  const low = Math.min(...candles.map((c) => c.l), ...positions.flatMap((p) => [p.sl ?? p.entry, p.tp ?? p.entry, p.entry]));
  const span = Math.max(0.0001, high - low);
  const yOf = (p: number) => padT + (1 - (p - low) / span) * innerH;
  const cw = innerW / candles.length;
  const xOf = (i: number) => padL + i * cw + cw / 2;

  const last = candles[candles.length - 1];
  const lastY = last ? yOf(last.c) : 0;
  const isUp = last && last.c >= last.o;

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x < padL || x > padL + innerW) { onHover(null); return; }
    const i = Math.min(candles.length - 1, Math.max(0, Math.floor((x - padL) / cw)));
    const price = low + (1 - (y - padT) / innerH) * span;
    onHover({ x, y, price, time: candles[i].t });
  }

  // Y-axis grid ticks
  const ticks = 5;
  const tickVals = Array.from({ length: ticks }, (_, i) => low + (span * i) / (ticks - 1));

  return (
    <div ref={ref} className="relative w-full select-none">
      <svg width={size.w} height={size.h} onMouseMove={handleMove} onMouseLeave={() => onHover(null)}>
        {/* Grid */}
        {tickVals.map((v, i) => (
          <g key={i}>
            <line x1={padL} x2={padL + innerW} y1={yOf(v)} y2={yOf(v)} stroke="oklch(1 0 0 / 6%)" strokeDasharray="2 4" />
            <text x={padL + innerW + 4} y={yOf(v) + 3} fontSize="10" fill="oklch(0.68 0.03 260)">${v.toFixed(2)}</text>
          </g>
        ))}

        {/* Position lines */}
        {positions.map((p) => (
          <g key={p.id} opacity={0.95}>
            <line x1={padL} x2={padL + innerW} y1={yOf(p.entry)} y2={yOf(p.entry)}
              stroke={p.side === "LONG" ? "oklch(0.74 0.18 152)" : "oklch(0.65 0.22 25)"} strokeWidth="1.2" strokeDasharray="4 3" />
            <rect x={padL + innerW + 1} y={yOf(p.entry) - 7} width={48} height={14} rx={3}
              fill={p.side === "LONG" ? "oklch(0.74 0.18 152 / 80%)" : "oklch(0.65 0.22 25 / 80%)"} />
            <text x={padL + innerW + 25} y={yOf(p.entry) + 3} textAnchor="middle" fontSize="9" fontWeight="600" fill="oklch(0.12 0.04 265)">
              {p.side} {p.entry.toFixed(2)}
            </text>
            {p.sl !== undefined && (
              <line x1={padL} x2={padL + innerW} y1={yOf(p.sl)} y2={yOf(p.sl)}
                stroke="oklch(0.65 0.22 25 / 70%)" strokeWidth="1" strokeDasharray="2 4" />
            )}
            {p.tp !== undefined && (
              <line x1={padL} x2={padL + innerW} y1={yOf(p.tp)} y2={yOf(p.tp)}
                stroke="oklch(0.74 0.18 152 / 70%)" strokeWidth="1" strokeDasharray="2 4" />
            )}
          </g>
        ))}

        {/* Candles */}
        {candles.map((c, i) => {
          const up = c.c >= c.o;
          const color = up ? "oklch(0.74 0.18 152)" : "oklch(0.65 0.22 25)";
          const x = xOf(i);
          const bodyTop = yOf(Math.max(c.o, c.c));
          const bodyBot = yOf(Math.min(c.o, c.c));
          const bodyH = Math.max(1, bodyBot - bodyTop);
          const bw = Math.max(1, cw * 0.65);
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={yOf(c.h)} y2={yOf(c.l)} stroke={color} strokeWidth="1" />
              <rect x={x - bw / 2} y={bodyTop} width={bw} height={bodyH} fill={color} opacity={up ? 0.9 : 0.95} rx={1} />
            </g>
          );
        })}

        {/* Current price tag */}
        {last && (
          <g>
            <line x1={padL} x2={padL + innerW} y1={lastY} y2={lastY}
              stroke={isUp ? "oklch(0.74 0.18 152)" : "oklch(0.65 0.22 25)"}
              strokeWidth="0.8" strokeDasharray="1 3" opacity="0.6" />
            <rect x={padL + innerW + 1} y={lastY - 8} width={52} height={16} rx={3}
              fill={isUp ? "oklch(0.74 0.18 152)" : "oklch(0.65 0.22 25)"} />
            <text x={padL + innerW + 27} y={lastY + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="oklch(0.12 0.04 265)">
              ${last.c.toFixed(2)}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}
function Segmented({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <div className="inline-flex rounded-lg border border-[var(--glass-border)] bg-[oklch(0.18_0.04_265_/_70%)] p-0.5">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)}
          className={cn("rounded-md px-2.5 py-1 text-xs transition-colors",
            value === o ? "bg-[oklch(0.30_0.08_260_/_80%)] text-foreground shadow-[var(--shadow-glow-primary)]" : "text-muted-foreground hover:text-foreground")}>
          {o}
        </button>
      ))}
    </div>
  );
}
function Stat({ label, value, tone }: { label: string; value: string; tone?: "success" | "danger" }) {
  return (
    <div className="rounded-lg border border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_60%)] px-2.5 py-1.5">
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className={cn("font-semibold tabular-nums", tone === "success" && "text-success", tone === "danger" && "text-destructive")}>{value}</div>
    </div>
  );
}
