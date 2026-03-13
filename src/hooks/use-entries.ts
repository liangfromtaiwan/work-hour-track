"use client";

import { useCallback, useEffect, useState } from "react";
import type { TimeEntry, TimeEntryFormData } from "@/types/time-entry";
import {
  addEntryToReport,
  deleteEntryFromReport,
  fetchEntriesForReport,
  fetchReportByShareToken,
  updateEntryInReport,
} from "@/lib/reports";

const DEFAULT_SHARE_TOKEN =
  process.env.NEXT_PUBLIC_DEFAULT_SHARE_TOKEN ?? "demo-report";

export function useEntries() {
  const [entries, setEntriesState] = useState<TimeEntry[]>([]);
  const [reportId, setReportId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const report = await fetchReportByShareToken(DEFAULT_SHARE_TOKEN);
        if (cancelled) return;
        setReportId(report.id);
        const data = await fetchEntriesForReport(report.id);
        if (cancelled) return;
        setEntriesState(data);
      } finally {
        if (!cancelled) setMounted(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!reportId) return;
    const data = await fetchEntriesForReport(reportId);
    setEntriesState(data);
  }, [reportId]);

  const add = useCallback(
    async (entry: TimeEntryFormData) => {
      if (!reportId) return null;
      const added = await addEntryToReport(reportId, entry);
      if (added) {
        setEntriesState((prev) => [...prev, added]);
      }
      return added;
    },
    [reportId]
  );

  const update = useCallback(
    async (id: string, updates: Partial<TimeEntry>) => {
      if (!reportId) return;
      await updateEntryInReport(reportId, id, updates);
      await refresh();
    },
    [reportId, refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      if (!reportId) return;
      await deleteEntryFromReport(reportId, id);
      setEntriesState((prev) => prev.filter((e) => e.id !== id));
    },
    [reportId]
  );

  return {
    entries: mounted ? entries : [],
    mounted,
    add,
    update,
    remove,
    refresh,
    shareToken: DEFAULT_SHARE_TOKEN,
  };
}

