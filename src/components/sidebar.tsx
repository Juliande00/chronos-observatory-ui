import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, BrainCircuit, LineChart, Stethoscope, Moon,
  Flame, Swords, Compass, Wallet, FileText, Settings, Sparkles, CandlestickChart,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { to: "/", label: "Mission Control", icon: LayoutDashboard },
  { to: "/brain", label: "System Brain", icon: BrainCircuit },
  { to: "/trades", label: "Live Trades", icon: LineChart },
  { to: "/chart", label: "Paper Trading", icon: CandlestickChart },
  { to: "/treatment", label: "Trade Treatment", icon: Stethoscope },
  { to: "/governor", label: "Nightly Governor", icon: Moon },
  { to: "/candlesight", label: "CandleSight", icon: Flame },
  { to: "/arena", label: "Battle Arena", icon: Swords },
  { to: "/hermes", label: "Hermes / XGBoost", icon: Compass },
  { to: "/risk", label: "Balance & Risk", icon: Wallet },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-1 border-r border-[var(--glass-border)] bg-[oklch(0.16_0.04_265_/_70%)] backdrop-blur-xl px-3 py-5">
      <div className="mb-5 flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--gradient-primary)] shadow-[var(--shadow-glow-primary)]">
          <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">ClaudeTrader</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Mission Control</div>
        </div>
      </div>
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all",
                active
                  ? "bg-[oklch(0.30_0.08_260_/_60%)] text-foreground shadow-[var(--shadow-glow-primary)]"
                  : "text-muted-foreground hover:bg-[oklch(0.25_0.04_265_/_60%)] hover:text-foreground",
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
              <span className="truncate">{item.label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary anim-pulse-soft" />}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-xl border border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_60%)] p-3 text-xs text-muted-foreground">
        <div className="font-medium text-foreground">Visual prototype</div>
        Mock data · keine Live-Order
      </div>
    </aside>
  );
}

const MOBILE_TABS = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/trades", label: "Trades", icon: LineChart },
  { to: "/brain", label: "Brain", icon: BrainCircuit },
  { to: "/governor", label: "Learning", icon: Moon },
  { to: "/risk", label: "Risk", icon: Wallet },
];

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 glass-strong border-t border-[var(--glass-border)] flex items-stretch justify-around px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      {MOBILE_TABS.map((t) => {
        const active = t.to === "/" ? pathname === "/" : pathname.startsWith(t.to);
        const Icon = t.icon;
        return (
          <Link
            key={t.to}
            to={t.to}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-medium",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="h-5 w-5" />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileHeader() {
  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)] glass-strong sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--gradient-primary)]">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="text-sm font-semibold">ClaudeTrader</div>
      </div>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Mission Control</span>
    </header>
  );
}
