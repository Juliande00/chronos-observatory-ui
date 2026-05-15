import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";
import {
  Bot, Brain, Shield, Flame, Swords, Compass, Stethoscope, Database, Moon,
  MessageSquare, Send, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/agents")({
  head: () => ({
    meta: [
      { title: "Agent Room · OmniTrader" },
      { name: "description", content: "Live-Konversation aller Spezialisten-Agenten." },
    ],
  }),
  component: AgentRoom,
});

type Agent = {
  id: string;
  name: string;
  role: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  status: "active" | "shadow" | "idle" | "thinking";
  confidence: number;
  lastSeen: string;
};

const AGENTS: Agent[] = [
  { id: "corey", name: "Corey", role: "Decision Core", icon: Brain, color: "text-primary", status: "active", confidence: 0.84, lastSeen: "2s" },
  { id: "shieldy", name: "Shieldy", role: "Risk Engine", icon: Shield, color: "text-success", status: "active", confidence: 0.92, lastSeen: "4s" },
  { id: "wick", name: "Wick", role: "CandleSight", icon: Flame, color: "text-warning", status: "shadow", confidence: 0.71, lastSeen: "8s" },
  { id: "sparky", name: "Sparky", role: "Battle Arena", icon: Swords, color: "text-info", status: "thinking", confidence: 0.66, lastSeen: "1s" },
  { id: "hermes", name: "Hermes", role: "Regime Forecaster", icon: Compass, color: "text-learning", status: "shadow", confidence: 0.58, lastSeen: "11s" },
  { id: "doc", name: "Doc", role: "Trade Treatment", icon: Stethoscope, color: "text-info", status: "idle", confidence: 0.78, lastSeen: "1m" },
  { id: "memo", name: "Memo", role: "Learning Memory", icon: Database, color: "text-learning", status: "active", confidence: 0.81, lastSeen: "6s" },
  { id: "luna", name: "Luna", role: "Nightly Governor", icon: Moon, color: "text-muted-foreground", status: "idle", confidence: 0.63, lastSeen: "3h" },
];

type ChatMsg = {
  id: number;
  agent: string;
  text: string;
  ts: string;
  tone: "info" | "warn" | "danger" | "ok" | "learn";
};

const SCRIPTS: Omit<ChatMsg, "id" | "ts">[] = [
  { agent: "corey", text: "Markt-Snapshot eingegangen. BTC/USDT MIXED, Signal-Score 0.71.", tone: "info" },
  { agent: "shieldy", text: "Risk-Gate WARN: daily DD bei -1.8%, Buffer 0.7% bis Hard-Stop.", tone: "warn" },
  { agent: "wick", text: "Wick-Reversal auf 5m bestätigt — Liquidity-Sweep über PDH.", tone: "info" },
  { agent: "sparky", text: "Arena-Vote 4:1 LONG. Outlier: trend_breaker (Score 0.42).", tone: "info" },
  { agent: "hermes", text: "Regime-Forecast: MIXED → TREND_UP Wahrscheinlichkeit 0.31 in 30m.", tone: "learn" },
  { agent: "doc", text: "Letzter ETH-Trade: Stop war 0.4R zu eng — Vorschlag 0.6R Treatment.", tone: "warn" },
  { agent: "memo", text: "Insight gespeichert: bucket=ASIA, grade=B, reason=stop_too_tight.", tone: "learn" },
  { agent: "shieldy", text: "Block ausgesprochen: confidence_below_min (0.58 < 0.62).", tone: "danger" },
  { agent: "corey", text: "Trade abgelehnt. Warte auf nächsten Setup-Trigger.", tone: "ok" },
  { agent: "luna", text: "Nightly Proposal #41 erstellt — AutoApply OFF, manuelle Review nötig.", tone: "learn" },
];

const TONE_COLOR = {
  info: "text-info border-info/30 bg-info/10",
  warn: "text-warning border-warning/30 bg-warning/10",
  danger: "text-destructive border-destructive/30 bg-destructive/10",
  ok: "text-success border-success/30 bg-success/10",
  learn: "text-learning border-learning/30 bg-learning/10",
};

