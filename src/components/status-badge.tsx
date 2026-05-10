import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "learning" | "muted" | "shadow";

const toneMap: Record<Tone, string> = {
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  danger: "bg-destructive/15 text-destructive border-destructive/30",
  info: "bg-info/15 text-info border-info/30",
  learning: "bg-learning/15 text-learning border-learning/30",
  muted: "bg-muted text-muted-foreground border-border",
  shadow: "bg-warning/10 text-warning border-warning/25",
};

export function StatusBadge({
  tone = "muted",
  children,
  dot = false,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneMap[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current anim-pulse-soft" />}
      {children}
    </span>
  );
}
