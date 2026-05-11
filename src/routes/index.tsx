import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { PetCard } from "@/components/pet-card";
import { SYSTEM_STATUS, KPIS, NARRATIVE, WARNINGS, PETS } from "@/lib/mock-data";
import { Activity, AlertTriangle, Info, ShieldAlert, TrendingDown, TrendingUp, Target, Wallet, Briefcase, Percent, Gauge } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mission Control · ClaudeTrader" },
      { name: "description", content: "Übersicht über ClaudeTrader: KPIs, Module und Shadow-Systeme." },
    ],
  }),
  component: MissionControl,
});

function MissionControl() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <StatusBar />
      <KpiGrid />
      <NarrativePanel />
      <PetsSection />
    </div>
  );
}

function StatusBar() {
  return (
    <GlassCard className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Mission Control</h1>
          <StatusBadge tone="muted">{SYSTEM_STATUS.appVersion}</StatusBadge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-assistiertes Trading-Cockpit · Shadow-Systeme erklären, sie traden nicht.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone="success" dot>Online</StatusBadge>
        <StatusBadge tone="info">Mode: {SYSTEM_STATUS.tradingMode}</StatusBadge>
        <StatusBadge tone="learning">Governor: propose_only</StatusBadge>
        <StatusBadge tone="warning">AutoApply: OFF</StatusBadge>
        <StatusBadge tone="warning">Balance: WARN</StatusBadge>
        <StatusBadge tone="muted">Scan {SYSTEM_STATUS.lastScan}</StatusBadge>
        <StatusBadge tone="muted">Nightly {SYSTEM_STATUS.lastNightlyReport}</StatusBadge>
      </div>
    </GlassCard>
  );
}

function KpiGrid() {
  const k = KPIS;
  return (
    <section>
      <SectionTitle
        title="Key Performance"
        subtitle="Winrate alleine ist nicht aussagekräftig — immer im Kontext lesen."
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        <KpiCard label="Profit Factor" value={k.profitFactor.toFixed(2)} tone="warning"
          hint="< 1.0 = Verlustsystem" icon={<Gauge className="h-4 w-4" />} />
        <KpiCard label="Expectancy" value={`$${k.expectancy.toFixed(2)}`} tone="danger"
          hint="pro Trade · negativ" icon={<Target className="h-4 w-4" />} />
        <KpiCard label="Winrate" value={`${k.winrate}%`} tone="warning"
          hint="hoch, aber Payoff schwach" icon={<Percent className="h-4 w-4" />} />
        <KpiCard label="Avg Win / Loss" value={
          <span><span className="text-success">+${k.avgWin.toFixed(2)}</span> <span className="text-muted-foreground">/</span> <span className="text-destructive">${k.avgLoss.toFixed(2)}</span></span>
        } hint="Asymmetrie: Verluste >> Gewinne" icon={<TrendingDown className="h-4 w-4" />} />
        <KpiCard label="MFE0 Loss Rate" value={`${k.mfe0LossRate}%`} tone="danger"
          hint="Trades, die nie ins Plus liefen" icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Balance Integrity" value="WARN" tone="warning"
          hint="stale offset · AutoApply blockiert" icon={<ShieldAlert className="h-4 w-4" />} />
        <KpiCard label="Open Positions" value={k.openPositions} tone="info"
          hint="aktiv im Markt" icon={<Briefcase className="h-4 w-4" />} />
        <KpiCard label="Daily PnL / DD" value={
          <span><span className="text-destructive">${k.dailyPnl.toFixed(2)}</span> <span className="text-muted-foreground text-sm">/ {k.dailyDrawdown}%</span></span>
        } tone="danger" hint="Risk: $1.20 alloziert" icon={<TrendingUp className="h-4 w-4" />} />
      </div>
    </section>
  );
}

function NarrativePanel() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <GlassCard className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-base font-semibold">Was passiert gerade?</h3>
        </div>
        <ul className="space-y-2">
          {NARRATIVE.map((line, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
      <GlassCard className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <h3 className="text-base font-semibold">Wichtige Hinweise</h3>
        </div>
        <ul className="space-y-2">
          {WARNINGS.map((w, i) => {
            const tone = w.tone as "warning" | "danger" | "info";
            const Icon = tone === "danger" ? AlertTriangle : tone === "info" ? Info : AlertTriangle;
            const color = tone === "danger" ? "text-destructive" : tone === "info" ? "text-info" : "text-warning";
            return (
              <li key={i} className="flex gap-2.5 text-sm">
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} />
                <span className="text-muted-foreground">{w.text}</span>
              </li>
            );
          })}
        </ul>
      </GlassCard>
    </section>
  );
}

function PetsSection() {
  return (
    <section>
      <SectionTitle
        title="System Pets · Modul-Begleiter"
        subtitle="Jedes Pet repräsentiert ein ClaudeTrader-Modul. Shadow-Pets analysieren nur."
      />
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PETS.map((p) => (
          <div key={p.id} className="w-[88%] shrink-0 snap-start">
            <PetCard pet={p} />
          </div>
        ))}
      </div>
      <div className="hidden gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-4">
        {PETS.map((p) => <PetCard key={p.id} pet={p} />)}
      </div>
    </section>
  );
}
