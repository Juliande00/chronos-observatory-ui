import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { Lock, ShieldAlert, Power, Pause, Play, Activity, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/operator")({
  head: () => ({ meta: [{ title: "Operator · OmniTrader" }] }),
  component: OperatorPage,
});

const LOG = [
  { ts: "08:42:11", action: "force_scan", result: "ok", role: "Admin", safety: "passed" },
  { ts: "08:31:55", action: "pause_request", result: "blocked", role: "Viewer", safety: "denied" },
  { ts: "08:14:02", action: "auto_apply_toggle", result: "blocked", role: "Admin", safety: "policy" },
  { ts: "07:58:30", action: "scan_cycle", result: "ok", role: "system", safety: "passed" },
];

function SafeBtn({ icon: Icon, label, disabled = true, danger }: any) {
  return (
    <button
      disabled={disabled}
      title={disabled ? "Requires explicit admin approval" : undefined}
      className={`inline-flex items-center gap-2 rounded-md border border-[var(--glass-border)] px-3 py-2 text-xs font-medium ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[oklch(0.30_0.06_265_/_70%)]"
      } ${danger ? "text-destructive" : ""}`}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
      {disabled && <Lock className="ml-1 h-3 w-3" />}
    </button>
  );
}

function OperatorPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Operator" subtitle="Read-only Kontrollansicht. Gefährliche Aktionen sind gesperrt." status="WARN" role="Admin" />

      <section className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Bot Status" value="Running" tone="success" icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="Scan Interval" value="15s" tone="info" />
        <KpiCard label="Last Scan" value="14s" tone="muted" />
        <KpiCard label="Market Mode" value="Live" tone="info" />
        <KpiCard label="Strategy" value="Balanced" tone="muted" />
        <KpiCard label="Live Positions" value="3" tone="info" />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <SectionTitle title="Trading Mode" subtitle="Aktuelle Sicherheitsschalter" />
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone="info">Mode: Shadow / Paper</StatusBadge>
            <StatusBadge tone="warning">Live Disabled</StatusBadge>
            <StatusBadge tone="warning">AutoApply OFF</StatusBadge>
            <StatusBadge tone="warning">Risk-Up OFF</StatusBadge>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Controls" subtitle="Alle gefährlichen Aktionen erfordern explizite Admin-Bestätigung" />
          <div className="flex flex-wrap gap-2">
            <SafeBtn icon={Power} label="Restart Bot" danger />
            <SafeBtn icon={Pause} label="Pause Trading" disabled={false} />
            <SafeBtn icon={Play} label="Resume Trading" />
            <SafeBtn icon={Activity} label="Force Scan" disabled={false} />
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Free shell · Live state mutation · Order placement → <span className="text-destructive">permanent gesperrt</span>.
          </p>
        </GlassCard>
      </section>

      <section>
        <SectionTitle title="Safety Locks" />
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          {[
            ["AutoApply", "warning"],
            ["Risk", "warning"],
            ["Daily Loss", "success"],
            ["Balance Integrity", "warning"],
            ["Auth", "success"],
            ["State Mutation", "danger"],
          ].map(([k, t]) => (
            <GlassCard key={k as string} className="flex items-center justify-between gap-2 p-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
                <div className="mt-1 text-xs font-semibold">Locked</div>
              </div>
              <StatusBadge tone={t as any} dot>locked</StatusBadge>
            </GlassCard>
          ))}
        </div>
      </section>

      <GlassCard>
        <SectionTitle title="Operator Log" subtitle="Audit-Trail aller Operator-Aktionen" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-[10px] uppercase text-muted-foreground">
              <tr className="text-left">
                <th className="py-2 pr-3">Timestamp</th>
                <th className="py-2 pr-3">Action</th>
                <th className="py-2 pr-3">Result</th>
                <th className="py-2 pr-3">Role</th>
                <th className="py-2 pr-3">Safety</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {LOG.map((l, i) => (
                <tr key={i}>
                  <td className="py-2 pr-3 tabular-nums text-muted-foreground">{l.ts}</td>
                  <td className="py-2 pr-3 font-mono">{l.action}</td>
                  <td className="py-2 pr-3">
                    <StatusBadge tone={l.result === "ok" ? "success" : "danger"}>{l.result}</StatusBadge>
                  </td>
                  <td className="py-2 pr-3">{l.role}</td>
                  <td className="py-2 pr-3">
                    <StatusBadge tone={l.safety === "passed" ? "success" : "warning"}>{l.safety}</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard glow="warning" className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
        <div className="text-sm">
          <div className="font-semibold text-warning">Safety-First Architektur</div>
          <p className="mt-1 text-xs text-muted-foreground">
            OmniTrader führt keine echten Orders aus, ändert keinen Live-State und verändert kein Risk-Profil. Alle Schalter
            sind beobachtend; gefährliche Aktionen sind als <ShieldAlert className="inline h-3 w-3" /> Lock markiert.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
