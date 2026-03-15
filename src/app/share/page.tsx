"use client";

import { useMemo } from "react";
import { useEntries } from "@/hooks/use-entries";
import {
  SummaryCards,
  MonthlySummary,
  ProgressSection,
} from "@/components/dashboard";
import {
  getExtraHoursUsed,
  getRemainingContractHours,
  getRemainingToMax,
  getStatusInfo,
  getUsedHours,
} from "@/lib/hours-calc";
import type { MonthYear } from "@/types/time-entry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReadOnlyTimeEntryTable } from "@/components/share/read-only-table";

function getCurrentMonthYear(): MonthYear {
  const d = new Date();
  return { month: d.getMonth() + 1, year: d.getFullYear() };
}

function formatMonthLabel({ month, year }: MonthYear): string {
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function SharePage() {
  const { entries, mounted } = useEntries();
  const monthYear = getCurrentMonthYear();
  const { month, year } = monthYear;

  const usedHours = useMemo(
    () => getUsedHours(entries, month, year),
    [entries, month, year]
  );
  const remainingContract = useMemo(
    () => getRemainingContractHours(usedHours),
    [usedHours]
  );
  const extraHoursUsed = useMemo(
    () => getExtraHoursUsed(usedHours),
    [usedHours]
  );
  const remainingToMax = useMemo(
    () => getRemainingToMax(usedHours),
    [usedHours]
  );
  const status = useMemo(() => getStatusInfo(usedHours), [usedHours]);

  const lastUpdated = useMemo(() => {
    if (!entries.length) return null;
    const sorted = [...entries].sort((a, b) =>
      (b.updatedAt ?? b.createdAt).localeCompare(a.updatedAt ?? a.createdAt)
    );
    return sorted[0]?.updatedAt ?? sorted[0]?.createdAt ?? null;
  }, [entries]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <p className="text-sm text-muted-foreground">Loading report…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Work hours report
          </h1>
          <p className="text-sm text-muted-foreground">
            Employer view · Read-only summary for {formatMonthLabel(monthYear)}
          </p>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Last updated:{" "}
              <span className="font-medium text-foreground">
                {new Date(lastUpdated).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
          )}
        </header>

        <SummaryCards
          usedHours={usedHours}
          remainingContract={remainingContract}
          extraHoursUsed={extraHoursUsed}
          remainingToMax={remainingToMax}
        />

        <MonthlySummary
          usedHours={usedHours}
          extraHours={extraHoursUsed}
          status={status}
        />

        <ProgressSection usedHours={usedHours} />

        <Card>
          <CardHeader>
            <CardTitle>Time entries (read-only)</CardTitle>
          </CardHeader>
          <CardContent>
            <ReadOnlyTimeEntryTable entries={entries} month={month} year={year} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

