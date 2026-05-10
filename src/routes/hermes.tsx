import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { StatusBadge } from "@/components/status-badge";
import { KpiCard } from "@/components/kpi-card";

export const Route = createFileRoute("/hermes")({
  head: () => ({ meta: [{ title: "Hermes / XGBoost · ClaudeTrader" }, { name: "description", content: "Hermes Risk-Sensor und XGBoost Reality-Check." }] }),
  component: HermesPage,
});

function HermesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section>
        <SectionTitle title="Hermes Shadow / Learning" subtitle="Risk-Sensor — kein harter Blocker." />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <KpiCard label="Mode" value="Shadow / Learning" tone="warning" />
          <KpiCard label="RISK_OFF" value="helpful" tone="success" hint="net positiv" />
          <KpiCard label="Correct Risk-Off" value="42" tone="success" />
          <KpiCard label="Missed Wins" value="12" tone="warning" />
          <KpiCard label="Missed Runners" value="3" tone="warning" />
          <KpiCard label="Missed Micro" value="9" tone="muted" />
          <KpiCard label="Net Value" value="+$184" tone="success" />
          <KpiCard label="Reason Codes" value="7" tone="info" />
        </div>
        <GlassCard className="mt-4 text-sm text-muted-foreground">
          Hermes ist Risk-Sensor, kein harter Blocker. Signale gehen ins Learning, nicht in den Order-Pfad.
        </GlassCard>
      </section>

      <section>
        <SectionTitle title="XGBoost Buckets" subtitle="Reality-Check: hohe Confidence ist kein Boost-Signal, wenn PF/Expectancy negativ ist." />
        <GlassCard className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--glass-border)] text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-medium">Bucket</th>
                <th className="px-4 py-3 font-medium">Winrate</th>
                <th className="px-4 py-3 font-medium">PF</th>
                <th className="px-4 py-3 font-medium">Expectancy</th>
                <th className="px-4 py-3 font-medium">MFE0</th>
                <th className="px-4 py-3 font-medium">Boost-safe</th>
              </tr>
            </thead>
            <tbody>
              {[
                { b: "low (0.0–0.3)", wr: "48%", pf: "0.74", e: "-$2.1", m: "44%", safe: false },
                { b: "mid (0.3–0.6)", wr: "55%", pf: "0.92", e: "-$0.4", m: "38%", safe: false },
                { b: "high (0.6–0.85)", wr: "61%", pf: "0.96", e: "-$0.1", m: "33%", safe: false },
                { b: "very high (0.85+)", wr: "68%", pf: "1.18", e: "+$1.4", m: "21%", safe: true },
              ].map((r) => (
                <tr key={r.b} className="border-b border-[var(--glass-border)] last:border-0">
                  <td className="px-4 py-3">{r.b}</td>
                  <td className="px-4 py-3 tabular-nums">{r.wr}</td>
                  <td className="px-4 py-3 tabular-nums">{r.pf}</td>
                  <td className="px-4 py-3 tabular-nums">{r.e}</td>
                  <td className="px-4 py-3 tabular-nums">{r.m}</td>
                  <td className="px-4 py-3"><StatusBadge tone={r.safe ? "success" : "warning"}>{r.safe ? "yes" : "no"}</StatusBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
        <GlassCard className="mt-4 text-sm text-muted-foreground">
          XGBoost <span className="text-foreground">high</span> ist kein Boost-Signal, wenn PF/Expectancy negativ ist.
        </GlassCard>
      </section>
    </div>
  );
}