function AgentRoom() {
  const [messages, setMessages] = useState<ChatMsg[]>(() =>
    SCRIPTS.slice(0, 5).map((m, i) => ({
      ...m,
      id: i,
      ts: new Date(Date.now() - (5 - i) * 8000).toLocaleTimeString(),
    })),
  );
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setMessages((prev) => {
        const next = SCRIPTS[Math.floor(Math.random() * SCRIPTS.length)];
        return [
          ...prev.slice(-40),
          { ...next, id: prev.length ? prev[prev.length - 1].id + 1 : 0, ts: new Date().toLocaleTimeString() },
        ];
      });
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const visible = filter ? messages.filter((m) => m.agent === filter) : messages;
  const activeCount = AGENTS.filter((a) => a.status === "active").length;
  const shadowCount = AGENTS.filter((a) => a.status === "shadow").length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Agent Room"
        subtitle="Live-Konversation aller Spezialisten · Read-only Beobachtung"
        status="ONLINE"
        role="Admin"
      />

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Active Agents" value={`${activeCount}/${AGENTS.length}`} tone="success" icon={<Bot className="h-4 w-4" />} />
        <KpiCard label="Shadow Mode" value={shadowCount} tone="learning" />
        <KpiCard label="Avg Confidence" value="0.74" tone="info" />
        <KpiCard label="Messages/min" value="17" tone="muted" icon={<MessageSquare className="h-4 w-4" />} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <GlassCard>
          <SectionTitle title="Roster" subtitle="Klicke einen Agenten für Filter" />
          <ul className="space-y-1.5">
            <li>
              <button
                onClick={() => setFilter(null)}
                className={cn(
                  "w-full rounded-lg border border-[var(--glass-border)] px-3 py-2 text-left text-xs transition-colors",
                  !filter ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-[oklch(0.25_0.04_265_/_60%)]",
                )}
              >
                Alle Agenten
              </button>
            </li>
            {AGENTS.map((a) => {
              const Icon = a.icon;
              const active = filter === a.id;
              return (
                <li key={a.id}>
                  <button
                    onClick={() => setFilter(a.id)}
                    className={cn(
                      "w-full rounded-lg border border-[var(--glass-border)] px-3 py-2 text-left transition-colors",
                      active ? "bg-primary/15" : "hover:bg-[oklch(0.25_0.04_265_/_60%)]",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={cn("h-4 w-4", a.color)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium truncate">{a.name}</span>
                          <StatusBadge tone={a.status === "active" ? "success" : a.status === "shadow" ? "learning" : a.status === "thinking" ? "info" : "muted"}>
                            {a.status}
                          </StatusBadge>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className="truncate">{a.role}</span>
                          <span className="tabular-nums">conf {a.confidence.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </GlassCard>

        <GlassCard className="flex flex-col">
          <SectionTitle
            title={filter ? `Conversation · ${AGENTS.find((a) => a.id === filter)?.name}` : "Live Conversation"}
            subtitle="Auto-refresh alle 3.5s"
            action={<StatusBadge tone="success" dot>live</StatusBadge>}
          />
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {visible.length === 0 && (
              <div className="text-center text-xs text-muted-foreground py-8">Keine Nachrichten von diesem Agenten.</div>
            )}
            {visible.map((m) => {
              const agent = AGENTS.find((a) => a.id === m.agent);
              const Icon = agent?.icon ?? Bot;
              return (
                <div key={m.id} className={cn("flex items-start gap-2.5 rounded-lg border px-3 py-2", TONE_COLOR[m.tone])}>
                  <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", agent?.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider opacity-80">
                      <span>{agent?.name ?? m.agent}</span>
                      <span className="tabular-nums">{m.ts}</span>
                    </div>
                    <p className="text-sm text-foreground mt-0.5">{m.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center gap-2 border-t border-[var(--glass-border)] pt-3">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Frage an die Agenten (read-only Demo) …"
              className="flex-1 rounded-md border border-[var(--glass-border)] bg-[oklch(0.18_0.04_265_/_70%)] px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              disabled
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--glass-border)] bg-[oklch(0.25_0.04_265_/_60%)] px-3 py-1.5 text-xs font-medium opacity-60 cursor-not-allowed"
              title="Demo-Modus"
            >
              <Send className="h-3 w-3" /> Senden
            </button>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
