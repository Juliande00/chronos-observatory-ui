import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { StatusBadge } from "@/components/status-badge";
import { KpiCard } from "@/components/kpi-card";
import { PageHeader } from "@/components/page-header";
import {
  Activity, Pause, Play, Filter, Radio, Cpu, Database,
  AlertTriangle, Zap, ShieldCheck, BrainCircuit, Flame, Swords, Moon, Compass,
} from "lucide-react";

export const Route = createFileRoute("/pulse")({
  head: () => ({
    meta: [
      { title: "Live Pulse · OmniTrader" },
      { name: "description", content: "Real-time event stream of every OmniTrader module." },
    ],
  }),
  component: PulsePage,
});

type Severity = "info" | "success" | "warning" | "danger" | "learning";
type Source =
  | "core" | "risk" | "candlesight" | "arena" | "governor"
  | "hermes" | "mfe0" | "runner" | "xgb" | "memory";

type Event = {
  id: number;
  ts: number;
  source: Source;
  severity: Severity;
  title: string;
  detail: string;
  symbol?: string;
  latencyMs?: number;
};

const SOURCE_META: Record<Source, { label: string; Icon: typeof Activity; color: string }> = {
  core:        { label: "Decision Core", Icon: Cpu,          color: "text-primary" },
  risk:        { label: "Risk Engine",   Icon: ShieldCheck,  color: "text-warning" },
  candlesight: { label: "CandleSight",   Icon: Flame,        color: "text-info" },
  arena:       { label: "Battle Arena",  Icon: Swords,       color: "text-learning" },
  governor:    { label: "Nightly Gov.",  Icon: Moon,         color: "text-info" },
  hermes:      { label: "Hermes",        Icon: Compass,      color: "text-warning" },
  mfe0:        { label: "MFE0Guard",     Icon: AlertTriangle,color: "text-destructive" },
  runner:      { label: "RunnerScout",   Icon: Zap,          color: "text-success" },
  xgb:         { label: "XGBoost",       Icon: BrainCircuit, color: "text-learning" },
  memory:      { label: "Memory",        Icon: Database,     color: "text-muted-foreground" },
};

const TEMPLATES: Array<Omit<Event, "id" | "ts">> = [
  { source: "core",        severity: "info",    title: "Market scan", detail: "14 pairs evaluated, 2 setups passed gating.", latencyMs: 184 },
  { source: "core",        severity: "success", title: "Signal accepted", detail: "BTC/USDT LONG SMC_TJR — risk $42.10", symbol: "BTC/USDT", latencyMs: 96 },
  { source: "risk",        severity: "warning", title: "Balance offset stale", detail: "+$17.44 difference, AutoApply blocked.", latencyMs: 24 },
  { source: "risk",        severity: "danger",  title: "Daily DD threshold", detail: "−1.8% of equity. Soft warn raised.", latencyMs: 11 },
  { source: "candlesight", severity: "info",    title: "Pressure mid", detail: "ETH/USDT — 645 samples, exit pressure neutral.", symbol: "ETH/USDT", latencyMs: 142 },
  { source: "candlesight", severity: "warning", title: "Fakeout risk", detail: "ETH/USDT shows wick rejection — shadow only.", symbol: "ETH/USDT", latencyMs: 158 },
  { source: "arena",       severity: "learning",title: "13 bots voted", detail: "Bull 6 / Bear 4 / Neutral 3. Sample still small.", latencyMs: 612 },
  { source: "governor",    severity: "info",    title: "Proposal generated", detail: "No-Boost: ETH/TREND_RSI/eu — PF 0.65.", latencyMs: 88 },
  { source: "governor",    severity: "success", title: "Nightly report saved", detail: "Treatment+Learning combined report written.", latencyMs: 412 },
  { source: "hermes",      severity: "warning", title: "Risk-Off sensor", detail: "Volatility regime shift detected — shadow.", latencyMs: 64 },
  { source: "mfe0",        severity: "danger",  title: "MFE0 candidate", detail: "DOGE/TREND_RSI/us — 42% never went positive.", symbol: "DOGE/USDT", latencyMs: 31 },
  { source: "runner",      severity: "success", title: "Runner structure", detail: "BTC/USDT — clean continuation, watch only.", symbol: "BTC/USDT", latencyMs: 73 },
  { source: "xgb",         severity: "learning",title: "Bucket recompute", detail: "very-high bucket: WR 68%, PF 1.18.", latencyMs: 220 },
  { source: "memory",      severity: "info",    title: "Insight stored", detail: "Linked to bucket=Runner-Win, source=arena.", latencyMs: 18 },
  { source: "core",        severity: "warning", title: "Block reason", detail: "confidence_below_min for SOL/USDT setup.", symbol: "SOL/USDT", latencyMs: 41 },
];

const ALL_SOURCES = Object.keys(SOURCE_META) as Source[];
const SEVERITIES: Severity[] = ["info", "success", "warning", "danger", "learning"];

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString("de-DE", { hour12: false }) + "." + String(d.getMilliseconds()).padStart(3, "0");
}

