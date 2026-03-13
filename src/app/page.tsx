"use client";

import { useMemo, useState } from "react";
import { useEntries } from "@/hooks/use-entries";
import {
  SummaryCards,
  StatusBanner,
  MonthFilter,
  TimeEntryForm,
  TimeEntryTable,
  LatestUpdate,
  MonthlySummary,
  ProgressSection,
} from "@/components/dashboard";
import {
  getUsedHours,
  getRemainingContractHours,
  getExtraHoursUsed,
  getRemainingToMax,
  getStatusInfo,
} from "@/lib/hours-calc";
import type { MonthYear } from "@/types/time-entry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function getCurrentMonthYear(): MonthYear {
  const d = new Date();
  return { month: d.getMonth() + 1, year: d.getFullYear() };
}

export default function Home() {
  const { entries, add, update, remove, mounted } = useEntries();
  const [monthYear, setMonthYear] = useState<MonthYear>(getCurrentMonthYear);

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

  const handleSubmit = (data: Parameters<typeof add>[0]) => {
    add(data);
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Work hours
          </h1>
          <p className="text-sm text-muted-foreground">
            Monthly contract and usage overview
          </p>
        </header>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <MonthFilter value={monthYear} onChange={setMonthYear} />
          <LatestUpdate entries={entries} month={month} year={year} />
        </div>

        <SummaryCards
          usedHours={usedHours}
          remainingContract={remainingContract}
          extraHoursUsed={extraHoursUsed}
          remainingToMax={remainingToMax}
        />

        <StatusBanner message={status.message} kind={status.kind} />

        <MonthlySummary
          usedHours={usedHours}
          extraHours={extraHoursUsed}
          status={status}
        />

        <ProgressSection usedHours={usedHours} />

        <Card>
          <CardHeader>
            <CardTitle>Add time entry</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeEntryForm
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time entries</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeEntryTable
              entries={entries}
              month={month}
              year={year}
              onUpdate={update}
              onDelete={remove}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
