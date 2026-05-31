'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Archive, CalendarDays, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { Schedule } from '@/types';
import { getCompletionPercentage } from '@/lib/utils';
import { SCHEDULE_COLORS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ScheduleCardProps {
  schedule: Schedule;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (schedule: Schedule) => void;
}

export function ScheduleCard({ schedule, onArchive, onDelete, onEdit }: ScheduleCardProps) {
  const items = schedule.items ?? [];
  const pct = getCompletionPercentage(items);
  const colorDef = SCHEDULE_COLORS.find((c) => c.value === schedule.color);

  return (
    <article
      className="bg-card border border-border rounded-[var(--radius-active,0.5rem)] overflow-hidden hover:border-primary/30 transition-colors group"
      aria-label={`Schedule: ${schedule.title}`}
    >
      {/* Color accent bar */}
      <div
        className="h-2"
        style={{ backgroundColor: colorDef?.text ?? '#2563eb' }}
        aria-hidden="true"
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{schedule.title}</h3>
            {schedule.description && (
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {schedule.description}
              </p>
            )}
          </div>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                aria-label={`Actions for ${schedule.title}`}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className={cn(
                  'z-50 min-w-[160px] bg-card border border-border shadow-lg',
                  'rounded-[var(--radius-active,0.5rem)] p-1',
                  'data-[state=open]:animate-in data-[state=closed]:animate-out',
                  'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
                )}
                align="end"
                sideOffset={4}
              >
                <DropdownMenu.Item
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-sm hover:bg-muted outline-none"
                  onSelect={() => onEdit(schedule)}
                >
                  <Pencil className="size-4 text-muted-foreground" />
                  Edit details
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-sm hover:bg-muted outline-none"
                  onSelect={() => onArchive(schedule.id)}
                >
                  <Archive className="size-4 text-muted-foreground" />
                  {schedule.archived ? 'Unarchive' : 'Archive'}
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-border" />
                <DropdownMenu.Item
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-sm hover:bg-destructive/10 text-destructive outline-none"
                  onSelect={() => onDelete(schedule.id)}
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="muted" className="text-xs">
            <CalendarDays className="size-3" aria-hidden="true" />
            {items.length} {items.length === 1 ? 'task' : 'tasks'}
          </Badge>
          {schedule.archived && <Badge variant="outline">Archived</Badge>}
        </div>

        {/* Progress bar */}
        {items.length > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{pct}%</span>
            </div>
            <div
              className="h-1.5 bg-muted rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {/* Open button */}
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/schedules/${schedule.id}`}>Open schedule</Link>
        </Button>
      </div>
    </article>
  );
}
