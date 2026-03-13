"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TimeEntry } from "@/types/time-entry";
import { getCumulativeTotals } from "@/lib/hours-calc";

interface ReadOnlyTableProps {
  entries: TimeEntry[];
  month: number;
  year: number;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ReadOnlyTimeEntryTable({
  entries,
  month,
  year,
}: ReadOnlyTableProps) {
  const filtered = entries
    .filter((e) => {
      const [y, m] = e.date.split("-").map(Number);
      return m === month && y === year;
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

  const cumulative = getCumulativeTotals(entries, month, year);

  if (filtered.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
        No time entries recorded for this month.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Task</TableHead>
          <TableHead className="text-right">Hours</TableHead>
          <TableHead className="max-w-[240px]">Note</TableHead>
          <TableHead className="text-right">Cumulative</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filtered.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell className="whitespace-nowrap text-muted-foreground">
              {formatDate(entry.date)}
            </TableCell>
            <TableCell className="font-medium">{entry.taskTitle}</TableCell>
            <TableCell className="text-right tabular-nums">
              {entry.hours.toFixed(1)}
            </TableCell>
            <TableCell className="max-w-[240px] truncate text-muted-foreground">
              {entry.note ?? "—"}
            </TableCell>
            <TableCell className="text-right tabular-nums font-medium">
              {cumulative.get(entry.id)?.toFixed(1) ?? "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