function PulsePage() {
  const [events, setEvents] = useState<Event[]>(() =>
    Array.from({ length: 14 }, (_, i) => {
      const t = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
      return { ...t, id: i + 1, ts: Date.now() - (14 - i) * 1400 };
    }),
  );
  const [paused, setPaused] = useState(false);
  const [activeSources, setActiveSources] = useState<Set<Source>>(new Set(ALL_SOURCES));
  const [activeSev, setActiveSev] = useState<Set<Severity>>(new Set(SEVERITIES));
  const idRef = useRef(events.length);

  useEffect(() => {
    if (paused) return;
    const i = setInterval(() => {
      const t = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
      idRef.current += 1;
      setEvents((prev) => [{ ...t, id: idRef.current, ts: Date.now() }, ...prev].slice(0, 80));
    }, 1100 + Math.random() * 1300);
    return () => clearInterval(i);
  }, [paused]);

  const visible = useMemo(
    () => events.filter((e) => activeSources.has(e.source) && activeSev.has(e.severity)),
    [events, activeSources, activeSev],
  );

  const counts = useMemo(() => {
    const total = events.length;
    const errors = events.filter((e) => e.severity === "danger").length;
    const warns = events.filter((e) => e.severity === "warning").length;
    const lat = events.filter((e) => e.latencyMs).map((e) => e.latencyMs!);
    const avgLat = lat.length ? Math.round(lat.reduce((a, b) => a + b, 0) / lat.length) : 0;
    return { total, errors, warns, avgLat, eps: (total / 60).toFixed(1) };
  }, [events]);

  const sourceCounts = useMemo(() => {
    const m = new Map<Source, number>();
    events.forEach((e) => m.set(e.source, (m.get(e.source) ?? 0) + 1));
    return m;
  }, [events]);

  const toggle = <T,>(set: Set<T>, v: T, setter: (s: Set<T>) => void) => {
    const next = new Set(set);
    if (next.has(v)) next.delete(v); else next.add(v);
    setter(next);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Live System Pulse"
        subtitle="Echtzeit-Eventstream aller Module — Read-only Beobachtung."
        statuses={[
          { label: paused ? "Paused" : "Streaming", tone: paused ? "warning" : "success" },
          { label: `${counts.eps} eps`, tone: "info" },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
        <KpiCard label="Events (window)" value={counts.total.toString()} tone="info" hint="last 80" />
        <KpiCard label="Avg latency" value={`${counts.avgLat} ms`} tone={counts.avgLat > 300 ? "warning" : "success"} />
        <KpiCard label="Warnings" value={counts.warns.toString()} tone="warning" />
        <KpiCard label="Errors" value={counts.errors.toString()} tone={counts.errors > 0 ? "danger" : "success"} />
        <KpiCard label="Mode" value="Read-only" tone="muted" hint="no live actions" />
      </div>

      <GlassCard className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Filter className="h-4 w-4 text-muted-foreground" /> Filter
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ALL_SOURCES.map((s) => {
              const meta = SOURCE_META[s];
              const on = activeSources.has(s);
              return (
                <button
                  key={s}
                  onClick={() => toggle(activeSources, s, setActiveSources)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                    on
                      ? "border-primary/40 bg-primary/10 text-foreground"
                      : "border-[var(--glass-border)] text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <meta.Icon className={`h-3 w-3 ${on ? meta.color : ""}`} />
                  {meta.label}
                  <span className="tabular-nums opacity-70">{sourceCounts.get(s) ?? 0}</span>
                </button>
              );
            })}
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            {SEVERITIES.map((sv) => {
              const on = activeSev.has(sv);
              return (
                <button
                  key={sv}
                  onClick={() => toggle(activeSev, sv, setActiveSev)}
                  className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-wider transition-opacity ${
                    on ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <StatusBadge tone={sv}>{sv}</StatusBadge>
                </button>
              );
            })}
            <button
              onClick={() => setPaused((p) => !p)}
              className="ml-2 inline-flex items-center gap-1.5 rounded-lg border border-[var(--glass-border)] bg-background/40 px-3 py-1.5 text-xs font-medium hover:bg-background/60"
            >
              {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              {paused ? "Resume" : "Pause"}
            </button>
          </div>
        </div>
      </GlassCard>

      <section>
        <SectionTitle
          title={<span className="inline-flex items-center gap-2"><Radio className="h-4 w-4 text-success anim-pulse-soft" /> Event Stream</span>}
          subtitle={`${visible.length} sichtbar · ${events.length} im Buffer`}
        />
        <GlassCard className="p-0">
          <ul className="divide-y divide-[var(--glass-border)] max-h-[640px] overflow-y-auto">
            {visible.length === 0 && (
              <li className="px-5 py-12 text-center text-sm text-muted-foreground">
                Keine Events für die aktuellen Filter.
              </li>
            )}
            {visible.map((e) => {
              const meta = SOURCE_META[e.source];
              const Icon = meta.Icon;
              return (
                <li key={e.id} className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[oklch(0.25_0.04_265_/_40%)]">
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-background/40 ${meta.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{e.title}</span>
                      <StatusBadge tone={e.severity}>{e.severity}</StatusBadge>
                      {e.symbol && <span className="rounded-md border border-[var(--glass-border)] px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">{e.symbol}</span>}
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{meta.label}</span>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">{e.detail}</div>
                  </div>
                  <div className="shrink-0 text-right text-[10px] tabular-nums text-muted-foreground">
                    <div>{formatTime(e.ts)}</div>
                    {e.latencyMs && <div className="opacity-70">{e.latencyMs} ms</div>}
                  </div>
                </li>
              );
            })}
          </ul>
        </GlassCard>
      </section>

      <p className="text-xs text-muted-foreground">
        Events sind synthetisch generiert. Der echte Stream wird hier eingehängt, sobald das Backend an OmniTrader Pulse gekoppelt ist.
      </p>
    </div>
  );
}
