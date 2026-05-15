import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";
import { Database, Play, Clock, Table, AlertTriangle, History } from "lucide-react";

export const Route = createFileRoute("/sql-audit")({
  head: () => ({
    meta: [
      { title: "SQL Audit · OmniTrader" },
      { name: "description", content: "Read-only SQL Audit Konsole." },
    ],
  }),
  component: SqlAuditPage,
});

const SAMPLE_QUERIES = [
  { id: "q1", label: "Heutige Closed Trades", sql: "SELECT symbol, side, entry, exit, pnl, r FROM trades WHERE closed_at >= date('now') ORDER BY closed_at DESC;" },
  { id: "q2", label: "Risk Violations 24h", sql: "SELECT ts, reason, blocked_amount FROM risk_violations WHERE ts > datetime('now','-1 day') ORDER BY ts DESC;" },
  { id: "q3", label: "Letzte Memory Inserts", sql: "SELECT ts, bucket, grade, reason FROM memory_insights ORDER BY id DESC LIMIT 50;" },
  { id: "q4", label: "Endpoint Latency P95", sql: "SELECT endpoint, ROUND(quantile(latency_ms, 0.95)) AS p95 FROM api_metrics WHERE ts > datetime('now','-1 hour') GROUP BY endpoint ORDER BY p95 DESC;" },
  { id: "q5", label: "Hermes Shadow Decisions", sql: "SELECT ts, regime, proposal, applied FROM hermes_log WHERE shadow=1 ORDER BY ts DESC LIMIT 100;" },
];

const TABLES = [
  { name: "trades", rows: 14_823, size: "4.2 MB", lastWrite: "12s" },
  { name: "risk_violations", rows: 412, size: "180 KB", lastWrite: "3m" },
  { name: "memory_insights", rows: 6_238, size: "2.1 MB", lastWrite: "44s" },
  { name: "api_metrics", rows: 982_104, size: "412 MB", lastWrite: "1s" },
  { name: "hermes_log", rows: 33_201, size: "11 MB", lastWrite: "21s" },
  { name: "battle_arena_votes", rows: 88_517, size: "29 MB", lastWrite: "8s" },
  { name: "candlesight_events", rows: 56_122, size: "18 MB", lastWrite: "4s" },
  { name: "governor_proposals", rows: 411, size: "210 KB", lastWrite: "3h" },
];

const AUDIT = [
  { ts: "08:42:14", user: "viewer@local", action: "SELECT", target: "trades", rows: 24, status: "ok" },
  { ts: "08:41:02", user: "admin@local", action: "EXPLAIN", target: "api_metrics", rows: 0, status: "ok" },
  { ts: "08:39:55", user: "agent:luna", action: "INSERT", target: "governor_proposals", rows: 1, status: "ok" },
  { ts: "08:38:01", user: "viewer@local", action: "SELECT", target: "memory_insights", rows: 50, status: "ok" },
  { ts: "08:36:44", user: "viewer@local", action: "SELECT", target: "trades JOIN risk_violations", rows: 0, status: "blocked" },
  { ts: "08:35:10", user: "admin@local", action: "VACUUM", target: "api_metrics", rows: 0, status: "ok" },
] as const;

function SqlAuditPage() {
  const [sql, setSql] = useState(SAMPLE_QUERIES[0].sql);
  const [ran, setRan] = useState<{ rows: number; ms: number; ts: string } | null>(null);

  const run = () => {
    setRan({
      rows: Math.floor(Math.random() * 100) + 1,
      ms: Math.floor(Math.random() * 180) + 8,
      ts: new Date().toLocaleTimeString(),
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="SQL Audit"
        subtitle="Read-only Konsole · jede Query wird auditiert"
        status="ONLINE"
        role="Admin"
      />

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="DB Size" value="478 MB" tone="info" icon={<Database className="h-4 w-4" />} />
        <KpiCard label="Tables" value={TABLES.length} tone="muted" icon={<Table className="h-4 w-4" />} />
        <KpiCard label="Queries (1h)" value="412" tone="success" />
        <KpiCard label="Blocked" value="3" tone="warning" icon={<AlertTriangle className="h-4 w-4" />} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <GlassCard>
          <SectionTitle title="Schnell-Queries" />
          <ul className="space-y-1.5">
            {SAMPLE_QUERIES.map((q) => (
              <li key={q.id}>
                <button
                  onClick={() => setSql(q.sql)}
                  className={cn(
                    "w-full rounded-lg border border-[var(--glass-border)] px-3 py-2 text-left text-xs transition-colors",
                    sql === q.sql ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-[oklch(0.25_0.04_265_/_60%)]",
                  )}
                >
                  {q.label}
                </button>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <SectionTitle
            title="Query Editor"
            subtitle="SELECT-Statements erlaubt · Mutationen geblockt"
            action={
              <button
                onClick={run}
                className="inline-flex items-center gap-1.5 rounded-md bg-[var(--gradient-primary)] px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-[var(--shadow-glow-primary)]"
              >
                <Play className="h-3 w-3" /> Run
              </button>
            }
          />
          <textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            rows={6}
            spellCheck={false}
            className="w-full rounded-md border border-[var(--glass-border)] bg-[oklch(0.14_0.04_265_/_80%)] p-3 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="mt-3 rounded-lg border border-[var(--glass-border)] bg-[oklch(0.18_0.04_265_/_70%)] p-3">
            {ran ? (
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <StatusBadge tone="success" dot>OK</StatusBadge>
                <span className="text-muted-foreground">Rows: <span className="text-foreground tabular-nums">{ran.rows}</span></span>
                <span className="text-muted-foreground">Time: <span className="text-foreground tabular-nums">{ran.ms}ms</span></span>
                <span className="text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3" />{ran.ts}</span>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">Noch keine Query ausgeführt.</div>
            )}
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <SectionTitle title="Tabellen" subtitle="Live-Statistiken" />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-[var(--glass-border)]">
                  <th className="text-left py-1.5">Name</th>
                  <th className="text-right">Rows</th>
                  <th className="text-right">Size</th>
                  <th className="text-right">Last Write</th>
                </tr>
              </thead>
              <tbody>
                {TABLES.map((t) => (
                  <tr key={t.name} className="border-b border-[var(--glass-border)]/50 hover:bg-[oklch(0.25_0.04_265_/_40%)]">
                    <td className="py-1.5 font-mono">{t.name}</td>
                    <td className="text-right tabular-nums">{t.rows.toLocaleString()}</td>
                    <td className="text-right tabular-nums text-muted-foreground">{t.size}</td>
                    <td className="text-right tabular-nums text-muted-foreground">{t.lastWrite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Audit Trail" subtitle="Letzte Zugriffe" action={<History className="h-4 w-4 text-muted-foreground" />} />
          <ul className="space-y-1.5">
            {AUDIT.map((a, i) => (
              <li key={i} className="flex items-center gap-2 rounded-md border border-[var(--glass-border)] px-2.5 py-1.5 text-xs">
                <span className="tabular-nums text-muted-foreground">{a.ts}</span>
                <StatusBadge tone={a.status === "blocked" ? "danger" : "muted"}>{a.action}</StatusBadge>
                <span className="font-mono truncate flex-1">{a.target}</span>
                <span className="text-muted-foreground tabular-nums">{a.rows} rows</span>
                <span className="text-[10px] text-muted-foreground hidden md:inline">{a.user}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </section>
    </div>
  );
}
