"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  className?: string;
  tone?: "default" | "warning" | "danger";
}

export function ProgressBar({
  label,
  value,
  max,
  className,
  tone = "default",
}: ProgressBarProps) {
  const safeMax = max <= 0 ? 1 : max;
  const ratio = value / safeMax;
  const pct = Math.min(Math.max(ratio * 100, 0), 100);
  const overflow = value > max;

  const toneClass =
    tone === "danger"
      ? "bg-destructive/80"
      : tone === "warning"
        ? "bg-amber-500"
        : "bg-primary";

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums">
          {value.toFixed(1)}h{" "}
          <span className="text-[11px] text-muted-foreground/80">
            / {max.toFixed(1)}h
          </span>
        </span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-300",
            toneClass
          )}
          style={{ width: `${pct}%` }}
        />
        {overflow && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-1 text-[10px] font-medium text-destructive">
            +{(value - max).toFixed(1)}h
          </div>
        )}
      </div>
    </div>
  );
}

