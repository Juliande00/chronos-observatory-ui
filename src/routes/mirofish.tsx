import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { Aquarium, useAquariumToggle, AQUARIUM_RESIDENTS } from "@/components/aquarium";
import {
  Activity, Bug, Bot, History, Info, MessageSquare, FlaskConical, Network, LayoutDashboard,
  AlertTriangle, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mirofish")({
  head: () => ({ meta: [{ title: "MiroFish · OmniTrader" }] }),
  component: MiroFishPage,
});

const TABS = [
  { id: "overview", label: "Überblick", icon: LayoutDashboard },
  { id: "health", label: "System Health", icon: Activity },
  { id: "findings", label: "Findings", icon: Bug },
  { id: "agents", label: "Agenten", icon: Bot },
  { id: "history", label: "Verlauf", icon: History },
  { id: "meta", label: "Meta", icon: Info },
  { id: "ask", label: "Ask MiroFish", icon: MessageSquare },
  { id: "blocker", label: "Blocker Lab", icon: FlaskConical },
  { id: "evidence", label: "Evidence", icon: Network },
] as const;

type TabId = typeof TABS[number]["id"];

const ENDPOINTS = [
  { name: "/api/health", code: 200, ok: true, latency: 24, note: "" },
  { name: "/api/risk", code: 200, ok: true, latency: 38, note: "" },
  { name: "/api/trades", code: 200, ok: true, latency: 71, note: "" },
  { name: "/api/treatment", code: 200, ok: true, latency: 642, note: "slow > 500ms" },
  { name: "/api/battle-arena", code: 200, ok: true, latency: 812, note: "slow > 500ms" },
  { name: "/api/candlesight", code: 200, ok: true, latency: 540, note: "slow > 500ms" },
  { name: "/api/hermes", code: 200, ok: true, latency: 95, note: "shadow" },
  { name: "/api/governor", code: 200, ok: true, latency: 110, note: "" },
  { name: "/api/memory", code: 200, ok: true, latency: 67, note: "" },
  { name: "/api/auth/status", code: 200, ok: true, latency: 19, note: "" },
  { name: "/api/reports/latest", code: 200, ok: true, latency: 130, note: "" },
];

const FINDINGS = [
  { id: "F-2031", sev: "P1", area: "Risk · Balance Integrity", live: true, src: "risk_snapshot", next: "Offset reconciliation prüfen" },
  { id: "F-2030", sev: "P2", area: "Hermes shadow", live: false, src: "hermes_audit", next: "Info – kein Blocker" },
  { id: "F-2029", sev: "P3", area: "CandleSight slow endpoint", live: false, src: "endpoint_probe", next: "Latency-Profiling planen" },
  { id: "F-2028", sev: "P1", area: "MFE0 Loss Rate hoch", live: true, src: "battle_arena", next: "Stop/Entry Review" },
];

const AGENTS = [
  { name: "Health Monitor", status: "ok", summary: "Alle Endpoints antworten", findings: 0, warns: 3, evidence: "endpoint_probe@08:42" },
  { name: "Safety Guard", status: "warn", summary: "Balance Integrity WARN", findings: 1, warns: 1, evidence: "risk_snapshot" },
  { name: "Drift Detector", status: "ok", summary: "Keine Schema-Driftpunkte", findings: 0, warns: 0, evidence: "drift_check" },
  { name: "Change Tracker", status: "ok", summary: "CT 6.32.4 unverändert", findings: 0, warns: 0, evidence: "changelog_diff" },
];

const HISTORY = Array.from({ length: 12 }).map((_, i) => ({
  id: `RPT-${(2031 - i).toString().padStart(4, "0")}`,
  ts: `2026-05-${(13 - Math.floor(i / 4)).toString().padStart(2, "0")} ${(23 - (i % 4) * 6).toString().padStart(2, "0")}:00`,
  sev: i === 0 ? "P1" : i < 3 ? "P2" : "P3",
  duration: 1200 + i * 80,
  schema: "1.4.0",
  ct: "6.32.4",
  ot: "1.1.0",
  warns: 4 + (i % 3),
}));

