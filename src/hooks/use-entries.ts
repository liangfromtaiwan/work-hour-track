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

export function useEntries(shareToken = DEFAULT_SHARE_TOKEN) {
  const [entries, setEntriesState] = useState<TimeEntry[]>([]);
  const [reportId, setReportId] = useState<string | null>(null);
  const [loadedShareToken, setLoadedShareToken] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const report = await fetchReportByShareToken(shareToken);
        if (cancelled) return;
        setReportId(report.id);
        const data = await fetchEntriesForReport(report.id);
        if (cancelled) return;
        setEntriesState(data);
        setLoadedShareToken(shareToken);
      } catch {
        if (!cancelled) {
          setEntriesState([]);
          setReportId(null);
          setLoadedShareToken(shareToken);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [shareToken]);

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
    entries: loadedShareToken === shareToken ? entries : [],
    mounted: loadedShareToken === shareToken,
    add,
    update,
    remove,
    refresh,
    shareToken,
  };
}
