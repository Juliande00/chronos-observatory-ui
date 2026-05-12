import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { StatusBadge } from "@/components/status-badge";
import {
  SETTINGS_VIEW,
  LLM_PROVIDERS,
  LLM_DEFAULTS,
  MODULE_MODEL_ASSIGNMENTS,
  LLM_USAGE_STATS,
  type LlmProvider,
} from "@/lib/mock-data";
import {
  Lock, Brain, Cpu, Cloud, Gauge, Zap, Shield, Languages, MessageSquare,
  Activity, Coins, CheckCircle2, AlertTriangle, RotateCcw, Sparkles, Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · ClaudeTrader" },
      { name: "description", content: "Read-only Konfigurations-Übersicht inkl. LLM-Modellwahl." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <SectionTitle
        title="Settings"
        subtitle="Read-only Übersicht — Änderungen sind im Prototype simuliert (kein Live-Apply)."
      />

      <GlassCard className="border border-warning/30 bg-warning/5">
        <div className="flex items-start gap-3 text-sm">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <span className="text-muted-foreground">
            Konfiguration ist im Prototype nur lesbar. Keine API-Keys, Tokens oder Secrets werden angezeigt.
            Modellwechsel werden visuell simuliert — keine Live-Trading-Kette wird verändert.
          </span>
        </div>
      </GlassCard>

      <LlmStudio />
      <ModuleAssignments />
      <SystemConfig />
    </div>
  );
}

/* ────────────────────────────  LLM Studio  ──────────────────────────── */

