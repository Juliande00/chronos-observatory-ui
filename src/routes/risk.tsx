import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { StatusBadge } from "@/components/status-badge";
import { KpiCard } from "@/components/kpi-card";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/risk")({
  head: () => ({ meta: [{ title: "Balance & Risk · ClaudeTrader" }, { name: "description", content: "Runtime vs DB Balance, Drawdown und Rebase Dry-Run." }] }),
  component: RiskPage,
});

function RiskPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionTitle title="Balance & Risk" subtitle="Balance Integrity entscheidet, ob AutoApply blockiert wird." />

      <GlassCard className="border border-warning/30 bg-warning/5">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-warning" />
          <div className="text-sm">
            <span className="font-medium text-warning">Balance WARN</span>
            <span className="text-muted-foreground"> – AutoApply blockiert. Stale offset erkannt.</span>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        <KpiCard label="Runtime Balance" value="$10,420.18" tone="info" />
        <KpiCard label="DB Reconstructed" value="$10,402.74" tone="info" />
        <KpiCard label="Difference" value="+$17.44" tone="warning" />
        <KpiCard label="sqliteOffsetPnl" value="$8.21" tone="warning" hint="stale" />
        <KpiCard label="Stale Offset" value="yes" tone="danger" />
        <KpiCard label="Equity Curve" value="declining" tone="warning" />
        <KpiCard label="Daily Drawdown" value="-1.8%" tone="warning" />
        <KpiCard label="Daily PnL" value="-$42.18" tone="danger" />
      </div>

      <SectionTitle title="Open Allocated Risk" />
      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--glass-border)] text-left text-xs uppercase tracking-wider text-muted-foreground">
              {["Symbol", "Side", "Allocated", "% of Equity", "Risk Flag"].map((c) => <th key={c} className="px-4 py-3 font-medium">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {[
              ["BTC/USDT", "LONG", "$42.10", "0.40%", "ok"],
              ["ETH/USDT", "SHORT", "$48.20", "0.46%", "MFE0 risk"],
              ["SOL/USDT", "LONG", "$35.40", "0.34%", "Sample small"],
            ].map((r, i) => (
              <tr key={i} className="border-b border-[var(--glass-border)] last:border-0">
                {r.map((c, j) => (
                  <td key={j} className="px-4 py-3 tabular-nums">
                    {j === 4 ? <StatusBadge tone={c === "ok" ? "success" : "warning"}>{c}</StatusBadge> : c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      <section>
        <SectionTitle title="Balance Rebase Dry-Run" subtitle="Nur Vorschau — kein automatischer Apply." />
        <GlassCard className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Required offset</span><span className="tabular-nums">+$17.44</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Dry-run result</span><StatusBadge tone="success">would balance</StatusBadge></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Apply</span><StatusBadge tone="warning">requires confirmation</StatusBadge></div>
          <p className="pt-2 text-xs text-muted-foreground">Im Prototype keine Korrektur möglich. Operator-Bestätigung erforderlich.</p>
        </GlassCard>
      </section>
    </div>
  );
}
