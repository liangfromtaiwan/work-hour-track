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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Work hours
          </h1>
          <p className="text-sm text-muted-foreground">
            Read-only report · {formatMonthLabel(monthYear)}
          </p>
        </header>

        <Tabs defaultValue="15h" className="w-full">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {formatMonthLabel(monthYear)}
            </p>
            <TabsList className="grid w-full max-w-md grid-cols-2 sm:w-auto">
              <TabsTrigger value="15h">15h Contract</TabsTrigger>
              <TabsTrigger value="30h">30h Max</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="15h" className="mt-6 space-y-8">
            <ProgressSection usedHours={usedHours} focus="contract" />
            <SummaryCards
              usedHours={usedHours}
              remainingContract={remainingContract}
              extraHoursUsed={extraHoursUsed}
              remainingToMax={remainingToMax}
              focus="contract"
            />

            <MonthlySummary
              usedHours={usedHours}
              extraHours={extraHoursUsed}
              status={status}
            />

            <Card>
              <CardHeader>
                <CardTitle>Time entries</CardTitle>
                {lastUpdated && (
                  <p className="text-xs text-muted-foreground font-normal">
                    Read-only · Last updated:{" "}
                    {new Date(lastUpdated).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <ReadOnlyTimeEntryTable entries={entries} month={month} year={year} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="30h" className="mt-6 space-y-8">
            <ProgressSection usedHours={usedHours} focus="max" />
            <SummaryCards
              usedHours={usedHours}
              remainingContract={remainingContract}
              extraHoursUsed={extraHoursUsed}
              remainingToMax={remainingToMax}
              focus="max"
            />
            <MonthlySummary
              usedHours={usedHours}
              extraHours={extraHoursUsed}
              status={status}
            />
            <Card>
              <CardHeader>
                <CardTitle>Time entries</CardTitle>
                {lastUpdated && (
                  <p className="text-xs text-muted-foreground font-normal">
                    Read-only · Last updated:{" "}
                    {new Date(lastUpdated).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <ReadOnlyTimeEntryTable entries={entries} month={month} year={year} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