function LlmStudio() {
  const [providerId, setProviderId] = useState(LLM_DEFAULTS.providerId);
  const [modelId, setModelId] = useState(LLM_DEFAULTS.modelId);
  const [temp, setTemp] = useState(LLM_DEFAULTS.temperature);
  const [maxTok, setMaxTok] = useState(LLM_DEFAULTS.maxTokens);
  const [style, setStyle] = useState(LLM_DEFAULTS.style);
  const [lang, setLang] = useState(LLM_DEFAULTS.language);
  const [safety, setSafety] = useState(LLM_DEFAULTS.safety);
  const [streaming, setStreaming] = useState(LLM_DEFAULTS.streaming);
  const [dirty, setDirty] = useState(false);

  const provider = useMemo(
    () => LLM_PROVIDERS.find((p) => p.id === providerId)!,
    [providerId],
  );
  const model = useMemo(
    () => provider.models.find((m) => m.id === modelId) ?? provider.models[0],
    [provider, modelId],
  );

  const mark = () => setDirty(true);
  const pickProvider = (id: string) => {
    setProviderId(id);
    const p = LLM_PROVIDERS.find((x) => x.id === id)!;
    const rec = p.models.find((m) => m.recommended) ?? p.models[0];
    setModelId(rec.id);
    mark();
  };

  const reset = () => {
    setProviderId(LLM_DEFAULTS.providerId);
    setModelId(LLM_DEFAULTS.modelId);
    setTemp(LLM_DEFAULTS.temperature);
    setMaxTok(LLM_DEFAULTS.maxTokens);
    setStyle(LLM_DEFAULTS.style);
    setLang(LLM_DEFAULTS.language);
    setSafety(LLM_DEFAULTS.safety);
    setStreaming(LLM_DEFAULTS.streaming);
    setDirty(false);
  };

  return (
    <section>
      <SectionTitle
        title={
          <span className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" /> LLM Studio
          </span>
        }
        subtitle="Wähle Provider, Modell und Verhalten der Pet-Commentary-Engine."
        action={
          <div className="flex items-center gap-2">
            {dirty && <StatusBadge tone="warning" dot>ungespeichert</StatusBadge>}
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--glass-border)] bg-[oklch(0.18_0.04_265_/_60%)] px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>
        }
      />

      {/* Provider tiles */}
      <div className="grid gap-3 md:grid-cols-3">
        {LLM_PROVIDERS.map((p) => (
          <ProviderTile
            key={p.id}
            provider={p}
            selected={p.id === providerId}
            onSelect={() => pickProvider(p.id)}
          />
        ))}
      </div>

      {/* Model picker */}
      <GlassCard className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-info" />
            <h3 className="text-sm font-semibold">Modell für {provider.name}</h3>
          </div>
          <StatusBadge tone={provider.type === "local" ? "shadow" : "info"}>
            {provider.type === "local" ? "On-Device" : "Cloud Gateway"}
          </StatusBadge>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          {provider.models.map((m) => {
            const active = m.id === modelId;
            return (
              <button
                key={m.id}
                onClick={() => { setModelId(m.id); mark(); }}
                className={cn(
                  "group flex flex-col gap-1 rounded-xl border p-3 text-left transition-all",
                  active
                    ? "border-primary/60 bg-primary/10 shadow-[var(--shadow-glow-primary)]"
                    : "border-[var(--glass-border)] bg-[oklch(0.18_0.04_265_/_60%)] hover:border-primary/30",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{m.label}</span>
                    {m.recommended && <StatusBadge tone="success">empfohlen</StatusBadge>}
                  </div>
                  {active && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground">{m.strength}</p>
                <div className="mt-1 flex items-center gap-3 text-[10px] uppercase tracking-wider text-muted-foreground/80">
                  <span>Größe {m.size}</span>
                  <span>·</span>
                  <span>Ctx {provider.contextK}k</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Behavior controls */}
        <div className="grid gap-4 border-t border-[var(--glass-border)] pt-4 md:grid-cols-2">
          <Slider
            icon={<Gauge className="h-3.5 w-3.5" />}
            label="Temperature"
            help="Niedrig = präzise · Hoch = kreativ"
            min={0} max={1} step={0.05} value={temp}
            onChange={(v) => { setTemp(v); mark(); }}
            display={temp.toFixed(2)}
          />
          <Slider
            icon={<MessageSquare className="h-3.5 w-3.5" />}
            label="Max Tokens"
            help="Antwortlänge der Pets"
            min={64} max={2048} step={32} value={maxTok}
            onChange={(v) => { setMaxTok(v); mark(); }}
            display={`${maxTok}`}
          />
          <Segmented
            icon={<Zap className="h-3.5 w-3.5" />}
            label="Antwort-Stil"
            value={style}
            onChange={(v) => { setStyle(v as typeof style); mark(); }}
            options={[
              { value: "concise", label: "Konzis" },
              { value: "balanced", label: "Balanced" },
              { value: "verbose", label: "Ausführlich" },
            ]}
          />
          <Segmented
            icon={<Languages className="h-3.5 w-3.5" />}
            label="Sprache"
            value={lang}
            onChange={(v) => { setLang(v as typeof lang); mark(); }}
            options={[
              { value: "de", label: "Deutsch" },
              { value: "en", label: "English" },
            ]}
          />
          <Segmented
            icon={<Shield className="h-3.5 w-3.5" />}
            label="Safety / Filter"
            value={safety}
            onChange={(v) => { setSafety(v as typeof safety); mark(); }}
            options={[
              { value: "strict", label: "Strict" },
              { value: "balanced", label: "Balanced" },
              { value: "open", label: "Open" },
            ]}
          />
          <Toggle
            icon={<Activity className="h-3.5 w-3.5" />}
            label="Streaming"
            help="Tokens live einblenden"
            value={streaming}
            onChange={(v) => { setStreaming(v); mark(); }}
          />
        </div>

        {/* Live preview */}
        <PreviewCard provider={provider} model={model} temp={temp} style={style} lang={lang} />

        <UsageStrip />
      </GlassCard>

      <FallbackCard />
    </section>
  );
}

function ProviderTile({ provider, selected, onSelect }: { provider: LlmProvider; selected: boolean; onSelect: () => void }) {
  const Icon = provider.type === "local" ? Cpu : Cloud;
  const statusTone = provider.status === "online" ? "success" : provider.status === "degraded" ? "warning" : "danger";
  return (
    <button
      onClick={onSelect}
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-4 text-left transition-all",
        selected
          ? "border-primary/60 bg-primary/10 shadow-[var(--shadow-glow-primary)]"
          : "border-[var(--glass-border)] bg-[oklch(0.18_0.04_265_/_60%)] hover:border-primary/30 hover:-translate-y-0.5",
      )}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-2xl" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl border",
            selected ? "border-primary/40 bg-primary/15 text-primary" : "border-[var(--glass-border)] bg-background/40 text-muted-foreground",
          )}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">{provider.name}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{provider.type}</div>
          </div>
        </div>
        <StatusBadge tone={statusTone} dot>{provider.status}</StatusBadge>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
        <Stat label="Latenz" value={`${provider.latencyMs}ms`} />
        <Stat label="Kosten/1k" value={provider.costPer1k === 0 ? "frei" : `$${provider.costPer1k}`} />
        <Stat label="Privacy" value={provider.privacy === "on-device" ? "lokal" : "cloud"} />
      </div>
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_60%)] px-2 py-1.5">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-xs font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function Slider({ icon, label, help, min, max, step, value, onChange, display }: {
  icon: React.ReactNode; label: string; help: string; min: number; max: number; step: number;
  value: number; onChange: (v: number) => void; display: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--glass-border)] bg-[oklch(0.18_0.04_265_/_60%)] p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium">{icon}{label}</div>
        <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-primary">{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[oklch(0.72_0.18_265)]"
      />
      <p className="mt-1 text-[10px] text-muted-foreground">{help}</p>
    </div>
  );
}

