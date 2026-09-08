"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MonthlyHoursChart } from "@/components/dashboard";
import { buttonVariants } from "@/components/ui/button";
import { useEntries } from "@/hooks/use-entries";
import { getMonthlyHours, getYearHours } from "@/lib/hours-calc";
import { getProject, parseProjectKey } from "@/lib/projects";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  );
}

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const projectKey = parseProjectKey(searchParams.get("project"));
  const project = getProject(projectKey);
  const { entries, mounted } = useEntries(project.shareToken);
  const currentYear = new Date().getFullYear();
  const monthlyHours = getMonthlyHours(entries, currentYear);
  const yearHours = getYearHours(entries, currentYear);

  if (!mounted) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {project.name} analysis
            </h1>
            <p className="text-sm text-muted-foreground">
              {currentYear} · {yearHours.toFixed(1)} total hours
            </p>
          </div>
          <Link
            href={`/?project=${projectKey}`}
            className={buttonVariants({ variant: "outline" })}
          >
            <ArrowLeft data-icon="inline-start" />
            Back
          </Link>
        </header>

        <MonthlyHoursChart year={currentYear} monthlyHours={monthlyHours} />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AnalyticsContent />
    </Suspense>
  );
}
