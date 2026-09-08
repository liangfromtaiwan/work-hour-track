"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MonthlyHoursChart } from "@/components/dashboard";
import { buttonVariants } from "@/components/ui/button";
import { useEntries } from "@/hooks/use-entries";
import { getMonthlyHours, getYearHours } from "@/lib/hours-calc";

export default function AnalyticsPage() {
  const { entries, mounted } = useEntries();
  const currentYear = new Date().getFullYear();
  const monthlyHours = getMonthlyHours(entries, currentYear);
  const yearHours = getYearHours(entries, currentYear);

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
            <h1 className="text-2xl font-semibold tracking-tight">
              Work hour analysis
            </h1>
            <p className="text-sm text-muted-foreground">
              {currentYear} · {yearHours.toFixed(1)} total hours
            </p>
          </div>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            <ArrowLeft data-icon="inline-start" />
            Back
          </Link>
        </header>

        <MonthlyHoursChart year={currentYear} monthlyHours={monthlyHours} />
      </div>
    </div>
  );
}
