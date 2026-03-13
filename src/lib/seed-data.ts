import type { TimeEntry } from "@/types/time-entry";

function isoDate(year: number, month: number, day: number): string {
  const m = String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

/**
 * Sample time entries for the current month and previous month.
 * Used to seed localStorage when empty.
 */
export function getSeedEntries(): TimeEntry[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const makeTimestamps = (date: string, offsetMinutes: number) => {
    const base = new Date(`${date}T10:00:00Z`);
    const created = new Date(base.getTime() + offsetMinutes * 60_000);
    const updated = new Date(base.getTime() + (offsetMinutes + 15) * 60_000);
    return {
      createdAt: created.toISOString(),
      updatedAt: updated.toISOString(),
    };
  };

  return [
    {
      id: "seed-1",
      date: isoDate(currentYear, currentMonth, 2),
      taskTitle: "Project setup and requirements review",
      hours: 2,
      note: "Kickoff meeting and docs",
      ...makeTimestamps(isoDate(currentYear, currentMonth, 2), 0),
    },
    {
      id: "seed-2",
      date: isoDate(currentYear, currentMonth, 5),
      taskTitle: "API integration",
      hours: 3.5,
      note: "Auth and data endpoints",
      ...makeTimestamps(isoDate(currentYear, currentMonth, 5), 60),
    },
    {
      id: "seed-3",
      date: isoDate(currentYear, currentMonth, 8),
      taskTitle: "Frontend components",
      hours: 4,
      ...makeTimestamps(isoDate(currentYear, currentMonth, 8), 120),
    },
    {
      id: "seed-4",
      date: isoDate(currentYear, currentMonth, 12),
      taskTitle: "Testing and bug fixes",
      hours: 2.5,
      ...makeTimestamps(isoDate(currentYear, currentMonth, 12), 180),
    },
    {
      id: "seed-5",
      date: isoDate(prevYear, prevMonth, 20),
      taskTitle: "Previous month: backlog tasks",
      hours: 5,
      note: "Carryover work",
      ...makeTimestamps(isoDate(prevYear, prevMonth, 20), 240),
    },
    {
      id: "seed-6",
      date: isoDate(prevYear, prevMonth, 28),
      taskTitle: "Previous month: documentation",
      hours: 3,
      ...makeTimestamps(isoDate(prevYear, prevMonth, 28), 300),
    },
  ];
}