function Segmented({ icon, label, value, onChange, options }: {
  icon: React.ReactNode; label: string; value: string;
  onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div className="rounded-xl border border-[var(--glass-border)] bg-[oklch(0.18_0.04_265_/_60%)] p-3">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium">{icon}{label}</div>
      <div className="grid auto-cols-fr grid-flow-col gap-1 rounded-lg border border-[var(--glass-border)] bg-background/40 p-1">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
              value === o.value ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({ icon, label, help, value, onChange }: {
  icon: React.ReactNode; label: string; help: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--glass-border)] bg-[oklch(0.18_0.04_265_/_60%)] p-3">
      <div>
        <div className="flex items-center gap-1.5 text-xs font-medium">{icon}{label}</div>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{help}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          "relative h-6 w-11 rounded-full border transition-colors",
          value ? "border-primary/40 bg-primary/30" : "border-[var(--glass-border)] bg-background/40",
        )}
      >
        <span className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-foreground/90 shadow transition-transform",
          value ? "translate-x-5" : "translate-x-0.5",
        )} />
      </button>
    </div>
  );
}

function PreviewCard({ provider, model, temp, style, lang }: {
  provider: LlmProvider; model: LlmProvider["models"][number];
  temp: number; style: string; lang: string;
}) {
  const sampleDe = style === "concise"
    ? "BTC-Setup ok, MFE0 unauffällig. Kein Boost empfohlen."
    : style === "balanced"
      ? "BTC zeigt eine saubere Struktur. MFE0-Quote unauffällig, Risk WARN bleibt aktiv. Kein Boost empfohlen."
      : "BTC zeigt eine saubere Struktur über die letzten drei H1-Kerzen. MFE0-Quote bleibt unauffällig (~12%), aber Balance-Integrity steht weiterhin auf WARN, weshalb AutoApply blockiert ist. Empfehlung: Position halten, kein Boost.";
  const sampleEn = style === "concise"
    ? "BTC setup ok, MFE0 calm. No boost recommended."
    : style === "balanced"
      ? "BTC shows clean structure. MFE0 calm, balance still WARN. Hold, no boost."
      : "BTC shows clean structure over the last three H1 candles. MFE0 stays calm (~12%) but balance integrity remains WARN, which keeps AutoApply blocked. Recommendation: hold the position, no boost.";
  return (
    <div className="rounded-xl border border-info/20 bg-info/5 p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-info">
          <Sparkles className="h-3.5 w-3.5" /> Live-Vorschau
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span>{provider.name}</span><span>·</span>
          <span className="text-foreground">{model.label}</span><span>·</span>
          <span>T {temp.toFixed(2)}</span>
        </div>
      </div>
      <p className="text-sm italic leading-relaxed text-foreground/90">
        "{lang === "de" ? sampleDe : sampleEn}"
      </p>
      <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
        <Info className="h-3 w-3" />
        Vorschau ist Mock — kein echter Modellaufruf.
      </div>
    </div>
  );
}

function UsageStrip() {
  const u = LLM_USAGE_STATS;
  const items = [
    { label: "Prompts heute", value: u.promptsToday.toLocaleString() },
    { label: "Tokens", value: `${(u.tokensToday / 1000).toFixed(1)}k` },
    { label: "Kosten", value: `$${u.costToday.toFixed(2)}` },
    { label: "Fallbacks", value: `${u.fallbacks}` },
    { label: "⌀ Latenz", value: `${u.avgLatencyMs}ms` },
    { label: "Cache-Hit", value: `${u.cacheHitRate}%` },
  ];
  return (
    <div className="grid grid-cols-3 gap-2 border-t border-[var(--glass-border)] pt-4 md:grid-cols-6">
      {items.map((i) => (
        <div key={i.label} className="rounded-lg border border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_60%)] px-2 py-2">
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{i.label}</div>
          <div className="text-sm font-semibold tabular-nums">{i.value}</div>
        </div>
      ))}
    </div>
  );
}

