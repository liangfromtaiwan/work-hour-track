"use client";

import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Report } from "@/lib/reports";

const ADD_PROJECT = "__add_project__";

interface ProjectFilterProps {
  projects: Report[];
  value: string;
  onChange: (shareToken: string) => void;
  onAdd: (name: string) => Promise<Report>;
}

export function ProjectFilter({ projects, value, onChange, onAdd }: ProjectFilterProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const project = await onAdd(name.trim());
      onChange(project.shareToken);
      setName("");
      setOpen(false);
    } catch {
      setError("Project could not be added. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>Project</Label>
      <Select value={value} onValueChange={(next) => {
        if (!next) return;
        if (next === ADD_PROJECT) setOpen(true);
        else onChange(next);
      }}>
        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select project" /></SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.shareToken}>{project.name}</SelectItem>
          ))}
          <SelectItem value={ADD_PROJECT} className="border-t text-primary">
            <Plus className="size-4" /> Add new project
          </SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit} className="contents">
            <DialogHeader>
              <DialogTitle>Add new project</DialogTitle>
              <DialogDescription>Create a separate workspace for a client’s hours.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <Label htmlFor="project-name">Project name</Label>
              <Input id="project-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. New client" autoFocus maxLength={80} />
              {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={!name.trim() || saving}>{saving ? "Adding…" : "Add project"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
