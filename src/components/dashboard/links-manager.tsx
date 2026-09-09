"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Copy,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LinkItem, LinkType } from "@/lib/types";
import { cn } from "@/lib/utils";

function SortableLink({
  link,
  onToggle,
  onEdit,
  onDelete,
  onDuplicate,
}: {
  link: LinkItem;
  onToggle: (id: string, active: boolean) => void;
  onEdit: (link: LinkItem) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "group flex items-center gap-3 rounded-2xl border border-border/70 bg-card/70 p-3 transition",
        isDragging && "z-10 shadow-lg",
        !link.is_active && "opacity-60"
      )}
    >
      <button
        type="button"
        className="touch-none rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-sm">
        {link.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={link.thumbnail} alt="" className="h-full w-full rounded-xl object-cover" />
        ) : (
          link.title.slice(0, 1)
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{link.title || "Untitled"}</div>
        <div className="truncate text-xs text-muted-foreground">
          {link.type === "divider"
            ? "Divider"
            : link.type === "text"
              ? "Text block"
              : link.url}
        </div>
      </div>
      <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
        <span className="rounded-md bg-muted px-1.5 py-0.5 capitalize">{link.type}</span>
      </div>
      <Switch
        checked={link.is_active}
        onCheckedChange={(checked) => onToggle(link.id, checked)}
        aria-label="Enable link"
      />
      <Button variant="ghost" size="icon-sm" onClick={() => onEdit(link)} aria-label="Edit">
        <Pencil className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex size-7 items-center justify-center rounded-lg hover:bg-muted"
          aria-label="More"
        >
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onDuplicate(link.id)}>
            <Copy className="mr-2 h-4 w-4" /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(link.id)}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function LinksManager({
  initialLinks,
  onChange,
}: {
  initialLinks: LinkItem[];
  onChange?: (links: LinkItem[]) => void;
}) {
  const [links, setLinks] = useState(initialLinks);
  const [editing, setEditing] = useState<LinkItem | null>(null);
  const [open, setOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const ids = useMemo(() => links.map((l) => l.id), [links]);

  function sync(next: LinkItem[]) {
    setLinks(next);
    onChange?.(next);
  }

  async function api(body: Record<string, unknown>) {
    const res = await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  }

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);
    const next = arrayMove(links, oldIndex, newIndex).map((l, i) => ({
      ...l,
      position: i,
    }));
    sync(next);
    try {
      await api({ action: "reorder_links", orderedIds: next.map((l) => l.id) });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Reorder failed");
    }
  }

  async function createLink(type: LinkType = "standard") {
    try {
      const data = await api({
        action: "create_link",
        title: type === "divider" ? "" : type === "text" ? "Section note" : "New Link",
        url: type === "divider" || type === "text" ? "" : "https://example.com",
        type,
        description: type === "text" ? "Add supporting text here." : null,
      });
      sync([...links, data.link]);
      setEditing(data.link);
      setOpen(true);
      toast.success("Link added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  async function saveEdit() {
    if (!editing) return;
    try {
      const data = await api({ action: "update_link", ...editing });
      sync(links.map((l) => (l.id === data.link.id ? data.link : l)));
      setOpen(false);
      toast.success("Link updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  async function toggle(id: string, is_active: boolean) {
    sync(links.map((l) => (l.id === id ? { ...l, is_active } : l)));
    try {
      await api({ action: "update_link", id, is_active });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  async function remove(id: string) {
    sync(links.filter((l) => l.id !== id));
    try {
      await api({ action: "delete_link", id });
      toast.success("Link deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  async function duplicate(id: string) {
    try {
      const data = await api({ action: "duplicate_link", id });
      sync([...links, data.link]);
      toast.success("Link duplicated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Links</h1>
          <p className="text-sm text-muted-foreground">
            Add, reorder, and refine everything on your page.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => createLink("featured")}>
            Featured
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={() => createLink("divider")}>
            Divider
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={() => createLink("text")}>
            Text
          </Button>
          <Button
            className="rounded-xl bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-400 dark:text-teal-950"
            onClick={() => createLink("standard")}
          >
            <Plus className="h-4 w-4" /> Add Link
          </Button>
        </div>
      </div>

      {links.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border px-6 py-16 text-center">
          <h3 className="text-lg font-semibold">No links yet.</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first link and start building your QubeLinx.
          </p>
          <Button
            className="mt-5 rounded-xl bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-400 dark:text-teal-950"
            onClick={() => createLink("standard")}
          >
            Add Your First Link
          </Button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {links.map((link) => (
                <SortableLink
                  key={link.id}
                  link={link}
                  onToggle={toggle}
                  onEdit={(l) => {
                    setEditing(l);
                    setOpen(true);
                  }}
                  onDelete={remove}
                  onDuplicate={duplicate}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit link</SheetTitle>
            <SheetDescription>
              Changes appear instantly in your live preview.
            </SheetDescription>
          </SheetHeader>
          {editing ? (
            <div className="mt-6 space-y-4 px-1">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={editing.type}
                  onValueChange={(value) =>
                    setEditing({ ...editing, type: value as LinkType })
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Link</SelectItem>
                    <SelectItem value="featured">Featured Link</SelectItem>
                    <SelectItem value="divider">Divider</SelectItem>
                    <SelectItem value="text">Text Block</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  className="rounded-xl"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>
              {editing.type !== "divider" && editing.type !== "text" ? (
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input
                    className="rounded-xl"
                    value={editing.url}
                    onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                  />
                </div>
              ) : null}
              {(editing.type === "featured" || editing.type === "text") && (
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editing.description || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, description: e.target.value })
                    }
                  />
                </div>
              )}
              {editing.type === "featured" ? (
                <div className="space-y-2">
                  <Label>Thumbnail URL</Label>
                  <Input
                    className="rounded-xl"
                    value={editing.thumbnail || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, thumbnail: e.target.value })
                    }
                  />
                </div>
              ) : null}
              <Button
                className="w-full rounded-xl bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-400 dark:text-teal-950"
                onClick={saveEdit}
              >
                Save changes
              </Button>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
