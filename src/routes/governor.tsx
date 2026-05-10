import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { StatusBadge } from "@/components/status-badge";
import { KpiCard } from "@/components/kpi-card";
import { NO_BOOST, REDUCE, FAIL_FAST } from "@/lib/mock-data";
import { Copy, FileDown, Eye, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/governor")({
  head: () => ({ meta: [{ title: "Nightly Governor · ClaudeTrader" }, { name: "description", content: "Nightly Learning Reports im propose_only Modus." }] }),
  component: GovernorPage,
});

function GovernorPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionTitle title="Nightly Governor" subtitle="Lernt nachts und erstellt Vorschläge. AutoApply OFF." />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Mode" value="propose_only" tone="learning" />
        <KpiCard label="AutoApply" value="OFF" tone="warning" />
        <KpiCard label="Size Increase" value="false" tone="muted" />
        <KpiCard label="Last Report" value="04:12" tone="info" hint="heute" />
        <KpiCard label="Status" value="ok" tone="success" />
        <KpiCard label="Discord" value="connected" tone="success" />
      </div>

      <GlassCard className="border border-warning/30 bg-warning/5">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-warning" />
          <p className="text-sm">
            <span className="font-medium text-warning">AutoApply OFF</span>
            <span className="text-muted-foreground"> – Vorschläge werden nicht automatisch angewendet.</span>
          </p>
        </div>
      </GlassCard>

      <div className="grid gap-3 md:grid-cols-3">
        <Metric label="Profit Factor" value="0.91" tone="warning" />
        <Metric label="Expectancy" value="-$0.35" tone="danger" />
        <Metric label="Winrate" value="56.4%" tone="warning" hint="aber PF schwach" />
        <Metric label="MFE0 Loss Rate" value="39.2%" tone="danger" />
        <Metric label="StopLoss-to-Peak" value="0.42" tone="warning" />
        <Metric label="TimeExit-to-Peak" value="0.31" tone="warning" />
      </div>

      <ProposalSection title="Top No-Boost Proposals" rows={NO_BOOST.map((r) => ({ key: r.key, reason: r.reason, sub: `PF ${r.pf} · E $${r.exp} · n=${r.n}` }))} />
      <ProposalSection title="Top Reduce Proposals" rows={REDUCE.map((r) => ({ key: r.key, reason: r.reason, sub: `PF ${r.pf} · E $${r.exp} · n=${r.n}` }))} />
      <ProposalSection title="Fail-Fast Watch" rows={FAIL_FAST.map((r) => ({ key: r.key, reason: r.reason, sub: `MFE0 ${(r.mfe0*100).toFixed(0)}% · Time ${(r.time*100).toFixed(0)}%` }))} />

      <GlassCard className="space-y-2">
        <h3 className="text-sm font-semibold">Modul-Warnungen</h3>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li>• Battle Arena: 3 Bots melden Risk-Off Tendenz auf ETH/TREND_RSI.</li>
          <li>• XGBoost: Bucket "high" zeigt PF unter 1.0 — Boost gesperrt.</li>
          <li>• Hermes: Risk-Sensor neutral, keine harten Blocker.</li>
          <li>• CandleSight: Falling-Knife Risk auf 4 Symbolen erhöht.</li>
          <li>• Balance Safety: stale offset — AutoApply blockiert.</li>
        </ul>
      </GlassCard>
    </div>
  );
}

function Metric({ label, value, tone, hint }: { label: string; value: string; tone: "success"|"warning"|"danger"|"info"; hint?: string }) {
  return <KpiCard label={label} value={value} tone={tone} hint={hint} />;
}

function ProposalSection({ title, rows }: { title: string; rows: { key: string; reason: string; sub: string }[] }) {
  return (
    <section>
      <SectionTitle title={title} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((r) => (
          <GlassCard key={r.key} className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="font-medium text-sm">{r.key}</div>
              <StatusBadge tone="learning">proposal</StatusBadge>
            </div>
            <div className="text-xs text-muted-foreground">{r.reason}</div>
            <div className="text-xs tabular-nums text-muted-foreground">{r.sub}</div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <Pill icon={<Eye className="h-3 w-3" />}>View</Pill>
              <Pill icon={<Copy className="h-3 w-3" />}>Copy</Pill>
              <Pill icon={<FileDown className="h-3 w-3" />}>Export</Pill>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
function Pill({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <button className="inline-flex items-center gap-1 rounded-md border border-[var(--glass-border)] bg-[oklch(0.22_0.04_265_/_60%)] px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground">
      {icon}{children}
    </button>
  );
}
