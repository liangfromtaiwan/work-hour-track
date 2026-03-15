"use client";

import { ProgressBar } from "@/components/ui/progress-bar";
import { CONTRACT_HOURS, MAX_HOURS } from "@/lib/constants";

interface ProgressSectionProps {
  usedHours: number;
  /** When set, only the focused bar is shown (for tabbed views). */
  focus?: "contract" | "max";
}

export function ProgressSection({ usedHours, focus }: ProgressSectionProps) {
  const contractTone =
    usedHours < CONTRACT_HOURS ? "success" : "danger";
  const maxTone =
    usedHours < MAX_HOURS ? "success" : "danger";

  if (focus === "contract") {
    return (
      <div className="rounded-xl border bg-card px-4 py-4">
        <ProgressBar
          label="Contract progress (15h)"
          value={usedHours}
          max={CONTRACT_HOURS}
          tone={contractTone}
        />
      </div>
    );
  }

  if (focus === "max") {
    return (
      <div className="rounded-xl border bg-card px-4 py-4">
        <ProgressBar
          label="Monthly max cap (30h)"
          value={usedHours}
          max={MAX_HOURS}
          tone={maxTone}
        />
      </div>
    );
  }

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

