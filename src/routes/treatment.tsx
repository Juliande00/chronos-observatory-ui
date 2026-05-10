import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { StatusBadge } from "@/components/status-badge";
import { TREATMENT_BUCKETS, NO_BOOST, REDUCE, FAIL_FAST } from "@/lib/mock-data";

export const Route = createFileRoute("/treatment")({
  head: () => ({ meta: [{ title: "Trade Treatment · ClaudeTrader" }, { name: "description", content: "Treatment Intelligence: Micro-Wins, Runner, MFE0, Time-Catastrophes." }] }),
  component: TreatmentPage,
});

function TreatmentPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <SectionTitle title="Trade Treatment" subtitle="Klassifizierung der Trades nach Qualität und Verlustmuster." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {TREATMENT_BUCKETS.map((b) => (
          <GlassCard key={b.name} className="space-y-1.5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{b.name}</div>
            <div className={`text-2xl font-semibold tabular-nums ${b.pnl >= 0 ? "text-success" : "text-destructive"}`}>
              {b.pnl >= 0 ? "+" : ""}${b.pnl.toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">{b.count} trades · avg ${b.avg.toFixed(2)}</div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <StatusBadge tone="muted">PF {b.pf.toFixed(2)}</StatusBadge>
              <StatusBadge tone="muted">E ${b.exp.toFixed(2)}</StatusBadge>
              <StatusBadge tone={b.severity as any}>{b.severity}</StatusBadge>
            </div>
          </GlassCard>
        ))}
      </div>

      <Table title="Top No-Boost Candidates" rows={NO_BOOST.map((r) => [r.key, r.pf.toFixed(2), `$${r.exp.toFixed(2)}`, `${(r.mfe0 * 100).toFixed(1)}%`, r.n, r.reason])}
        cols={["Key", "PF", "Expectancy", "MFE0 Rate", "n", "Reason"]} />
      <Table title="Top Reduce Candidates" rows={REDUCE.map((r) => [r.key, r.pf.toFixed(2), `$${r.exp.toFixed(2)}`, `${(r.mfe0 * 100).toFixed(1)}%`, r.n, r.reason])}
        cols={["Key", "PF", "Expectancy", "MFE0 Rate", "n", "Reason"]} />
      <Table title="Top Fail-Fast Watch" rows={FAIL_FAST.map((r) => [r.key, r.reason, `${(r.mfe0 * 100).toFixed(1)}%`, `${(r.time * 100).toFixed(1)}%`, r.n])}
        cols={["Key", "Reason", "MFE0", "Time-Exit Risk", "n"]} />
    </div>
  );
}

function Table({ title, cols, rows }: { title: string; cols: string[]; rows: (string | number)[][] }) {
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
              <tr key={i} className="border-b border-[var(--glass-border)] last:border-0 hover:bg-[oklch(0.25_0.04_265_/_40%)]">
                {r.map((c, j) => <td key={j} className="px-4 py-3 tabular-nums">{c ?? "n/a"}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </section>
  );
}