function FallbackCard() {
  const fb = LLM_PROVIDERS.find((p) => p.id === LLM_DEFAULTS.fallbackProviderId)!;
  const fbModel = fb.models.find((m) => m.id === LLM_DEFAULTS.fallbackModelId);
  return (
    <GlassCard className="mt-4 border border-learning/25">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-learning/30 bg-learning/10 text-learning">
          <Coins className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">Fallback-Kette</h4>
            <StatusBadge tone="learning">aktiv</StatusBadge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Wenn der Primär-Provider offline ist oder timeoutet, fällt das System automatisch auf
            <span className="mx-1 font-semibold text-foreground">{fb.name}</span>
            mit Modell
            <span className="ml-1 font-semibold text-foreground">{fbModel?.label}</span> zurück.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

/* ────────────────────────────  Module Assignments  ──────────────────────────── */

function ModuleAssignments() {
  return (
    <section>
      <SectionTitle
        title={<span className="flex items-center gap-2"><Cpu className="h-5 w-5 text-info" /> Modul → Modell Zuordnung</span>}
        subtitle="Jedes Pet kann sein eigenes Modell nutzen — schwere Reasoning-Tasks gehen an größere Modelle."
      />
      <GlassCard className="overflow-hidden p-0">
        <div className="grid grid-cols-12 border-b border-[var(--glass-border)] bg-[oklch(0.16_0.04_265_/_70%)] px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">
          <div className="col-span-3">Modul</div>
          <div className="col-span-2">Pet</div>
          <div className="col-span-3">Provider</div>
          <div className="col-span-2">Modell</div>
          <div className="col-span-2">Zweck</div>
        </div>
        {MODULE_MODEL_ASSIGNMENTS.map((row, i) => {
          const provider = LLM_PROVIDERS.find((p) => p.id === row.providerId)!;
          const model = provider.models.find((m) => m.id === row.modelId);
          return (
            <div
              key={row.module}
              className={cn(
                "grid grid-cols-12 items-center px-4 py-3 text-sm",
                i % 2 === 0 ? "bg-transparent" : "bg-[oklch(0.18_0.04_265_/_30%)]",
              )}
            >
              <div className="col-span-3 font-medium">{row.module}</div>
              <div className="col-span-2 text-muted-foreground">{row.pet}</div>
              <div className="col-span-3">
                <StatusBadge tone={provider.type === "local" ? "shadow" : "info"}>
                  {provider.type === "local" ? <Cpu className="h-3 w-3" /> : <Cloud className="h-3 w-3" />}
                  {provider.name}
                </StatusBadge>
              </div>
              <div className="col-span-2 truncate text-xs font-semibold tabular-nums">{model?.label}</div>
              <div className="col-span-2 truncate text-xs text-muted-foreground">{row.purpose}</div>
            </div>
          );
        })}
      </GlassCard>
      <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
        <AlertTriangle className="h-3 w-3 text-warning" />
        Zuordnung ist im Prototype read-only. Im Live-System würde Nightly Governor Vorschläge dazu erzeugen.
      </div>
    </section>
  );
}

/* ────────────────────────────  System Config  ──────────────────────────── */

function SystemConfig() {
  return (
    <section>
      <SectionTitle title="System Configuration" subtitle="Allgemeine Modi und Verbindungen." />
      <GlassCard className="divide-y divide-[var(--glass-border)] p-0">
        {SETTINGS_VIEW.map((s) => {
          const isOff = s.value === "OFF" || s.value === "false";
          const tone = isOff ? "warning" : s.value.includes("Shadow") ? "shadow" : "success";
          return (
            <div key={s.label} className="flex items-center justify-between px-5 py-3.5">
              <div className="text-sm">{s.label}</div>
              <StatusBadge tone={tone}>{s.value}</StatusBadge>
            </div>
          );
        })}
      </GlassCard>
    </section>
  );
}
