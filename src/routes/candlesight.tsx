import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { StatusBadge } from "@/components/status-badge";
import { KpiCard } from "@/components/kpi-card";

export const Route = createFileRoute("/candlesight")({
  head: () => ({ meta: [{ title: "CandleSight · ClaudeTrader" }, { name: "description", content: "CandleSight Shadow-only Auswertung." }] }),
  component: CandleSightPage,
});

const CARDS = [
  { name: "Falling-Knife Risk", value: "Mid", tone: "warning" as const },
  { name: "Fakeout Risk", value: "High", tone: "danger" as const },
  { name: "Exit Pressure", value: "Mid", tone: "warning" as const },
  { name: "Runner Structure", value: "Watch", tone: "info" as const },
  { name: "Wick Pressure", value: "Low", tone: "success" as const },
  { name: "Breakout State", value: "Pending", tone: "muted" as const },
  { name: "Momentum State", value: "Cooling", tone: "info" as const },
];

function CandleSightPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionTitle title="CandleSight" subtitle="Shadow-only Kerzenanalyse. Sample wächst." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Mode" value="Shadow-only" tone="warning" />
        <KpiCard label="Samples" value="412" tone="info" />
        <KpiCard label="Joined Trades" value="187" tone="info" />
        <KpiCard label="Last Event" value="vor 2 Min." tone="info" />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        {CARDS.map((c) => (
          <GlassCard key={c.name} className="space-y-1.5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.name}</div>
            <StatusBadge tone={c.tone}>{c.value}</StatusBadge>
          </GlassCard>
        ))}
      </div>

      <ShadowTable title="High FallingKnife Risk" cols={["Symbol", "Count", "MFE0", "Expectancy", "Sample"]}
        rows={[
          ["BTC/USDT", 18, "46%", "-$1.4", "ok"],
          ["SOL/USDT", 9, "42%", "-$0.8", "klein"],
        ]} />
      <ShadowTable title="High ExitPressure" cols={["Symbol", "Count", "Plus-to-Minus", "False Alarm", "Sample"]}
        rows={[
          ["ETH/USDT", 22, "38%", "12%", "ok"],
          ["ADA/USDT", 6, "31%", "20%", "klein"],
        ]} />
      <ShadowTable title="High RunnerStructure" cols={["Symbol", "Count", "Runner-Win Rate", "Expectancy", "Sample"]}
        rows={[
          ["BTC/USDT", 7, "58%", "+$24.8", "ok"],
          ["AVAX/USDT", 3, "—", "—", "Sample too small"],
        ]} />

      <GlassCard className="text-sm text-muted-foreground">
        Bei zu kleinem Sample bleibt CandleSight Shadow-only. Keine Live-Eingriffe.
      </GlassCard>
    </div>
  );
}

function ShadowTable({ title, cols, rows }: { title: string; cols: string[]; rows: (string | number)[][] }) {
  return (
    <section>
      <SectionTitle title={title} />
      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--glass-border)] text-left text-xs uppercase tracking-wider text-muted-foreground">
              {cols.map((c) => <th key={c} className="px-4 py-3 font-medium">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-[var(--glass-border)] last:border-0">
                {r.map((c, j) => <td key={j} className="px-4 py-3 tabular-nums">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </section>
  );
}
