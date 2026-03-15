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

type DialogMode = "view" | "edit";

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
  const [mode, setMode] = useState<DialogMode>("view");
  const [editDate, setEditDate] = useState("");
  const [editTask, setEditTask] = useState("");
  const [editHours, setEditHours] = useState("");
  const [editNote, setEditNote] = useState("");

  const openView = (entry: TimeEntry) => {
    setActive(entry);
    setMode("view");
    setOpen(true);
  };
  const openEdit = (entry: TimeEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    setActive(entry);
    setMode("edit");
    setOpen(true);
  };

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
            <TableRow
              key={entry.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => openView(entry)}
            >
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {formatDate(entry.date)}
              </TableCell>
              <TableCell className="font-medium max-w-[200px] truncate">
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
                <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => openEdit(entry, e)}
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

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setActive(null);
            setMode("view");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{mode === "view" ? "Entry details" : "Edit entry"}</DialogTitle>
          </DialogHeader>

          {mode === "view" && active ? (
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
                <Button type="button" onClick={() => setMode("edit")}>
                  <PencilIcon className="mr-2 size-4" />
                  Edit
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="min-h-0 overflow-y-auto space-y-4">
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
                    rows={3}
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
                    setMode("view");
                    if (active) {
                      setEditDate(active.date);
                      setEditTask(active.taskTitle);
                      setEditHours(String(active.hours));
                      setEditNote(active.note ?? "");
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleSave} disabled={!active}>
                  Save changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
