"use client";

import { useCallback, useEffect, useState } from "react";
import { createReport, fetchReports, type Report } from "@/lib/reports";

const FALLBACK_PROJECTS: Report[] = [
  { id: "rinneface", name: "rinneFACE", shareToken: process.env.NEXT_PUBLIC_DEFAULT_SHARE_TOKEN ?? "demo-report", contractHours: 0, maxHours: 0, lastUpdated: "" },
  { id: "enebloom", name: "Enebloom", shareToken: "enebloom", contractHours: 0, maxHours: 0, lastUpdated: "" },
];

export function useProjects() {
  const [projects, setProjects] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports()
      .then((data) => setProjects(data.length ? data : FALLBACK_PROJECTS))
      .catch(() => setProjects(FALLBACK_PROJECTS))
      .finally(() => setLoading(false));
  }, []);

  const addProject = useCallback(async (name: string) => {
    const project = await createReport(name);
    setProjects((current) => [...current, project].sort((a, b) => a.name.localeCompare(b.name)));
    return project;
  }, []);

  return { projects, loading, addProject };
}