function MiroFishPage() {
  const [tab, setTab] = useState<TabId>("overview");
  const { enabled, toggle } = useAquariumToggle();

  return (
    <div className="relative mx-auto max-w-7xl space-y-6">
      {enabled && <Aquarium severity="warn" />}
      <PageHeader title="MiroFish AI Review" subtitle="Evidence-first system review center · read-only" status="WARN" />

      <GlassCard className="flex flex-wrap items-center gap-2 p-3">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border border-[var(--glass-border)] px-2.5 py-1.5 text-xs",
                tab === t.id ? "bg-primary/15 text-primary border-primary/40" : "text-muted-foreground hover:bg-[oklch(0.30_0.06_265_/_50%)]",
              )}
            >
              <Icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-2 text-[11px]">
          <span className="text-muted-foreground">Aquarium</span>
          <button
            onClick={toggle}
            className={cn(
              "rounded-full border border-[var(--glass-border)] px-2 py-0.5",
              enabled ? "bg-success/20 text-success" : "bg-muted/40 text-muted-foreground",
            )}
          >{enabled ? "ON" : "OFF"}</button>
        </div>
      </GlassCard>

      {tab === "overview" && <OverviewTab />}
      {tab === "health" && <HealthTab />}
      {tab === "findings" && <FindingsTab />}
      {tab === "agents" && <AgentsTab />}
      {tab === "history" && <HistoryTab />}
      {tab === "meta" && <MetaTab />}
      {tab === "ask" && <AskTab />}
      {tab === "blocker" && <BlockerTab />}
      {tab === "evidence" && <EvidenceTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <>
      <GlassCard glow="warning" className="border border-warning/30">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <div>
            <div className="text-sm font-semibold text-warning">Arbiter Severity: WARN</div>
            <div className="text-xs text-muted-foreground">2 Findings P1 · 1 P2 · 1 P3 · stale balance offset</div>
          </div>
        </div>
      </GlassCard>
      <section className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="System Severity" value="WARN" tone="warning" />
        <KpiCard label="Endpoints OK" value="11/11" tone="success" />
        <KpiCard label="Safety Violations" value="1" tone="warning" />
        <KpiCard label="Drift Status" value="clean" tone="success" />
        <KpiCard label="Last Check" value="14s ago" tone="muted" />
        <KpiCard label="Report Duration" value="1.21s" tone="muted" />
        <KpiCard label="Schema Version" value="1.4.0" tone="info" />
        <KpiCard label="ClaudeTrader" value="6.32.4" tone="info" />
        <KpiCard label="OmniTrader" value="1.1.0" tone="info" />
      </section>
      <GlassCard>
        <SectionTitle title="Recommendation Preview" />
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Balance offset reconciliation manuell prüfen (Operator → Risk).</li>
          <li>• Stop/Entry Review für MFE0-Cluster (Treatment Tab).</li>
          <li>• Latency-Profiling für slow endpoints planen.</li>
        </ul>
      </GlassCard>
    </>
  );
}

