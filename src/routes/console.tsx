import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { StatusBadge } from "@/components/status-badge";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";
import { Terminal as TerminalIcon, ChevronRight, Lock } from "lucide-react";

export const Route = createFileRoute("/console")({
  head: () => ({
    meta: [
      { title: "Op Console · OmniTrader" },
      { name: "description", content: "Operator-Konsole · Read-only Befehle." },
    ],
  }),
  component: OpConsole,
});

type Line = { id: number; type: "in" | "out" | "err" | "info"; text: string; ts: string };

const COMMANDS: Record<string, (args: string[]) => string[] | string> = {
  help: () => [
    "Verfügbare Befehle:",
    "  status              · System-Status anzeigen",
    "  agents              · Liste aller Agenten",
    "  positions           · Offene Positionen",
    "  risk                · Risiko-Snapshot",
    "  endpoints           · Endpoint-Latenzen",
    "  tail <quelle>       · Letzte Events einer Quelle",
    "  ping <agent>        · Agent-Health prüfen",
    "  clear               · Bildschirm leeren",
    "  whoami              · Aktuellen User anzeigen",
    "  pause / resume      · (gesperrt — Read-only)",
  ],
  status: () => [
    "OmniTrader  : ONLINE  v6.35.7",
    "ClaudeTrader: CONNECTED",
    "Mode        : Read-only",
    "AutoApply   : OFF",
    "Severity    : WARN (1 active)",
    "Uptime      : 4d 12h 38m",
  ],
  agents: () => [
    "corey     active   conf 0.84",
    "shieldy   active   conf 0.92",
    "wick      shadow   conf 0.71",
    "sparky    thinking conf 0.66",
    "hermes    shadow   conf 0.58",
    "doc       idle     conf 0.78",
    "memo      active   conf 0.81",
    "luna      idle     conf 0.63",
  ],
  positions: () => [
    "BTC/USDT  LONG  0.012  entry 67_240  pnl +$8.42  R +0.6",
    "ETH/USDT  SHORT 0.18   entry 3_412   pnl -$3.10  R -0.3",
  ],
  risk: () => [
    "Balance        $1003.21",
    "Daily Loss     -$42.18",
    "Drawdown       -1.8%",
    "Risk Gate      guarded",
    "AutoApply      blocked",
  ],
  endpoints: () => [
    "/api/treatment       642ms  WARN",
    "/api/battle-arena    812ms  WARN",
    "/api/candlesight     540ms  ok",
    "/api/hermes          188ms  ok",
    "/api/memory          92ms   ok",
  ],
  whoami: () => "admin@local · role=Admin · token=•••a8f3",
  ping: (args) => {
    const a = args[0];
    if (!a) return "Usage: ping <agent>";
    return `${a} ... pong (${(Math.random() * 30 + 4).toFixed(1)}ms)`;
  },
  tail: (args) => {
    const src = args[0] ?? "system";
    return [
      `[${src}] 08:42:14 event ok`,
      `[${src}] 08:42:09 event ok`,
      `[${src}] 08:42:01 event warn — drift detected`,
      `[${src}] 08:41:55 event ok`,
    ];
  },
  pause: () => "BLOCKED · pause requires elevated lock + 2FA",
  resume: () => "BLOCKED · resume requires elevated lock + 2FA",
};

const BANNER = [
  "┌──────────────────────────────────────────────────────────┐",
  "│   OmniTrader · Op Console v1.1                           │",
  "│   Read-only · type 'help' for commands                   │",
  "└──────────────────────────────────────────────────────────┘",
];

function OpConsole() {
  const [lines, setLines] = useState<Line[]>(() =>
    BANNER.map((b, i) => ({ id: i, type: "info" as const, text: b, ts: "" })),
  );
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const submit = () => {
    const raw = input.trim();
    if (!raw) return;
    const ts = new Date().toLocaleTimeString();
    const next: Line[] = [{ id: lines.length, type: "in", text: raw, ts }];
    const [cmd, ...args] = raw.split(/\s+/);

    if (cmd === "clear") {
      setLines([]);
      setInput("");
      setHistory((h) => [raw, ...h].slice(0, 50));
      setHIdx(-1);
      return;
    }

    const fn = COMMANDS[cmd];
    if (!fn) {
      next.push({ id: lines.length + 1, type: "err", text: `command not found: ${cmd}`, ts });
    } else {
      const out = fn(args);
      const arr = Array.isArray(out) ? out : [out];
      arr.forEach((t, i) => {
        const isBlocked = t.startsWith("BLOCKED");
        next.push({ id: lines.length + 1 + i, type: isBlocked ? "err" : "out", text: t, ts });
      });
    }

    setLines((l) => [...l, ...next]);
    setHistory((h) => [raw, ...h].slice(0, 50));
    setInput("");
    setHIdx(-1);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submit();
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(hIdx + 1, history.length - 1);
      setHIdx(next);
      if (history[next]) setInput(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(hIdx - 1, -1);
      setHIdx(next);
      setInput(next === -1 ? "" : history[next]);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Op Console"
        subtitle="Operator-Terminal · Read-only Befehle · Audit aktiv"
        status="ONLINE"
        role="Admin"
      />

      <GlassCard className="p-0 overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--glass-border)] bg-[oklch(0.14_0.04_265_/_80%)] px-4 py-2">
          <div className="flex items-center gap-2 text-xs">
            <TerminalIcon className="h-4 w-4 text-success" />
            <span className="font-mono">admin@omnitrader:~</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge tone="warning"><Lock className="h-3 w-3 mr-1 inline" />Read-only</StatusBadge>
            <StatusBadge tone="success" dot>session</StatusBadge>
          </div>
        </div>
        <div className="bg-[oklch(0.10_0.03_265_/_90%)] p-4 font-mono text-xs h-[480px] overflow-y-auto">
          {lines.map((l) => (
            <div
              key={l.id}
              className={cn(
                "whitespace-pre-wrap leading-5",
                l.type === "in" && "text-foreground",
                l.type === "out" && "text-muted-foreground",
                l.type === "err" && "text-destructive",
                l.type === "info" && "text-primary",
              )}
            >
              {l.type === "in" && <span className="text-success mr-1">$</span>}
              {l.text}
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="flex items-center gap-2 border-t border-[var(--glass-border)] bg-[oklch(0.14_0.04_265_/_80%)] px-3 py-2">
          <ChevronRight className="h-4 w-4 text-success" />
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="type a command, e.g. status"
            className="flex-1 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <span className="text-[10px] text-muted-foreground">↑↓ history</span>
        </div>
      </GlassCard>

      <GlassCard>
        <SectionTitle title="Cheat-Sheet" subtitle="Häufige Diagnose-Befehle" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {["status", "agents", "positions", "risk", "endpoints", "tail risk", "ping shieldy", "whoami", "help"].map((c) => (
            <button
              key={c}
              onClick={() => {
                setInput(c);
              }}
              className="rounded-md border border-[var(--glass-border)] bg-[oklch(0.18_0.04_265_/_70%)] px-3 py-1.5 text-left font-mono text-xs hover:bg-[oklch(0.25_0.04_265_/_70%)]"
            >
              <span className="text-success">$ </span>{c}
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
