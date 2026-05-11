import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { StatusBadge } from "@/components/status-badge";
import { PetIcon } from "@/components/pet-icon";
import { ArrowRight, Database, Activity, Sparkles, Stethoscope, ShieldAlert, Brain, Briefcase, LineChart, Moon, FileText } from "lucide-react";
import type { ReactNode } from "react";

export const Route = createFileRoute("/brain")({
  head: () => ({ meta: [{ title: "System Brain · ClaudeTrader" }, { name: "description", content: "Visueller Trade-Flow durch ClaudeTrader." }] }),
  component: BrainPage,
});

type Tone = "info" | "warning" | "success" | "danger" | "learning";
type Node = {
  id: string; title: string; bullets: string[]; tone: Tone;
  shadow?: boolean; tag?: string; icon?: ReactNode; pets?: string[];
};

const COLUMNS: { label: string; nodes: Node[] }[] = [
  {
    label: "Input",
    nodes: [
      { id: "data", title: "Market Data", bullets: ["Prices", "Candles", "Volume", "Regime"], tone: "info", icon: <Database className="h-4 w-4" /> },
      { id: "signal", title: "Signal Engine", bullets: ["SMC_TJR", "TREND_RSI", "Strategy signals"], tone: "info", icon: <Activity className="h-4 w-4" /> },
    ],
  },
  {
    label: "Analyse · Shadow",
    nodes: [
      { id: "analysis", title: "Analysis Layer", bullets: ["XGBoost", "Hermes Shadow", "CandleSight", "Battle Arena", "RunnerScout"], tone: "warning", shadow: true, tag: "nur Analyse", icon: <Brain className="h-4 w-4" />, pets: ["wick", "sparky", "hermes", "rocket"] },
      { id: "treatment", title: "Trade Treatment", bullets: ["Quality class", "MFE0 Risk", "Runner / Micro / Fakeout", "No-Boost / Reduce"], tone: "warning", shadow: true, tag: "Vorschlag", icon: <Stethoscope className="h-4 w-4" />, pets: ["spike"] },
      { id: "risk", title: "Risk Engine", bullets: ["Drawdown", "Balance Integrity", "Position limits", "Risk flags"], tone: "danger", icon: <ShieldAlert className="h-4 w-4" />, pets: ["shieldy"] },
    ],
  },
  {
    label: "Live Core",
    nodes: [
      { id: "decision", title: "Decision Core", bullets: ["BUY / SELL / HOLD / BLOCKED", "Confidence", "Reason"], tone: "success", tag: "live", icon: <Sparkles className="h-4 w-4" />, pets: ["corey"] },
      { id: "position", title: "Position Manager", bullets: ["Entry · SL · TP", "Current PnL", "R / MaxR"], tone: "success", tag: "live", icon: <Briefcase className="h-4 w-4" /> },
      { id: "exit", title: "Exit Quality", bullets: ["Peak", "Retained Profit", "Exit Grade", "Plus-to-Minus"], tone: "info", icon: <LineChart className="h-4 w-4" /> },
    ],
  },
  {
    label: "Lernen",
    nodes: [
      { id: "governor", title: "Nightly Governor", bullets: ["Proposals", "AutoApply OFF", "Learning Report"], tone: "learning", shadow: true, tag: "AutoApply OFF", icon: <Moon className="h-4 w-4" />, pets: ["luna"] },
      { id: "reports", title: "Reports / Dashboard", bullets: ["Treatment", "Payoff · MFE0", "Balance", "CandleSight · Arena"], tone: "info", icon: <FileText className="h-4 w-4" /> },
    ],
  },
];

const toneRing: Record<Tone, string> = {
  info: "border-info/30 shadow-[0_0_30px_-12px_oklch(0.72_0.15_230_/_70%)]",
  warning: "border-warning/30 shadow-[0_0_30px_-12px_oklch(0.82_0.16_85_/_70%)]",
  success: "border-success/30 shadow-[0_0_30px_-12px_oklch(0.74_0.18_152_/_70%)]",
  danger: "border-destructive/30 shadow-[0_0_30px_-12px_oklch(0.65_0.22_25_/_70%)]",
  learning: "border-learning/30 shadow-[0_0_30px_-12px_oklch(0.70_0.20_300_/_70%)]",
};

const toneAccent: Record<Tone, string> = {
  info: "text-info bg-info/10",
  warning: "text-warning bg-warning/10",
  success: "text-success bg-success/10",
  danger: "text-destructive bg-destructive/10",
  learning: "text-learning bg-learning/10",
};

const toneDot: Record<Tone, string> = {
  info: "bg-info", warning: "bg-warning", success: "bg-success",
  danger: "bg-destructive", learning: "bg-learning",
};

function BrainPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionTitle
        title="System Brain"
        subtitle="So fließt ein Trade-Gedanke durch ClaudeTrader. Shadow-Module greifen nicht ein."
      />

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Legend dot="bg-info" label="Input" />
        <Legend dot="bg-warning" label="Shadow / Vorschlag" />
        <Legend dot="bg-success" label="Live Core" />
        <Legend dot="bg-destructive" label="Risk" />
        <Legend dot="bg-learning" label="Lernen" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {COLUMNS.map((col, ci) => (
          <div key={col.label} className="relative space-y-4">
            <div className="flex items-center gap-2 px-1 text-[11px] uppercase tracking-wider text-muted-foreground">
              <span className="h-1 w-6 rounded-full bg-gradient-to-r from-primary/60 to-transparent" />
              {col.label}
            </div>
            {col.nodes.map((node) => (
              <GlassCard key={node.id} className={`border ${toneRing[node.tone]}`}>
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${toneAccent[node.tone]}`}>
                      {node.icon}
                    </span>
                    <h3 className="truncate text-sm font-semibold">{node.title}</h3>
                  </div>
                  <div className="flex shrink-0 flex-wrap justify-end gap-1">
                    {node.shadow && <StatusBadge tone="shadow">Shadow</StatusBadge>}
                    {node.tag && (
                      <StatusBadge tone={node.tone === "success" ? "success" : node.tone === "learning" ? "learning" : node.tone === "danger" ? "danger" : "muted"}>
                        {node.tag}
                      </StatusBadge>
                    )}
                  </div>
                </div>
                {node.pets && node.pets.length > 0 && (
                  <div className="mb-2 flex -space-x-1.5">
                    {node.pets.map((id) => <PetIcon key={id} id={id} size={28} />)}
                  </div>
                )}
                <ul className="space-y-1">
                  {node.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={`h-1 w-1 rounded-full ${toneDot[node.tone]}`} />
                      {b}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
            {ci < COLUMNS.length - 1 && (
              <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-muted-foreground/60 lg:flex">
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
            {ci < COLUMNS.length - 1 && (
              <div className="flex justify-center text-muted-foreground/50 lg:hidden">
                <ArrowRight className="h-4 w-4 rotate-90" />
              </div>
            )}
          </div>
        ))}
      </div>

      <GlassCard className="text-sm text-muted-foreground">
        Nur <span className="font-medium text-success">Decision Core</span> und <span className="font-medium text-success">Position Manager</span> sind mit dem realen Order-Pfad verbunden.
        Alle anderen Module sind im Prototype rein analytisch (Shadow / Vorschlag).
      </GlassCard>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_60%)] px-2.5 py-1 text-muted-foreground">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
