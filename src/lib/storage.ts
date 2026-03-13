import type { TimeEntry } from "@/types/time-entry";
import { STORAGE_KEY } from "./constants";

export function getEntries(): TimeEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const fallback = new Date().toISOString();
    const valid: TimeEntry[] = [];
    for (const rawEntry of parsed) {
      if (
        typeof rawEntry?.id !== "string" ||
        typeof rawEntry?.date !== "string" ||
        typeof rawEntry?.taskTitle !== "string" ||
        typeof rawEntry?.hours !== "number"
      ) {
        continue;
      }
      const entry: TimeEntry = {
        id: rawEntry.id,
        date: rawEntry.date,
        taskTitle: rawEntry.taskTitle,
        hours: rawEntry.hours,
        note: typeof rawEntry.note === "string" ? rawEntry.note : undefined,
        createdAt:
          typeof rawEntry.createdAt === "string"
            ? rawEntry.createdAt
            : fallback,
        updatedAt:
          typeof rawEntry.updatedAt === "string"
            ? rawEntry.updatedAt
            : fallback,
      };
      valid.push(entry);
    }
    return valid;
  } catch {
    return [];
  }
}

export function setEntries(entries: TimeEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

export function addEntry(entry: Omit<TimeEntry, "id">): TimeEntry {
  const entries = getEntries();
  const now = new Date().toISOString();
  const newEntry: TimeEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  setEntries([...entries, newEntry]);
  return newEntry;
}

export function updateEntry(id: string, updates: Partial<TimeEntry>): void {
  const entries = getEntries();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) return;
  const updated: TimeEntry = {
    ...entries[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  const next = [...entries];
  next[index] = updated;
  setEntries(next);
}

export function deleteEntry(id: string): void {
  setEntries(getEntries().filter((e) => e.id !== id));
}
