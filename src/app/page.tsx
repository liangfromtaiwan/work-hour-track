"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChartColumn } from "lucide-react";
import { useEntries } from "@/hooks/use-entries";
import {
  SummaryCards,
  MonthFilter,
  TimeEntryForm,
  TimeEntryTable,
} from "@/components/dashboard";
import { getMonthEntries, getYearHours } from "@/lib/hours-calc";
import type { MonthYear } from "@/types/time-entry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

function getCurrentMonthYear(): MonthYear {
  const d = new Date();
  return { month: d.getMonth() + 1, year: d.getFullYear() };
}

export default function Home() {
  const { entries, add, update, remove, mounted } = useEntries();
  const [monthYear, setMonthYear] = useState<MonthYear>(getCurrentMonthYear);

  const { month, year } = monthYear;
  const monthEntries = useMemo(
    () => getMonthEntries(entries, month, year),
    [entries, month, year]
  );
  const usedHours = useMemo(
    () => monthEntries.reduce((sum, e) => sum + e.hours, 0),
    [monthEntries]
  );
  const currentYear = new Date().getFullYear();
  const yearHours = useMemo(
    () => getYearHours(entries, currentYear),
    [entries, currentYear]
  );

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
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Work hours
            </h1>
            <p className="text-sm text-muted-foreground">
              Monthly hours overview
            </p>
          </div>
          <Link href="/analytics" className={buttonVariants({ variant: "outline" })}>
            <ChartColumn data-icon="inline-start" />
            Monthly analysis
          </Link>
        </header>

        <MonthFilter value={monthYear} onChange={setMonthYear} />

        <div className="space-y-8">
          <SummaryCards
            usedHours={usedHours}
            yearHours={yearHours}
            currentYear={currentYear}
            entryCount={monthEntries.length}
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
        </div>
      </div>
    </div>
  );
}
