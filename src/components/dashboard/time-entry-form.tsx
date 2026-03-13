"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TimeEntryFormData } from "@/types/time-entry";

interface TimeEntryFormProps {
  onSubmit: (data: TimeEntryFormData) => void;
}

const defaultForm = {
  date: "",
  taskTitle: "",
  hours: "",
  note: "",
};

function todayISO(): string {
  const t = new Date();
  return t.toISOString().slice(0, 10);
}

export function TimeEntryForm({ onSubmit }: TimeEntryFormProps) {
  const [date, setDate] = useState(todayISO());
  const [taskTitle, setTaskTitle] = useState(defaultForm.taskTitle);
  const [hours, setHours] = useState(defaultForm.hours);
  const [note, setNote] = useState(defaultForm.note);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(hours);
    if (!date.trim() || !taskTitle.trim() || Number.isNaN(h) || h <= 0) return;
    onSubmit({ date, taskTitle, hours: h, note: note || undefined });
    setDate(todayISO());
    setTaskTitle(defaultForm.taskTitle);
    setHours(defaultForm.hours);
    setNote(defaultForm.note);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="taskTitle">Task title</Label>
          <Input
            id="taskTitle"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="e.g. API integration"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hours">Hours</Label>
          <Input
            id="hours"
            type="number"
            min="0.25"
            step="0.25"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="e.g. 1.5"
            required
          />
        </div>
        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
          <Button type="submit" size="default">
            Add entry
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="note">Note (optional)</Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional context or details"
          rows={2}
          className="resize-none"
        />
      </div>
    </form>
  );
}
