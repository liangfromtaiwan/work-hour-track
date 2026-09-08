"use client";

import { useCallback, useEffect, useState } from "react";
import { createReport, deleteReport, fetchReports, renameReport, type Report } from "@/lib/reports";

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

  const renameProject = useCallback(async (id: string, name: string) => {
    const project = await renameReport(id, name);
    setProjects((current) => current
      .map((item) => item.id === id ? project : item)
      .sort((a, b) => a.name.localeCompare(b.name)));
    return project;
  }, []);

  const removeProject = useCallback(async (id: string) => {
    await deleteReport(id);
    setProjects((current) => current.filter((item) => item.id !== id));
  }, []);

  return { projects, loading, addProject, renameProject, removeProject };
}
