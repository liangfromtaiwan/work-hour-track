export const PROJECTS = [
  {
    key: "rinneface",
    name: "rinneFACE",
    shareToken: process.env.NEXT_PUBLIC_DEFAULT_SHARE_TOKEN ?? "demo-report",
  },
  {
    key: "enebloom",
    name: "Enebloom",
    shareToken: "enebloom",
  },
] as const;

export type ProjectKey = (typeof PROJECTS)[number]["key"];

export function getProject(key: ProjectKey) {
  return PROJECTS.find((project) => project.key === key) ?? PROJECTS[0];
}

export function parseProjectKey(value: string | null): ProjectKey {
  return PROJECTS.some((project) => project.key === value)
    ? (value as ProjectKey)
    : PROJECTS[0].key;
}
