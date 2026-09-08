"use client";

import { FormEvent, useState } from "react";
import { Menu } from "@base-ui/react/menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Report } from "@/lib/reports";

interface ProjectActionsProps {
  project: Report;
  canDelete: boolean;
  onRename: (id: string, name: string) => Promise<Report>;
  onDelete: (id: string) => Promise<void>;
}

export function ProjectActions({ project, canDelete, onRename, onDelete }: ProjectActionsProps) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [name, setName] = useState(project.name);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleRename(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      await onRename(project.id, name.trim());
      setRenameOpen(false);
    } catch {
      setError("Project name could not be updated.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    setError("");
    try {
      await onDelete(project.id);
      setDeleteOpen(false);
    } catch {
      setError("Project could not be deleted.");
      setSaving(false);
    }
  }

  return (
    <>
      <Menu.Root>
        <Menu.Trigger render={<Button variant="ghost" size="icon-sm" aria-label={`Manage ${project.name}`} />}>
          <MoreVertical />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner side="bottom" align="start" sideOffset={6} className="z-50 outline-none">
            <Menu.Popup className="min-w-44 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md outline-none">
              <Menu.Item onClick={() => setRenameOpen(true)} className="flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none data-highlighted:bg-muted">
                <Pencil className="size-4" /> Edit name
              </Menu.Item>
              <Menu.Item disabled={!canDelete} onClick={() => setDeleteOpen(true)} className="flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive outline-none data-highlighted:bg-destructive/10 data-disabled:opacity-40">
                <Trash2 className="size-4" /> Delete project
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <form onSubmit={handleRename} className="contents">
            <DialogHeader>
              <DialogTitle>Edit project name</DialogTitle>
              <DialogDescription>This changes the name shown throughout the tracker.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <Label htmlFor="edit-project-name">Project name</Label>
              <Input id="edit-project-name" value={name} onChange={(event) => setName(event.target.value)} autoFocus maxLength={80} />
              {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRenameOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={!name.trim() || saving}>{saving ? "Saving…" : "Save name"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {project.name}?</DialogTitle>
            <DialogDescription>This permanently deletes this project and all of its time entries. This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={saving}>{saving ? "Deleting…" : "Delete project"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
