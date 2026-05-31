'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreHorizontal, Pencil, Repeat2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { RoutineTemplate } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RoutineCardProps {
  routine: RoutineTemplate;
  onEdit: (routine: RoutineTemplate) => void;
  onDelete: (id: string) => void;
}

export function RoutineCard({ routine, onEdit, onDelete }: RoutineCardProps) {
  const items = routine.items ?? [];
  const preview = items.slice(0, 4);

  return (
    <article
      className="bg-card border border-border rounded-[var(--radius-active,0.5rem)] overflow-hidden hover:border-primary/30 transition-colors group"
      aria-label={`Routine template: ${routine.title}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{routine.title}</h3>
            {routine.description && (
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {routine.description}
              </p>
            )}
          </div>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                aria-label={`Actions for ${routine.title}`}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className={cn(
                  'z-50 min-w-[160px] bg-white text-slate-900 border border-slate-200',
                  'rounded-[var(--radius-active,0.5rem)] p-1 shadow-lg'
                )}
                align="end"
                sideOffset={4}
              >
                <DropdownMenu.Item
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-sm data-[highlighted]:bg-slate-100 outline-none"
                  onSelect={() => onEdit(routine)}
                >
                  <Pencil className="size-4 text-slate-500" />
                  Edit details
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-slate-200" />
                <DropdownMenu.Item
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-sm data-[highlighted]:bg-red-50 text-red-600 outline-none"
                  onSelect={() => onDelete(routine.id)}
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge variant="muted" className="text-xs">
            <Repeat2 className="size-3" aria-hidden="true" />
            {items.length} {items.length === 1 ? 'step' : 'steps'}
          </Badge>
        </div>

        {/* Icon preview row */}
        {preview.length > 0 && (
          <div
            className="flex items-center gap-1.5 mb-4"
            aria-label="Step preview"
          >
            {preview.map((item) => (
              <span
                key={item.id}
                className="size-8 rounded-md bg-muted flex items-center justify-center text-base"
                title={item.title}
                aria-label={item.title}
              >
                {item.icon ?? '📋'}
              </span>
            ))}
            {items.length > 4 && (
              <span className="text-xs text-muted-foreground ml-1">
                +{items.length - 4} more
              </span>
            )}
          </div>
        )}

        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/routines/${routine.id}`}>Edit routine</Link>
        </Button>
      </div>
    </article>
  );
}
