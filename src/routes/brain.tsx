import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { StatusBadge } from "@/components/status-badge";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/brain")({
  head: () => ({ meta: [{ title: "System Brain · ClaudeTrader" }, { name: "description", content: "Visueller Trade-Flow durch ClaudeTrader." }] }),
  component: BrainPage,
});

type Tone = "info" | "warning" | "success" | "danger" | "learning";
type Node = { id: string; title: string; bullets: string[]; tone: Tone; shadow?: boolean; tag?: string };

const COLUMNS: Node[][] = [
  [
    { id: "data", title: "Market Data", bullets: ["Prices", "Candles", "Volume", "Regime"], tone: "info" },
    { id: "signal", title: "Signal Engine", bullets: ["SMC_TJR", "TREND_RSI", "Strategy signals"], tone: "info" },
  ],
  [
    { id: "analysis", title: "Analysis Layer", bullets: ["XGBoost", "Hermes Shadow", "CandleSight", "Battle Arena", "Opportunity Scout"], tone: "warning", shadow: true, tag: "nur Analyse" },
    { id: "treatment", title: "Trade Treatment", bullets: ["Quality class", "MFE0 Risk", "Runner / Micro / Fakeout", "No-Boost / Reduce"], tone: "warning", shadow: true, tag: "Vorschlag" },
    { id: "risk", title: "Risk Engine", bullets: ["Drawdown", "Balance Integrity", "Position limits", "Risk flags"], tone: "danger" },
  ],
  [
    { id: "decision", title: "Decision Core", bullets: ["BUY / SELL / HOLD / BLOCKED", "Confidence", "Reason"], tone: "success", tag: "live" },
    { id: "position", title: "Position Manager", bullets: ["Entry · SL · TP", "Current PnL", "R / MaxR"], tone: "success", tag: "live" },
    { id: "exit", title: "Exit Quality", bullets: ["Peak", "Retained Profit", "Exit Grade", "Plus-to-Minus"], tone: "info" },
  ],
  [
    { id: "governor", title: "Nightly Governor", bullets: ["Proposals", "AutoApply OFF", "Learning Report"], tone: "learning", shadow: true, tag: "AutoApply OFF" },
    { id: "reports", title: "Reports / Dashboard", bullets: ["Treatment", "Payoff · MFE0", "Balance", "CandleSight · Arena"], tone: "info" },
  ],
];

const toneStyles: Record<Tone, string> = {
  info: "border-info/30 shadow-[var(--shadow-glow-primary)]",
  warning: "border-warning/30 shadow-[var(--shadow-glow-warning)]",
  success: "border-success/30 shadow-[var(--shadow-glow-success)]",
  danger: "border-destructive/30 shadow-[var(--shadow-glow-danger)]",
  learning: "border-learning/30 shadow-[var(--shadow-glow-learning)]",
};

function BrainPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionTitle
        title="System Brain"
        subtitle="So fließt ein Trade-Gedanke durch ClaudeTrader. Shadow-Module greifen nicht ein."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {COLUMNS.map((col, ci) => (
          <div key={ci} className="relative space-y-4">
            {col.map((node) => (
              <GlassCard key={node.id} className={`border ${toneStyles[node.tone]}`}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{node.title}</h3>
                  <div className="flex gap-1">
                    {node.shadow && <StatusBadge tone="shadow">Shadow</StatusBadge>}
                    {node.tag && <StatusBadge tone={node.tone === "success" ? "success" : node.tone === "learning" ? "learning" : "muted"}>{node.tag}</StatusBadge>}
                  </div>
                </div>
                <ul className="space-y-1">
                  {node.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={`h-1 w-1 rounded-full ${
                        node.tone === "info" ? "bg-info" :
                        node.tone === "warning" ? "bg-warning" :
                        node.tone === "success" ? "bg-success" :
                        node.tone === "danger" ? "bg-destructive" : "bg-learning"
                      }`} />
                      {b}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
            {ci < COLUMNS.length - 1 && (
              <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
      </div>
      <GlassCard className="text-sm text-muted-foreground">
        Nur <span className="text-success font-medium">Decision Core</span> und <span className="text-success font-medium">Position Manager</span> sind mit dem realen Order-Pfad verbunden. Alle anderen Module sind im Prototype rein analytisch.
      </GlassCard>
    </div>
  );
}
