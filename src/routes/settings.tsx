import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { StatusBadge } from "@/components/status-badge";
import { SETTINGS_VIEW } from "@/lib/mock-data";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · ClaudeTrader" }, { name: "description", content: "Read-only Konfigurations-Übersicht." }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SectionTitle title="Settings" subtitle="Read-only Übersicht — gefährliche Controls sind ausgeblendet." />
      <GlassCard className="border border-warning/30 bg-warning/5">
        <div className="flex items-center gap-3 text-sm">
          <Lock className="h-4 w-4 text-warning" />
          <span className="text-muted-foreground">
            Konfiguration ist im Prototype nur lesbar. Keine API-Keys, Tokens oder Secrets werden angezeigt.
          </span>
        </div>
      </GlassCard>
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
    </div>
  );
}
