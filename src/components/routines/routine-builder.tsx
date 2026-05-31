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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { RoutineItem } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { IconPicker } from '@/components/schedule/icon-picker';

// ─── Step form ─────────────────────────────────────────────────────────────

const stepSchema = z.object({
  title: z.string().min(1, 'Title is required').max(80),
  icon: z.string().optional(),
});
type StepValues = z.infer<typeof stepSchema>;

interface StepFormProps {
  defaultValues?: Partial<StepValues>;
  onSubmit: (values: StepValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}

function StepForm({ defaultValues, onSubmit, onCancel, submitLabel = 'Add step' }: StepFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<StepValues>({
    resolver: zodResolver(stepSchema),
    defaultValues: { title: defaultValues?.title ?? '', icon: defaultValues?.icon ?? '' },
  });
  const selectedIcon = watch('icon');

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      <div className="flex items-start gap-2">
        <IconPicker value={selectedIcon} onChange={(e) => setValue('icon', e)}>
          <button
            type="button"
            className={cn(
              'size-11 rounded-[var(--radius-active,0.5rem)] border border-border',
              'text-xl flex items-center justify-center shrink-0',
              'hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-ring'
            )}
            title="Choose icon"
            aria-label="Choose icon"
          >
            {selectedIcon || '📋'}
          </button>
        </IconPicker>
        <div className="flex-1 space-y-1">
          <input
            type="text"
            placeholder="Step title *"
            autoFocus
            {...register('title')}
            aria-invalid={!!errors.title}
            className={cn(
              'w-full px-3 py-2 text-sm rounded-[var(--radius-active,0.5rem)]',
              'bg-background border text-foreground placeholder:text-muted-foreground',
              'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1',
              errors.title ? 'border-destructive' : 'border-border'
            )}
          />
          {errors.title && (
            <p role="alert" className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="submit" size="sm">{submitLabel}</Button>
      </div>
    </form>
  );
}

// ─── Sortable step ─────────────────────────────────────────────────────────

interface SortableStepProps {
  item: RoutineItem;
  index: number;
  onEdit: (item: RoutineItem) => void;
  onDelete: (id: string) => void;
}

function SortableStep({ item, index, onEdit, onDelete }: SortableStepProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex items-center gap-3 p-3 bg-card border border-border',
        'rounded-[var(--radius-active,0.5rem)] group',
        isDragging && 'shadow-lg opacity-80 z-50'
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-0.5 rounded"
        aria-label={`Drag to reorder ${item.title}`}
      >
        <GripVertical className="size-4 shrink-0" aria-hidden="true" />
      </button>

      <span className="text-sm text-muted-foreground tabular-nums w-5 shrink-0">
        {index + 1}.
      </span>

      <span className="text-xl shrink-0 w-8 text-center" aria-hidden="true">
        {item.icon ?? '📋'}
      </span>

      <p className="flex-1 text-sm font-medium text-foreground truncate">{item.title}</p>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <Button
          variant="ghost" size="icon" className="size-8"
          onClick={() => onEdit(item)} aria-label={`Edit ${item.title}`}
        >
          <Pencil className="size-3.5" />
        </Button>
        <Button
          variant="ghost" size="icon"
          className="size-8 hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(item.id)} aria-label={`Delete ${item.title}`}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ─── Builder ───────────────────────────────────────────────────────────────

interface RoutineBuilderProps {
  items: RoutineItem[];
  onAddItem: (data: Pick<RoutineItem, 'title' | 'icon'>) => void;
  onUpdateItem: (itemId: string, data: Partial<RoutineItem>) => void;
  onDeleteItem: (itemId: string) => void;
  onReorder: (orderedIds: string[]) => void;
}

export function RoutineBuilder({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onReorder,
}: RoutineBuilderProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<RoutineItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((i) => i.id === active.id);
    const newIdx = items.findIndex((i) => i.id === over.id);
    onReorder(arrayMove(items, oldIdx, newIdx).map((i) => i.id));
  }

  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-3">
      {sorted.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2" role="list" aria-label="Routine steps">
              {sorted.map((item, i) => (
                <SortableStep
                  key={item.id}
                  item={item}
                  index={i}
                  onEdit={(it) => { setEditingItem(it); setShowForm(false); }}
                  onDelete={onDeleteItem}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {sorted.length === 0 && !showForm && (
        <div className="border-2 border-dashed border-border rounded-[var(--radius-active,0.5rem)] p-10 text-center">
          <p className="text-muted-foreground text-sm mb-3">No steps yet. Add your first one!</p>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="size-4" /> Add first step
          </Button>
        </div>
      )}

      {showForm && (
        <div className="border border-primary/30 bg-card rounded-[var(--radius-active,0.5rem)] p-4">
          <p className="text-sm font-medium text-foreground mb-3">Add step</p>
          <StepForm
            onSubmit={(data) => { onAddItem(data); setShowForm(false); }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {editingItem && (
        <div className="border border-primary/30 bg-card rounded-[var(--radius-active,0.5rem)] p-4">
          <p className="text-sm font-medium text-foreground mb-3">Edit step</p>
          <StepForm
            defaultValues={editingItem}
            submitLabel="Save changes"
            onSubmit={(data) => { onUpdateItem(editingItem.id, data); setEditingItem(null); }}
            onCancel={() => setEditingItem(null)}
          />
        </div>
      )}

      {sorted.length > 0 && !showForm && !editingItem && (
        <Button variant="outline" size="sm" className="w-full border-dashed" onClick={() => setShowForm(true)}>
          <Plus className="size-4" /> Add step
        </Button>
      )}
    </div>
  );
}
