import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { Database, BookOpen, Trash2 } from "lucide-react";

export const Route = createFileRoute("/memory")({
  head: () => ({ meta: [{ title: "Memory · OmniTrader" }] }),
  component: MemoryPage,
});

const INSIGHTS = [
  { id: "MEM-114", topic: "MFE0 Losses", source: "battle_arena/run_2842", evidence: "39% der Trades nie ins Plus", confidence: 0.82, type: "risk" },
  { id: "MEM-112", topic: "Asia-Session schwach", source: "trades_db/last_30d", evidence: "PF 0.61 zwischen 02-06 UTC", confidence: 0.74, type: "strategy" },
  { id: "MEM-109", topic: "Hermes risk-off Filter", source: "hermes/judgments_2025-05", evidence: "+12% Avoided Loss", confidence: 0.69, type: "strategy" },
  { id: "MEM-104", topic: "Break-even Protect zu früh", source: "treatment/exit_review", evidence: "Retained Profit -18%", confidence: 0.71, type: "treatment" },
];

const REJECTED = [
  { id: "MEM-098", topic: "Aggressive Risk-Up bei WR>60", reason: "Drawdown-Risiko zu hoch", by: "Governor" },
  { id: "MEM-091", topic: "AutoApply für CandleSight", reason: "Shadow-Phase nicht abgeschlossen", by: "Safety" },
];

function MemoryPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Memory" subtitle="Was das System gelernt hat – mit Quelle und Evidenz." status="ONLINE" />

      <section className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Memory Status" value="Healthy" tone="success" icon={<Database className="h-4 w-4" />} />
        <KpiCard label="Insights" value={INSIGHTS.length} tone="info" />
        <KpiCard label="Active Rules" value="14" tone="info" />
        <KpiCard label="Last Update" value="04:12" tone="muted" />
        <KpiCard label="Stale Memory" value="2" tone="warning" />
        <KpiCard label="Confidence Avg" value="0.74" tone="learning" />
      </section>

      <GlassCard>
        <SectionTitle title="Memory Insights" subtitle="Jeder Eintrag verlinkt zur Quelle (read-only)." />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-[10px] uppercase text-muted-foreground">
              <tr className="text-left">
                <th className="py-2 pr-3">ID</th>
                <th className="py-2 pr-3">Topic</th>
                <th className="py-2 pr-3">Type</th>
                <th className="py-2 pr-3">Evidence</th>
                <th className="py-2 pr-3">Source</th>
                <th className="py-2 pr-3">Conf.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {INSIGHTS.map((m) => (
                <tr key={m.id}>
                  <td className="py-2 pr-3 font-mono text-muted-foreground">{m.id}</td>
                  <td className="py-2 pr-3 font-medium">{m.topic}</td>
                  <td className="py-2 pr-3"><StatusBadge tone="info">{m.type}</StatusBadge></td>
                  <td className="py-2 pr-3 text-muted-foreground">{m.evidence}</td>
                  <td className="py-2 pr-3 font-mono text-[10px] text-muted-foreground">{m.source}</td>
                  <td className="py-2 pr-3 tabular-nums">{m.confidence.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <section className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <SectionTitle title="Strategy Learnings" />
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Asia-Session: PF schwach → Filter aktiv (shadow)</li>
            <li>• Trendfolger ETH 1h: bevorzugt nach Hermes risk-on</li>
            <li>• Range-Breakout BTC: nur bei Volatility &gt; 1.4σ</li>
          </ul>
        </GlassCard>
        <GlassCard>
          <SectionTitle title="Risk Learnings" />
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Stop &lt; 0.6R → MFE0-Rate steigt um 21%</li>
            <li>• Open Risk &gt; $1.50 → Drawdown-Cluster</li>
            <li>• Balance-Offset stale → AutoApply-Lock empfohlen</li>
          </ul>
        </GlassCard>
        <GlassCard>
          <SectionTitle title="Treatment Learnings" />
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Peak-Exit zu früh nach 0.6R (retain ratio 0.34)</li>
            <li>• Break-even Protect: stricter bei Range-Markets</li>
            <li>• Take-Profit-Skalierung 50/50 statt 100%</li>
          </ul>
        </GlassCard>
        <GlassCard>
          <SectionTitle title="Deprecated / Rejected Rules" />
          <ul className="space-y-2 text-sm">
            {REJECTED.map((r) => (
              <li key={r.id} className="flex items-start gap-2 text-muted-foreground">
                <Trash2 className="mt-0.5 h-3 w-3 text-destructive" />
                <div>
                  <span className="font-medium text-foreground">{r.topic}</span>
                  <span className="ml-2 text-[10px] text-muted-foreground">[{r.id}]</span>
                  <div className="text-[11px]">{r.reason} · von {r.by}</div>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </section>

      <GlassCard className="flex items-start gap-3">
        <BookOpen className="mt-0.5 h-5 w-5 text-info" />
        <p className="text-xs text-muted-foreground">
          Memory zeigt nur evidenzbasierte Erkenntnisse mit Quelle und Confidence – keine magischen Behauptungen.
          Aktive Regeln gelten ausschließlich im Shadow-/Propose-Modus, bis Governor sie freigibt.
        </p>
      </GlassCard>
    </div>
  );
}
