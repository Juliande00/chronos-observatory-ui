import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { StatusBadge } from "@/components/status-badge";
import { KpiCard } from "@/components/kpi-card";
import { SPECIALIST_BOTS } from "@/lib/mock-data";

export const Route = createFileRoute("/arena")({
  head: () => ({ meta: [{ title: "Battle Arena · ClaudeTrader" }, { name: "description", content: "Specialist Bots im Shadow-Debate." }] }),
  component: ArenaPage,
});

function ArenaPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionTitle title="Battle Arena" subtitle="13 Specialist-Bots debattieren — Shadow-only." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Mode" value="Shadow-only" tone="warning" />
        <KpiCard label="Votes" value="1,284" tone="info" />
        <KpiCard label="Attribution" value="412" tone="info" />
        <KpiCard label="Last Vote" value="vor 38 Sek." tone="info" />
      </div>

      <SectionTitle title="Specialist Bots" />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {SPECIALIST_BOTS.map((b) => (
          <GlassCard key={b.name} className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-semibold">{b.name}</div>
                <div className="text-xs text-muted-foreground">{b.role}</div>
              </div>
              <StatusBadge tone={b.status === "helpful" ? "success" : b.status === "suspicious" ? "warning" : "muted"}>
                {b.status === "sample" ? "sample too small" : b.status}
              </StatusBadge>
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <StatusBadge tone="muted">vote: {b.vote}</StatusBadge>
              <StatusBadge tone="muted">n={b.n}</StatusBadge>
              <StatusBadge tone="muted">acc: {b.acc != null ? (b.acc * 100).toFixed(0) + "%" : "n/a"}</StatusBadge>
            </div>
          </GlassCard>
        ))}
      </div>

      <SectionTitle title="Debate View" subtitle="Aktuelle Diskussion zum letzten Setup." />
      <div className="grid gap-3 lg:grid-cols-3">
        <DebateCard title="Bull Case" tone="success">RunnerScoutBot sieht Runner-Struktur.</DebateCard>
        <DebateCard title="Bear Case" tone="danger">MFE0GuardBot warnt vor Sofortverlust.</DebateCard>
        <DebateCard title="Risk Case" tone="warning">BalanceRiskBot sieht Balance WARN.</DebateCard>
      </div>
      <GlassCard className="border border-learning/30">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Manager Summary</div>
        <p className="mt-1 text-sm">No-Boost empfohlen. Reduce-Watch. <span className="text-warning">Keine Live-Änderung — Battle Arena ist Shadow-only.</span></p>
      </GlassCard>
    </div>
  );
}

function DebateCard({ title, tone, children }: { title: string; tone: "success"|"danger"|"warning"; children: React.ReactNode }) {
  return (
    <GlassCard glow={tone === "success" ? "success" : tone === "danger" ? "danger" : "warning"} className="space-y-2">
      <StatusBadge tone={tone}>{title}</StatusBadge>
      <p className="text-sm">{children}</p>
    </GlassCard>
  );
}
