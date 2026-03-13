import type { TimeEntry } from "@/types/time-entry";
import { CONTRACT_HOURS, MAX_HOURS } from "./constants";

/**
 * Sum of all entry hours in the given month/year.
 */
export function getUsedHours(
  entries: TimeEntry[],
  month: number,
  year: number
): number {
  return entries
    .filter((e) => {
      const [y, m] = e.date.split("-").map(Number);
      return m === month && y === year;
    })
    .reduce((sum, e) => sum + e.hours, 0);
}

/**
 * Hours remaining within the 15-hour contract (min 0).
 */
export function getRemainingContractHours(usedHours: number): number {
  return Math.max(CONTRACT_HOURS - usedHours, 0);
}

/**
 * Extra hours used beyond the contract (min 0).
 */
export function getExtraHoursUsed(usedHours: number): number {
  return Math.max(usedHours - CONTRACT_HOURS, 0);
}

/**
 * Hours remaining until the 30-hour max cap (min 0).
 */
export function getRemainingToMax(usedHours: number): number {
  return Math.max(MAX_HOURS - usedHours, 0);
}

export type StatusKind =
  | "within_contract"
  | "over_contract"
  | "approaching_max"
  | "exceeded_max";

export interface StatusInfo {
  kind: StatusKind;
  message: string;
}

/**
 * Status banner message based on total hours.
 * - total <= 15: within contract
 * - total > 15 and < 25: over contract
 * - total >= 25 and < 30: approaching max
 * - total >= 30: exceeded max
 */
export function getStatusInfo(usedHours: number): StatusInfo {
  if (usedHours >= MAX_HOURS) {
    return {
      kind: "exceeded_max",
      message: "Exceeded monthly max limit",
    };
  }
  if (usedHours >= 25) {
    return {
      kind: "approaching_max",
      message: "Approaching monthly max limit",
    };
  }
  if (usedHours > CONTRACT_HOURS) {
    return {
      kind: "over_contract",
      message:
        "Over contract hours. Please discuss additional work with employer",
    };
  }
  return {
    kind: "within_contract",
    message: "Within monthly contract hours",
  };
}

/**
 * Cumulative monthly total up to and including each entry (for table).
 * Entries must be sorted by date (and optionally by id for same-day order).
 */
export function getCumulativeTotals(
  entries: TimeEntry[],
  month: number,
  year: number
): Map<string, number> {
  const filtered = entries
    .filter((e) => {
      const [y, m] = e.date.split("-").map(Number);
      return m === month && y === year;
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

  const map = new Map<string, number>();
  let running = 0;
  for (const e of filtered) {
    running += e.hours;
    map.set(e.id, running);
  }
  return map;
}
