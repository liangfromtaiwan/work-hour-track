"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROJECTS, type ProjectKey } from "@/lib/projects";

interface ProjectFilterProps {
  value: ProjectKey;
  onChange: (project: ProjectKey) => void;
}

export function ProjectFilter({ value, onChange }: ProjectFilterProps) {
  const selectedProject = PROJECTS.find((project) => project.key === value);

  return (
    <div className="flex flex-col gap-2">
      <Label>Project</Label>
      <Select
        value={selectedProject?.name}
        onValueChange={(nextValue) => {
          const project = PROJECTS.find((item) => item.name === nextValue);
          if (project) onChange(project.key);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select project" />
        </SelectTrigger>
        <SelectContent>
          {PROJECTS.map((project) => (
            <SelectItem key={project.key} value={project.name}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
