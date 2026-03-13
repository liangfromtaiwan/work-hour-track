"use client";

import type { TimeEntry } from "@/types/time-entry";

interface LatestUpdateProps {
  entries: TimeEntry[];
  month: number;
  year: number;
}

function getLatestEntryInMonth(
  entries: TimeEntry[],
  month: number,
  year: number
): TimeEntry | null {
  const inMonth = entries.filter((e) => {
    const [y, m] = e.date.split("-").map(Number);
    return m === month && y === year;
  });
  if (inMonth.length === 0) return null;
  inMonth.sort((a, b) => {
    const aTime = a.updatedAt ?? a.createdAt;
    const bTime = b.updatedAt ?? b.createdAt;
    return bTime.localeCompare(aTime);
  });
  return inMonth[0] ?? null;
}

export function LatestUpdate({ entries, month, year }: LatestUpdateProps) {
  const latest = getLatestEntryInMonth(entries, month, year);
  if (!latest) {
    return (
      <p className="text-xs text-muted-foreground">
        No entries this month — add one to see update status.
      </p>
    );
  }
  const updated = latest.updatedAt ?? latest.createdAt;
  const updatedDate = new Date(updated);
  const dateStr = updatedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = updatedDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <p className="text-xs text-muted-foreground">
      Latest entry:{" "}
      <span className="font-medium text-foreground">
        {dateStr} {timeStr}
      </span>
      {" — "}
      {latest.taskTitle} ({latest.hours}h)
    </p>
  );
}
