import { MASCOTS } from "./pet-mascots";
import { cn } from "@/lib/utils";

export function PetIcon({ id, size = 36, className, halo = true }: { id: string; size?: number; className?: string; halo?: boolean }) {
  const Mascot = MASCOTS[id];
  if (!Mascot) return null;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl",
        halo && "border border-[var(--glass-border)] bg-[oklch(0.18_0.04_265_/_70%)]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Mascot className="h-[88%] w-[88%]" />
    </span>
  );
}
