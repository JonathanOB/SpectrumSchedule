'use client';

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { ScheduleItem } from '@/types';
import { cn, formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { IconPicker } from './icon-picker';
import { TaskItemForm } from './task-item-form';

// ─── Sortable item ─────────────────────────────────────────────────────────

interface SortableTaskProps {
  item: ScheduleItem;
  onEdit: (item: ScheduleItem) => void;
  onDelete: (id: string) => void;
}

function SortableTask({ item, onEdit, onDelete }: SortableTaskProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 p-3 bg-card border border-border',
        'rounded-[var(--radius-active,0.5rem)] group',
        isDragging ? 'shadow-lg opacity-80 z-50' : 'shadow-none'
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-0.5 rounded"
        aria-label={`Drag to reorder ${item.title}`}
      >
        <GripVertical className="size-4 shrink-0" aria-hidden="true" />
      </button>

      {/* Icon */}
      <span className="text-xl shrink-0 w-8 text-center" aria-hidden="true">
        {item.icon ?? '📋'}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground text-sm truncate">{item.title}</p>
        {(item.startTime || item.description) && (
          <p className="text-xs text-muted-foreground truncate">
            {item.startTime && item.endTime
              ? `${formatTime(item.startTime)} – ${formatTime(item.endTime)}`
              : item.startTime
              ? formatTime(item.startTime)
              : item.description}
          </p>
        )}
      </div>

      {/* Actions (visible on hover) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => onEdit(item)}
          aria-label={`Edit ${item.title}`}
        >
          <Pencil className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(item.id)}
          aria-label={`Delete ${item.title}`}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ─── Builder ──────────────────────────────────────────────────────────────

interface ScheduleBuilderProps {
  items: ScheduleItem[];
  scheduleId: string;
  onAddItem: (data: Omit<ScheduleItem, 'id' | 'scheduleId' | 'completed' | 'sortOrder'>) => void;
  onUpdateItem: (itemId: string, data: Partial<ScheduleItem>) => void;
  onDeleteItem: (itemId: string) => void;
  onReorder: (orderedIds: string[]) => void;
}

export function ScheduleBuilder({
  items,
  scheduleId,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onReorder,
}: ScheduleBuilderProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    onReorder(reordered.map((i) => i.id));
  }

  const sortedItems = [...items].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-3">
      {/* Item list */}
      {sortedItems.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortedItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2" role="list" aria-label="Schedule items">
              {sortedItems.map((item) => (
                <SortableTask
                  key={item.id}
                  item={item}
                  onEdit={(i) => { setEditingItem(i); setShowForm(false); }}
                  onDelete={onDeleteItem}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Empty state */}
      {sortedItems.length === 0 && !showForm && (
        <div className="border-2 border-dashed border-border rounded-[var(--radius-active,0.5rem)] p-10 text-center">
          <p className="text-muted-foreground text-sm mb-3">No tasks yet. Add your first one!</p>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="size-4" />
            Add first task
          </Button>
        </div>
      )}

      {/* Add task form */}
      {showForm && (
        <div className="border border-primary/30 bg-card rounded-[var(--radius-active,0.5rem)] p-4">
          <p className="text-sm font-medium text-foreground mb-3">Add task</p>
          <TaskItemForm
            onSubmit={(data) => { onAddItem(data); setShowForm(false); }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Edit item form */}
      {editingItem && (
        <div className="border border-primary/30 bg-card rounded-[var(--radius-active,0.5rem)] p-4">
          <p className="text-sm font-medium text-foreground mb-3">Edit task</p>
          <TaskItemForm
            defaultValues={editingItem}
            onSubmit={(data) => {
              onUpdateItem(editingItem.id, data);
              setEditingItem(null);
            }}
            onCancel={() => setEditingItem(null)}
            submitLabel="Save changes"
          />
        </div>
      )}

      {/* Add task button (shown when there are existing items) */}
      {sortedItems.length > 0 && !showForm && !editingItem && (
        <Button
          variant="outline"
          size="sm"
          className="w-full border-dashed"
          onClick={() => setShowForm(true)}
        >
          <Plus className="size-4" />
          Add task
        </Button>
      )}
    </div>
  );
}