function HealthTab() {
  return (
    <GlassCard>
      <SectionTitle title="System Health" subtitle="Endpoint evidence (read-only probe)" />
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="text-[10px] uppercase text-muted-foreground">
            <tr className="text-left">
              <th className="py-2 pr-3">Endpoint</th>
              <th className="py-2 pr-3">HTTP</th>
              <th className="py-2 pr-3">OK</th>
              <th className="py-2 pr-3">Latency</th>
              <th className="py-2 pr-3 w-[30%]">Bar</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--glass-border)]">
            {ENDPOINTS.map((e) => {
              const slow = e.latency > 500;
              const pct = Math.min(100, (e.latency / 1000) * 100);
              return (
                <tr key={e.name}>
                  <td className="py-2 pr-3 font-mono text-xs">{e.name}</td>
                  <td className="py-2 pr-3">{e.code}</td>
                  <td className="py-2 pr-3">{e.ok ? "✓" : "✗"}</td>
                  <td className="py-2 pr-3 tabular-nums">{e.latency}ms</td>
                  <td className="py-2 pr-3">
                    <div className="h-1.5 w-full rounded-full bg-muted/40">
                      <div
                        className={cn("h-full rounded-full", slow ? "bg-warning" : "bg-success")}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-2 pr-3">
                    <StatusBadge tone={slow ? "warning" : "success"}>{slow ? "slow" : "ok"}</StatusBadge>
                  </td>
                  <td className="py-2 pr-3 text-muted-foreground">{e.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

function FindingsTab() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <GlassCard>
        <SectionTitle title="Findings" subtitle={`${FINDINGS.length} Findings · 2 P1 · 1 P2 · 1 P3`} />
        <ul className="space-y-2">
          {FINDINGS.map((f) => (
            <li key={f.id} className="rounded-lg border border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_60%)] p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-muted-foreground">{f.id}</span>
                <StatusBadge tone={f.sev === "P1" ? "danger" : f.sev === "P2" ? "warning" : "info"}>{f.sev}</StatusBadge>
              </div>
              <div className="mt-1 text-sm font-medium">{f.area}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                source: <span className="font-mono">{f.src}</span> · liveRisk:{" "}
                <span className={f.live ? "text-destructive" : "text-muted-foreground"}>{String(f.live)}</span>
              </div>
              <div className="mt-1 text-xs">
                <ChevronRight className="inline h-3 w-3 text-primary" /> {f.next}
              </div>
            </li>
          ))}
        </ul>
      </GlassCard>
      <GlassCard>
        <SectionTitle title="Drift Points · Safety Violations" />
        <div className="space-y-2 text-sm text-muted-foreground">
          <div>• Balance offset stale (12h) – <StatusBadge tone="warning">P1</StatusBadge></div>
          <div>• Hermes shadow only – <StatusBadge tone="info">INFO/P2</StatusBadge></div>
          <div>• Schema drift: keine</div>
          <div>• Auth drift: keine</div>
        </div>
      </GlassCard>
    </section>
  );
}

function AgentsTab() {
  const future = ["Guardian Agent", "Blocker Agent", "Risk Auditor", "Entry Critic", "Exit Reviewer", "Data Integrity Agent", "Final Arbiter"];
  return (
    <>
      <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {AGENTS.map((a) => (
          <GlassCard key={a.name}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold">{a.name}</div>
                <div className="text-[11px] text-muted-foreground">{a.summary}</div>
              </div>
              <StatusBadge tone={a.status === "ok" ? "success" : "warning"} dot>{a.status}</StatusBadge>
            </div>
            <div className="mt-3 flex gap-3 text-[11px] text-muted-foreground">
              <span>Findings: <span className="text-foreground">{a.findings}</span></span>
              <span>Warns: <span className="text-foreground">{a.warns}</span></span>
            </div>
            <div className="mt-2 font-mono text-[10px] text-muted-foreground">evidence: {a.evidence}</div>
          </GlassCard>
        ))}
      </section>
      <GlassCard>
        <SectionTitle title="Future Agents" subtitle="Geplant · noch nicht aktiv" />
        <div className="flex flex-wrap gap-2">
          {future.map((f) => <StatusBadge key={f} tone="muted">{f}</StatusBadge>)}
        </div>
      </GlassCard>
    </>
  );
}

function HistoryTab() {
  return (
    <GlassCard>
      <SectionTitle title="Verlauf" subtitle={`Letzte ${HISTORY.length} Reports`} />
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="text-[10px] uppercase text-muted-foreground">
            <tr className="text-left">
              <th className="py-2 pr-3">Generated</th>
              <th className="py-2 pr-3">Severity</th>
              <th className="py-2 pr-3">Duration</th>
              <th className="py-2 pr-3">Schema</th>
              <th className="py-2 pr-3">CT</th>
              <th className="py-2 pr-3">OT</th>
              <th className="py-2 pr-3">Report ID</th>
              <th className="py-2 pr-3">Warnings</th>
              <th className="py-2 pr-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--glass-border)]">
            {HISTORY.map((r) => (
              <tr key={r.id}>
                <td className="py-2 pr-3 tabular-nums text-muted-foreground">{r.ts}</td>
                <td className="py-2 pr-3"><StatusBadge tone={r.sev === "P1" ? "danger" : r.sev === "P2" ? "warning" : "info"}>{r.sev}</StatusBadge></td>
                <td className="py-2 pr-3 tabular-nums">{r.duration}ms</td>
                <td className="py-2 pr-3">{r.schema}</td>
                <td className="py-2 pr-3">{r.ct}</td>
                <td className="py-2 pr-3">{r.ot}</td>
                <td className="py-2 pr-3 font-mono">{r.id}</td>
                <td className="py-2 pr-3">{r.warns}</td>
                <td className="py-2 pr-3"><button className="text-primary hover:underline">view</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

function MetaTab() {
  return (
    <GlassCard>
      <SectionTitle title="Meta · Report Provenance" />
      <dl className="grid grid-cols-2 gap-3 text-xs md:grid-cols-3">
        {[
          ["Schema Version", "1.4.0"],
          ["Report ID", "RPT-2031"],
          ["Generated At", "2026-05-13 23:00 UTC"],
          ["Duration", "1213 ms"],
          ["Changed Systems", "risk, treatment"],
          ["Unchanged Systems", "hermes, candlesight, brain, memory"],
          ["Discord Notify", "enabled · #omnitrader-alerts"],
          ["MiroFish Version", "0.9.2"],
          ["CT App / Pkg", "6.32.4 / 6.32.4"],
          ["OT Pkg", "1.1.0"],
          ["Auth Status", "session ok · role: Admin"],
          ["Secrets Exposed", "0 (sanitized)"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-md border border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_60%)] p-3">
            <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
            <dd className="mt-1 font-mono text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
    </GlassCard>
  );
}

function AskTab() {
  return (
    <>
      <GlassCard glow="learning">
        <SectionTitle title="Ask MiroFish" subtitle="Coming soon" />
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li>• Ask MiroFish ist noch nicht aktiv</li>
          <li>• Geplante Ollama-Integration (lokal, evidence-only)</li>
          <li>• Antworten ausschließlich auf Basis von Evidence-Items</li>
          <li>• Admin-only · read-only · kein Shell-Zugriff</li>
          <li>• Keine Trading-Aktionen · keine State-Mutation</li>
        </ul>
      </GlassCard>
      <GlassCard>
        <SectionTitle title="Aquarium Resident Index" subtitle="Was die Kreaturen repräsentieren" />
        <div className="grid gap-2 sm:grid-cols-2">
          {AQUARIUM_RESIDENTS.map((r) => (
            <div key={r.id} className="flex items-start gap-3 rounded-md border border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_60%)] p-3">
              <span className="text-2xl">{r.emoji}</span>
              <div>
                <div className="text-sm font-medium">{r.label}</div>
                <div className="text-[11px] text-muted-foreground">{r.represents}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </>
  );
}

function BlockerTab() {
  const cats = [
    { id: "healthy_no_trade", label: "Healthy – kein Setup", tone: "success" as const },
    { id: "risk_locked_no_trade", label: "Risk Locked", tone: "warning" as const, primary: true },
    { id: "data_broken_no_trade", label: "Data Broken", tone: "danger" as const },
    { id: "overblocked_no_trade", label: "Over-blocked", tone: "warning" as const },
    { id: "strategy_dead_no_trade", label: "Strategy Dead", tone: "danger" as const },
    { id: "ui_misleading_no_trade", label: "UI Misleading", tone: "info" as const },
    { id: "unknown", label: "Unknown", tone: "muted" as const },
  ];
  const flags = [
    ["confidence_below_min", 12, "info"],
    ["xgboost_block", 7, "warning"],
    ["hermes_risk_off", 5, "warning"],
    ["balance_warn", 1, "warning"],
    ["cooldown", 3, "muted"],
    ["max_positions", 2, "muted"],
    ["no_clear_signal", 14, "info"],
    ["data_stale", 0, "success"],
  ] as const;

  return (
    <>
      <GlassCard>
        <SectionTitle title="No-Trade Diagnosis" subtitle="primaryReason: risk_locked_no_trade · confidence 0.78" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => (
            <div key={c.id} className={cn("rounded-md border p-3", c.primary ? "border-warning/50 bg-warning/10" : "border-[var(--glass-border)]")}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{c.label}</span>
                <StatusBadge tone={c.tone}>{c.primary ? "primary" : "candidate"}</StatusBadge>
              </div>
              <div className="mt-1 text-[10px] font-mono text-muted-foreground">{c.id}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      <section className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <SectionTitle title="Block Reason Counts" />
          <ul className="space-y-1.5 text-xs">
            {flags.map(([id, n, tone]) => (
              <li key={id} className="flex items-center justify-between rounded-md bg-[oklch(0.20_0.04_265_/_60%)] px-3 py-2">
                <span className="font-mono">{id}</span>
                <span className="flex items-center gap-2">
                  <span className="tabular-nums">{n}</span>
                  <StatusBadge tone={tone as any}>flag</StatusBadge>
                </span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Counterfactual Stub" subtitle="read-only · simulate later" />
          <div className="space-y-2 text-xs text-muted-foreground">
            <div>Wenn MinConf von 0.62 → 0.55: <span className="text-foreground">+9 hypothetische Signals</span></div>
            <div>Wenn Hermes risk-off ignoriert: <span className="text-foreground">+5 hypothetische Signals</span></div>
            <div>Wenn balance_warn ignoriert: <span className="text-foreground">+1 hypothetisches Signal</span></div>
          </div>
          <div className="mt-3 flex gap-2">
            <button disabled className="cursor-not-allowed rounded-md border border-[var(--glass-border)] px-3 py-1.5 text-xs opacity-50">
              Apply (disabled)
            </button>
            <button disabled className="cursor-not-allowed rounded-md border border-[var(--glass-border)] px-3 py-1.5 text-xs opacity-50">
              Change MinConf (disabled)
            </button>
          </div>
        </GlassCard>
      </section>

      <GlassCard className="border border-info/30 text-xs text-muted-foreground">
        Wenn das Backend keinen <code>blockerLab</code>-Block liefert, erscheint stattdessen:
        „<span className="text-warning">blockerLab not present in current report. Collector must populate it.</span>" — keine
        synthetischen Blocker-Daten.
      </GlassCard>
    </>
  );
}

function EvidenceTab() {
  const items = [
    {
      id: "EV-512", source: "risk_snapshot", reliability: 0.95, stale: false,
      ts: "08:42:11", value: '{ "balance":1003.21, "sqlitePnl":987.55, "offset":15.66, "stale":true }',
      related: ["F-2031"], usedBy: ["F-2031"], notes: "offset stale > 12h",
    },
    {
      id: "EV-511", source: "endpoint_probe", reliability: 0.88, stale: false,
      ts: "08:42:11", value: '{ "treatment":642, "battle":812, "candlesight":540 }',
      related: ["F-2029"], usedBy: ["F-2029"], notes: "slow > 500ms",
    },
    {
      id: "EV-509", source: "battle_arena", reliability: 0.81, stale: false,
      ts: "07:30:00", value: '{ "mfe0LossRate":0.39, "n":214 }',
      related: ["F-2028"], usedBy: ["F-2028"], notes: "",
    },
  ];
  return (
    <>
      <GlassCard>
        <SectionTitle title="Evidence Graph" subtitle="Warum MiroFish glaubt, was es glaubt." />
        <div className="space-y-2">
          {items.map((e) => (
            <details key={e.id} className="rounded-md border border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_60%)] p-3 text-xs">
              <summary className="flex cursor-pointer items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{e.id}</span>
                  <StatusBadge tone="info">{e.source}</StatusBadge>
                  {e.stale && <StatusBadge tone="warning">stale</StatusBadge>}
                </span>
                <span className="text-[10px] text-muted-foreground tabular-nums">{e.ts}</span>
              </summary>
              <div className="mt-2 space-y-1.5">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Reliability</div>
                  <div className="mt-0.5 h-1.5 w-full rounded-full bg-muted/40">
                    <div className="h-full rounded-full bg-success" style={{ width: `${e.reliability * 100}%` }} />
                  </div>
                </div>
                <div className="font-mono text-[11px] text-muted-foreground">value: {e.value.slice(0, 200)}</div>
                <div className="flex flex-wrap gap-1">
                  {e.related.map((r) => <StatusBadge key={r} tone="muted">related: {r}</StatusBadge>)}
                  {e.usedBy.map((r) => <StatusBadge key={r} tone="learning">used-by: {r}</StatusBadge>)}
                </div>
                {e.notes && <div className="text-muted-foreground">notes: {e.notes}</div>}
              </div>
            </details>
          ))}
        </div>
      </GlassCard>
      <GlassCard className="border border-info/30 text-xs text-muted-foreground">
        Fehlt der <code>evidenceGraph</code> im Report, wird angezeigt:
        „<span className="text-info">Current report has no evidenceGraph yet.</span>" — kein synthetisches Evidence.
      </GlassCard>
    </>
  );
}
