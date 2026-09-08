import type { TimeEntry } from "@/types/time-entry";

/**
 * Entries belonging to the given month/year, sorted by date
 * (then by id for a stable same-day order).
 */
export function getMonthEntries(
  entries: TimeEntry[],
  month: number,
  year: number
): TimeEntry[] {
  return entries
    .filter((e) => {
      const [y, m] = e.date.split("-").map(Number);
      return m === month && y === year;
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
}

/**
 * Sum of all entry hours in the given month/year.
 */
export function getUsedHours(
  entries: TimeEntry[],
  month: number,
  year: number
): number {
  return getMonthEntries(entries, month, year).reduce(
    (sum, e) => sum + e.hours,
    0
  );
}

/**
 * Sum of all entry hours in the given calendar year.
 */
export function getYearHours(entries: TimeEntry[], year: number): number {
  return entries.reduce((sum, entry) => {
    const entryYear = Number(entry.date.split("-")[0]);
    return entryYear === year ? sum + entry.hours : sum;
  }, 0);
}

/**
 * Cumulative monthly total up to and including each entry (for table).
 */
export function getCumulativeTotals(
  entries: TimeEntry[],
  month: number,
  year: number
): Map<string, number> {
  const map = new Map<string, number>();
  let running = 0;
  for (const e of getMonthEntries(entries, month, year)) {
    running += e.hours;
    map.set(e.id, running);
  }
  return map;
}
