"use client";

import { Badge } from "@/components/ui/badge";
import { CONTRACT_HOURS, MAX_HOURS } from "@/lib/constants";
import type { StatusInfo } from "@/lib/hours-calc";

interface MonthlySummaryProps {
  usedHours: number;
  extraHours: number;
  status: StatusInfo;
}

export function MonthlySummary({
  usedHours,
  extraHours,
  status,
}: MonthlySummaryProps) {
  const statusLabel =
    status.kind === "within_contract"
      ? "Within contract"
      : status.kind === "over_contract"
        ? "Needs discussion"
        : status.kind === "approaching_max"
          ? "Approaching max"
          : "Exceeded max";

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <div>
          <div className="text-xs text-muted-foreground">Total worked</div>
          <div className="font-medium tabular-nums">
            {usedHours.toFixed(1)}h
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Contract hours</div>
          <div className="font-medium tabular-nums">
            {CONTRACT_HOURS.toFixed(1)}h
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Extra hours</div>
          <div className="font-medium tabular-nums">
            {extraHours.toFixed(1)}h
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          Status
        </Badge>
        <span className="text-sm font-medium">{statusLabel}</span>
      </div>
    </div>
  );
}

