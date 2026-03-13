"use client";

import { ProgressBar } from "@/components/ui/progress-bar";
import { CONTRACT_HOURS, MAX_HOURS } from "@/lib/constants";

interface ProgressSectionProps {
  usedHours: number;
}

export function ProgressSection({ usedHours }: ProgressSectionProps) {
  const contractTone =
    usedHours <= CONTRACT_HOURS
      ? "default"
      : usedHours < MAX_HOURS
        ? "warning"
        : "danger";
  const maxTone =
    usedHours < MAX_HOURS ? (usedHours >= 25 ? "warning" : "default") : "danger";

  return (
    <div className="grid gap-4 rounded-xl border bg-card px-4 py-4 sm:grid-cols-2">
      <ProgressBar
        label="Contract progress (15h)"
        value={usedHours}
        max={CONTRACT_HOURS}
        tone={contractTone}
      />
      <ProgressBar
        label="Monthly max cap (30h)"
        value={usedHours}
        max={MAX_HOURS}
        tone={maxTone}
      />
    </div>
  );
}

