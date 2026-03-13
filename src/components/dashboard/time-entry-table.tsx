"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TimeEntry } from "@/types/time-entry";
import { getCumulativeTotals } from "@/lib/hours-calc";
import { PencilIcon, Trash2Icon } from "lucide-react";

interface TimeEntryTableProps {
  entries: TimeEntry[];
  month: number;
  year: number;
  onUpdate: (id: string, updates: Partial<TimeEntry>) => void;
  onDelete: (id: string) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TimeEntryTable({
  entries,
  month,
  year,
  onUpdate,
  onDelete,
}: TimeEntryTableProps) {
  const [active, setActive] = useState<TimeEntry | null>(null);
  const [open, setOpen] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [editTask, setEditTask] = useState("");
  const [editHours, setEditHours] = useState("");
  const [editNote, setEditNote] = useState("");

  const filtered = entries
    .filter((e) => {
      const [y, m] = e.date.split("-").map(Number);
      return m === month && y === year;
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

  const cumulative = getCumulativeTotals(entries, month, year);

  useEffect(() => {
    if (active) {
      setEditDate(active.date);
      setEditTask(active.taskTitle);
      setEditHours(String(active.hours));
      setEditNote(active.note ?? "");
    } else {
      setEditDate("");
      setEditTask("");
      setEditHours("");
      setEditNote("");
    }
  }, [active]);

  const handleSave = () => {
    if (!active) return;
    const h = parseFloat(editHours);
    if (!editDate.trim() || !editTask.trim() || Number.isNaN(h) || h <= 0) {
      return;
    }
    onUpdate(active.id, {
      date: editDate,
      taskTitle: editTask,
      hours: h,
      note: editNote || undefined,
    });
    setOpen(false);
    setActive(null);
  };

  const handleDelete = () => {
    if (!active) return;
    onDelete(active.id);
    setOpen(false);
    setActive(null);
  };

  if (filtered.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
        No time entries for this month. Add one above.
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
            <TableHead className="max-w-[200px]">Note</TableHead>
            <TableHead className="text-right">Cumulative</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {formatDate(entry.date)}
              </TableCell>
              <TableCell className="font-medium">
                {entry.taskTitle}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {entry.hours.toFixed(1)}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground">
                {entry.note ?? "—"}
              </TableCell>
              <TableCell className="text-right tabular-nums font-medium">
                {cumulative.get(entry.id)?.toFixed(1) ?? "—"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      setActive(entry);
                      setOpen(true);
                    }}
                    aria-label="Edit entry"
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={(next) => {
        setOpen(next);
        if (!next) setActive(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-task">Task title</Label>
              <Input
                id="edit-task"
                value={editTask}
                onChange={(e) => setEditTask(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-hours">Hours</Label>
              <Input
                id="edit-hours"
                type="number"
                min="0.25"
                step="0.25"
                value={editHours}
                onChange={(e) => setEditHours(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-note">Note (optional)</Label>
              <Textarea
                id="edit-note"
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive sm:mr-auto"
              onClick={handleDelete}
              disabled={!active}
            >
              <Trash2Icon className="mr-2 size-4" />
              Delete entry
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setActive(null);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={!active}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
