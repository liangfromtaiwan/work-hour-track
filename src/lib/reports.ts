import { supabase } from "./supabaseClient";
import type { TimeEntry } from "@/types/time-entry";

export interface Report {
  id: string;
  contractHours: number;
  maxHours: number;
  shareToken: string;
  lastUpdated: string;
}

interface DbReport {
  id: string;
  contract_hours: number;
  max_hours: number;
  share_token: string;
  last_updated: string;
}

interface DbTimeEntry {
  id: string;
  report_id: string;
  date: string;
  title: string;
  hours: number;
  note: string | null;
  created_at: string;
  updated_at: string;
}

function mapReport(row: DbReport): Report {
  return {
    id: row.id,
    contractHours: row.contract_hours,
    maxHours: row.max_hours,
    shareToken: row.share_token,
    lastUpdated: row.last_updated,
  };
}

function mapEntry(row: DbTimeEntry): TimeEntry {
  return {
    id: row.id,
    date: row.date,
    taskTitle: row.title,
    hours: row.hours,
    note: row.note ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchReportByShareToken(shareToken: string) {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("share_token", shareToken)
    .maybeSingle<DbReport>();

  if (error || !data) {
    throw new Error("Report not found");
  }

  return mapReport(data);
}

export async function fetchEntriesForReport(reportId: string): Promise<TimeEntry[]> {
  const { data, error } = await supabase
    .from("time_entries")
    .select("*")
    .eq("report_id", reportId)
    .order("date", { ascending: true })
    .order("created_at", { ascending: true }) as { data: DbTimeEntry[] | null; error: any };

  if (error || !data) {
    return [];
  }

  return data.map(mapEntry);
}

export async function addEntryToReport(
  reportId: string,
  entry: Omit<TimeEntry, "id" | "createdAt" | "updatedAt">
): Promise<TimeEntry | null> {
  const { data, error } = await supabase
    .from("time_entries")
    .insert({
      report_id: reportId,
      date: entry.date,
      title: entry.taskTitle,
      hours: entry.hours,
      note: entry.note ?? null,
    })
    .select("*")
    .maybeSingle<DbTimeEntry>();

  if (error || !data) {
    return null;
  }

  await touchReport(reportId);

  return mapEntry(data);
}

export async function updateEntryInReport(
  reportId: string,
  id: string,
  updates: Partial<TimeEntry>
): Promise<void> {
  const payload: Partial<DbTimeEntry> = {};
  if (updates.date) payload.date = updates.date;
  if (updates.taskTitle) payload.title = updates.taskTitle;
  if (typeof updates.hours === "number") payload.hours = updates.hours;
  if ("note" in updates) payload.note = updates.note ?? null;

  await supabase.from("time_entries").update(payload).eq("id", id);
  await touchReport(reportId);
}

export async function deleteEntryFromReport(reportId: string, id: string): Promise<void> {
  await supabase.from("time_entries").delete().eq("id", id);
  await touchReport(reportId);
}

async function touchReport(reportId: string) {
  await supabase
    .from("reports")
    .update({ last_updated: new Date().toISOString() })
    .eq("id", reportId);
}

