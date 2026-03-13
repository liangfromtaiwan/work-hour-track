"use client";

import { Badge } from "@/components/ui/badge";
import type { StatusKind } from "@/lib/hours-calc";
import { cn } from "@/lib/utils";

interface StatusBannerProps {
  message: string;
  kind: StatusKind;
}

const variantMap: Record<StatusKind, "default" | "secondary" | "destructive" | "outline"> = {
  within_contract: "secondary",
  over_contract: "outline",
  approaching_max: "default",
  exceeded_max: "destructive",
};

const bgMap: Record<StatusKind, string> = {
  within_contract: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  over_contract: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  approaching_max: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  exceeded_max: "bg-destructive/10 text-destructive border-destructive/20",
};

export function StatusBanner({ message, kind }: StatusBannerProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-4 py-3",
        bgMap[kind]
      )}
    >
      <Badge variant={variantMap[kind]} className="shrink-0 font-medium">
        Status
      </Badge>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
