import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { PageHeader } from "@/components/page-header";
import { PetCard } from "@/components/pet-card";
import { KPIS, NARRATIVE, WARNINGS, PETS } from "@/lib/mock-data";
import {
  Activity, AlertTriangle, Info, ShieldAlert, Target, Wallet, Briefcase, Percent, Gauge, TrendingDown, TrendingUp,
  Cpu, Server, HeartPulse,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview · OmniTrader Dashboard v1.1" },
      { name: "description", content: "Mission Control Übersicht über OmniTrader & ClaudeTrader." },
    ],
  }),
  component: Overview,
});

function Overview() {
  return (
    <div className="relative mx-auto max-w-7xl space-y-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-50" />
      <PageHeader
        title="Overview"
        subtitle="OmniTrader observability cockpit · alle Kern-Subsysteme im Blick."
        status="WARN"
        role="Admin"
      />

      <KpiGrid />

      <section className="grid gap-4 lg:grid-cols-3">
        <SystemHealth />
        <RiskSnapshot />
        <RecentActivity />
      </section>

      <NarrativeAndWarnings />

      <PetsSection />
    </div>
  );
}

function KpiGrid() {
  const k = KPIS;
  return (
    <section>
      <SectionTitle title="KPI Mission Control" subtitle="System-, Risiko- und Trading-Health auf einen Blick." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        <KpiCard label="System Severity" value="WARN" tone="warning" icon={<ShieldAlert className="h-4 w-4" />} />
        <KpiCard label="ClaudeTrader Health" value="98%" tone="success" icon={<HeartPulse className="h-4 w-4" />} />
        <KpiCard label="OmniTrader Health" value="99%" tone="success" icon={<Cpu className="h-4 w-4" />} />
        <KpiCard label="Endpoints OK" value="11/11" tone="success" icon={<Server className="h-4 w-4" />} />
        <KpiCard label="Open Positions" value={k.openPositions} tone="info" icon={<Briefcase className="h-4 w-4" />} />
        <KpiCard label="Daily PnL" value={`$${k.dailyPnl.toFixed(2)}`} tone="danger" icon={<TrendingDown className="h-4 w-4" />} />
        <KpiCard label="Balance" value="$1003.21" tone="info" icon={<Wallet className="h-4 w-4" />} />
        <KpiCard label="Drawdown" value={`${k.dailyDrawdown}%`} tone="warning" icon={<TrendingDown className="h-4 w-4" />} />
        <KpiCard label="Safety Violations" value="1" tone="warning" />
        <KpiCard label="AutoApply" value="OFF" tone="warning" />
        <KpiCard label="Hermes Mode" value="shadow" tone="learning" />
        <KpiCard label="XGBoost" value="shadow" tone="learning" />
        <KpiCard label="BattleArena" value="ok" tone="success" />
        <KpiCard label="CandleSight" value="ok" tone="success" />
        <KpiCard label="MiroFish Sev" value="WARN" tone="warning" />
        <KpiCard label="Profit Factor" value={k.profitFactor.toFixed(2)} tone="warning" icon={<Gauge className="h-4 w-4" />} />
        <KpiCard label="Expectancy" value={`$${k.expectancy.toFixed(2)}`} tone="danger" icon={<Target className="h-4 w-4" />} />
        <KpiCard label="Winrate" value={`${k.winrate}%`} tone="warning" icon={<Percent className="h-4 w-4" />} />
      </div>
    </section>
  );
}

function SystemHealth() {
  const slow = [
    { name: "/api/treatment", latency: 642 },
    { name: "/api/battle-arena", latency: 812 },
    { name: "/api/candlesight", latency: 540 },
  ];
  return (
    <GlassCard>
      <SectionTitle title="System Health" />
      <ul className="space-y-1.5 text-xs text-muted-foreground">
        <li className="flex justify-between"><span>API Status</span><StatusBadge tone="success" dot>online</StatusBadge></li>
        <li className="flex justify-between"><span>PM2</span><StatusBadge tone="success">running</StatusBadge></li>
        <li className="flex justify-between"><span>Last Scan</span><span className="tabular-nums text-foreground">14s</span></li>
        <li className="flex justify-between"><span>Last Report</span><span className="text-foreground">04:12</span></li>
        <li className="flex justify-between"><span>Avg Latency</span><span className="tabular-nums text-foreground">182ms</span></li>
      </ul>
      <div className="mt-3 border-t border-[var(--glass-border)] pt-2">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Slow Endpoints</div>
        <ul className="mt-1 space-y-1 text-xs">
          {slow.map((s) => (
            <li key={s.name} className="flex justify-between"><span className="font-mono">{s.name}</span><span className="text-warning tabular-nums">{s.latency}ms</span></li>
          ))}
        </ul>
      </div>
    </GlassCard>
  );
}

function RiskSnapshot() {
  return (
    <GlassCard>
      <SectionTitle title="Risk Snapshot" />
      <ul className="space-y-1.5 text-xs">
        <li className="flex justify-between"><span className="text-muted-foreground">Balance</span><span className="tabular-nums">$1003.21</span></li>
        <li className="flex justify-between"><span className="text-muted-foreground">Daily Loss</span><span className="tabular-nums text-destructive">-$42.18</span></li>
        <li className="flex justify-between"><span className="text-muted-foreground">Drawdown</span><span className="tabular-nums text-warning">-1.8%</span></li>
        <li className="flex justify-between"><span className="text-muted-foreground">Max Risk</span><span className="tabular-nums">$2.50</span></li>
        <li className="flex justify-between"><span className="text-muted-foreground">Risk Gate</span><StatusBadge tone="warning">guarded</StatusBadge></li>
        <li className="flex justify-between"><span className="text-muted-foreground">Balance Integrity</span><StatusBadge tone="warning">WARN</StatusBadge></li>
        <li className="flex justify-between"><span className="text-muted-foreground">Runtime vs SQLite</span><span className="text-warning tabular-nums">Δ $15.66</span></li>
        <li className="flex justify-between"><span className="text-muted-foreground">AutoApply</span><StatusBadge tone="warning">blocked</StatusBadge></li>
      </ul>
    </GlassCard>
  );
}

function RecentActivity() {
  const events = [
    { ts: "08:42", text: "Force scan executed", tone: "info" },
    { ts: "08:31", text: "Hermes risk-off applied (shadow)", tone: "learning" },
    { ts: "08:14", text: "AutoApply toggle blocked by policy", tone: "warning" },
    { ts: "07:58", text: "Trade ETH-PERP closed -0.7R", tone: "danger" },
    { ts: "07:30", text: "BattleArena audit completed", tone: "success" },
  ] as const;
  return (
    <GlassCard>
      <SectionTitle title="Recent Activity" />
      <ul className="space-y-1.5 text-xs">
        {events.map((e, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span className="tabular-nums text-muted-foreground">{e.ts}</span>
            <span className="flex-1">{e.text}</span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

function NarrativeAndWarnings() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <GlassCard>
        <div className="mb-3 flex items-center gap-2">
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
      <GlassCard>
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <h3 className="text-base font-semibold">Wichtige Hinweise</h3>
        </div>
        <ul className="space-y-2">
          {WARNINGS.map((w, i) => {
            const tone = w.tone as "warning" | "danger" | "info";
            const Icon = tone === "info" ? Info : AlertTriangle;
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
      <SectionTitle title="System Pets · Modul-Begleiter" subtitle="Shadow-Pets analysieren nur." />
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
