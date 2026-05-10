import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { StatusBadge } from "@/components/status-badge";
import { OPEN_TRADES } from "@/lib/mock-data";
import { CheckCircle2, AlertTriangle, Circle, XCircle, Database } from "lucide-react";

export const Route = createFileRoute("/trades")({
  head: () => ({ meta: [{ title: "Live Trades · ClaudeTrader" }, { name: "description", content: "Offene Trades, Trade Journey und Closed-Übersicht." }] }),
  component: TradesPage,
});

const JOURNEY_STEPS = [
  "Market Data", "Signal", "Strategy", "XGBoost", "Battle Arena",
  "Hermes", "CandleSight", "Treatment", "Risk", "Entry",
  "Position", "Exit Watch", "Learning",
];

function TradesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionTitle title="Live Trades" subtitle="Offene Positionen und ihr Weg durch die Module." />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {OPEN_TRADES.map((t) => <TradeCard key={t.id} t={t} />)}
      </div>
      <GlassCard>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Letzter geschlossener Trade</h3>
          <StatusBadge tone="success" dot>+$12.40</StatusBadge>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">BTC/USDT · LONG · SMC_TJR · gehalten 3h 18m · Exit Grade B+ · Retained Profit 71%.</p>
        <p className="mt-1 text-xs text-muted-foreground">Learning: Treatment-Klasse "Protected-Win" bestätigt.</p>
      </GlassCard>
    </div>
  );
}

function TradeCard({ t }: { t: typeof OPEN_TRADES[number] }) {
  const isWin = t.pnl >= 0;
  return (
    <GlassCard className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{t.symbol}</h3>
            <StatusBadge tone={t.side === "LONG" ? "success" : "danger"}>{t.side}</StatusBadge>
            <StatusBadge tone="muted">{t.strategy}</StatusBadge>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">Entry ${t.entry} → ${t.current} · {t.hold}</p>
        </div>
        <div className="text-right">
          <div className={`text-xl font-semibold tabular-nums ${isWin ? "text-success" : "text-destructive"}`}>
            {isWin ? "+" : ""}${t.pnl.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">R {t.r.toFixed(2)} · max {t.maxR.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <Stat label="SL" value={`$${t.sl}`} />
        <Stat label="TP" value={`$${t.tp}`} />
        <Stat label="MinR" value={t.minR.toFixed(2)} />
        <Stat label="XGB" value={t.xgb.toFixed(2)} />
      </div>

      <div>
        <div className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">Trade Journey</div>
        <div className="flex flex-wrap gap-1.5">
          {JOURNEY_STEPS.map((s, i) => {
            const tone = stepTone(t, i);
            return (
              <div key={s} className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] ${toneCls(tone)}`}>
                <StepIcon tone={tone} />{s}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-2 text-xs">
        <Row label="Treatment" value={t.treatment} tone={t.treatment.includes("Risk") ? "warning" : "info"} />
        <Row label="CandleSight" value={t.candleSight} tone={t.candleSight.includes("risk") ? "warning" : "shadow"} />
        <Row label="Hermes" value={t.hermes} tone={t.hermes === "suspicious" ? "warning" : "shadow"} />
        <Row label="Arena" value={t.arena} tone="shadow" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {t.risk.map((r) => (
          <StatusBadge key={r} tone={r.includes("risk") || r.includes("WARN") || r.includes("Fakeout") ? "warning" : "muted"}>{r}</StatusBadge>
        ))}
      </div>
    </GlassCard>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_50%)] px-2.5 py-1.5">
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className="font-medium tabular-nums">{value}</div>
    </div>
  );
}
function Row({ label, value, tone }: { label: string; value: string; tone: any }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <StatusBadge tone={tone}>{value}</StatusBadge>
    </div>
  );
}

type StepTone = "ok" | "warn" | "risk" | "pending" | "data";
function stepTone(t: typeof OPEN_TRADES[number], i: number): StepTone {
  if (i === 0) return "data";
  if (t.symbol.startsWith("ETH") && (i === 4 || i === 5 || i === 6 || i === 7)) return "warn";
  if (t.symbol.startsWith("ETH") && i === 8) return "risk";
  if (i >= 12) return "pending";
  return "ok";
}
function toneCls(t: StepTone) {
  return {
    ok: "border-success/30 bg-success/10 text-success",
    warn: "border-warning/30 bg-warning/10 text-warning",
    risk: "border-destructive/30 bg-destructive/10 text-destructive",
    pending: "border-border bg-muted text-muted-foreground",
    data: "border-info/30 bg-info/10 text-info",
  }[t];
}
function StepIcon({ tone }: { tone: StepTone }) {
  const cls = "h-3 w-3";
  if (tone === "ok") return <CheckCircle2 className={cls} />;
  if (tone === "warn") return <AlertTriangle className={cls} />;
  if (tone === "risk") return <XCircle className={cls} />;
  if (tone === "data") return <Database className={cls} />;
  return <Circle className={cls} />;
}
