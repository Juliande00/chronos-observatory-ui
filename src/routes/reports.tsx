import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { StatusBadge } from "@/components/status-badge";
import { REPORTS } from "@/lib/mock-data";
import { Search, FileText } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports · ClaudeTrader" }, { name: "description", content: "Report-Bibliothek aller ClaudeTrader-Module." }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const [q, setQ] = useState("");
  const filtered = REPORTS.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()) || r.module.includes(q.toLowerCase()));
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionTitle title="Reports" subtitle="Alle Audit- und Learning-Reports." />
      <GlassCard className="flex items-center gap-2 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Suche nach Report oder Modul..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </GlassCard>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((r) => {
          const tone = r.status === "ok" ? "success" : r.status === "warning" ? "warning" : "danger";
          return (
            <GlassCard key={r.title} className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">{r.title}</h3>
                </div>
                <StatusBadge tone={tone}>{r.status}</StatusBadge>
              </div>
              <div className="text-xs text-muted-foreground">{r.date} · {r.module}</div>
              <p className="text-sm text-muted-foreground">{r.summary}</p>
              <button className="text-xs text-info hover:text-info/80">Details öffnen →</button>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
