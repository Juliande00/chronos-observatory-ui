import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassCard } from "@/components/glass-card";
import { Sparkles, ShieldCheck, Lock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login · OmniTrader" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
      <GlassCard glow="primary" className="w-full">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gradient-primary)] shadow-[var(--shadow-glow-primary)]">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-lg font-semibold text-gradient-primary">OmniTrader</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">ClaudeTrader Bridge · v1.1</div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!pwd) { setErr("Passwort erforderlich"); return; }
            if (pwd.length < 4) { setErr("Passwort zu kurz"); return; }
            setErr(null);
            setRole(pwd === "admin" ? "Admin" : "Viewer");
          }}
          className="space-y-3"
        >
          <label className="block">
            <span className="text-xs text-muted-foreground">Passwort</span>
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_60%)] px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>
          {err && <div className="rounded-md bg-destructive/15 px-3 py-2 text-xs text-destructive">{err}</div>}
          {role && (
            <div className="rounded-md bg-success/15 px-3 py-2 text-xs text-success inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" /> Eingeloggt als {role} ·{" "}
              <Link to="/" className="underline">zur Mission</Link>
            </div>
          )}
          <button className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Anmelden
          </button>
        </form>

        <div className="mt-5 flex items-start gap-2 rounded-md border border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_60%)] p-3 text-[11px] text-muted-foreground">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Es werden keine Passwörter, Tokens, Cookies oder API-Keys im UI oder im Log angezeigt. Demo-Login: <code className="text-foreground">admin</code> oder beliebiges Passwort = Viewer.
        </div>
      </GlassCard>
    </div>
  );
}
