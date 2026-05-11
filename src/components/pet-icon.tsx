import { MASCOTS } from "./pet-mascots";
import { cn } from "@/lib/utils";

export function PetIcon({ id, size = 28, className, halo = true }: { id: string; size?: number; className?: string; halo?: boolean }) {
  const Mascot = MASCOTS[id];
  if (!Mascot) return null;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl border border-[var(--glass-border)]",
        halo && "bg-[oklch(0.18_0.04_265_/_70%)] shadow-inner",
        className,
      )}
      style={{ width: size + 8, height: size + 8 }}
    >
      <Mascot className="h-full w-full" />
    </span>
  );
}
