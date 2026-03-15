"use client";

import { useMemo, useState } from "react";
import { useEntries } from "@/hooks/use-entries";
import {
  SummaryCards,
  MonthFilter,
  TimeEntryForm,
  TimeEntryTable,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const contentAfterCards = (
    <>
      <MonthlySummary
        usedHours={usedHours}
        extraHours={extraHoursUsed}
        status={status}
      />
      <Card>
        <CardHeader>
          <CardTitle>Add time entry</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeEntryForm onSubmit={handleSubmit} />
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
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Work hours
          </h1>
          <p className="text-sm text-muted-foreground">
            Monthly contract and usage overview
          </p>
        </header>

        <Tabs defaultValue="15h" className="w-full">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <MonthFilter value={monthYear} onChange={setMonthYear} />
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
            {contentAfterCards}
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
            {contentAfterCards}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
