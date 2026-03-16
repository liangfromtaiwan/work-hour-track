"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  const [active, setActive] = useState<TimeEntry | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = entries
    .filter((e) => {
      const [y, m] = e.date.split("-").map(Number);
      return m === month && y === year;
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

  const cumulative = getCumulativeTotals(entries, month, year);

  const openView = (entry: TimeEntry) => {
    setActive(entry);
    setOpen(true);
  };

  if (filtered.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
        No time entries recorded for this month.
      </p>
    );
  }

  return (
    <>
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
            <TableRow
              key={entry.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => openView(entry)}
            >
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

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setActive(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Entry details</DialogTitle>
          </DialogHeader>
          {active && (
            <>
              <div className="min-h-0 overflow-y-auto space-y-4 text-sm pr-1">
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Date</div>
                  <p className="mt-0.5 font-medium">{formatDate(active.date)}</p>
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Task</div>
                  <p className="mt-0.5 font-medium break-words whitespace-pre-wrap">
                    {active.taskTitle}
                  </p>
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Hours</div>
                  <p className="mt-0.5 font-medium tabular-nums">{active.hours.toFixed(1)}h</p>
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Note</div>
                  <p className="mt-0.5 text-muted-foreground break-words whitespace-pre-wrap min-h-[1.5rem] max-h-32 overflow-y-auto">
                    {active.note ?? "—"}
                  </p>
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Cumulative (month)</div>
                  <p className="mt-0.5 font-medium tabular-nums">
                    {cumulative.get(active.id)?.toFixed(1) ?? "—"}h
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    setActive(null);
                  }}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

