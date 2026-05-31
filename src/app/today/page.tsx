'use client';

import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  FastForward,
  SkipForward,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { ProgressWidget } from '@/components/dashboard/progress-widget';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalSchedules } from '@/hooks/use-local-schedules';
import { SCHEDULE_COLORS } from '@/lib/constants';
import { cn, formatTime, getCompletionPercentage } from '@/lib/utils';
import type { Schedule, ScheduleItem } from '@/types';
import { saveProgress } from '@/components/dashboard/weekly-progress';

// ─── Schedule picker ───────────────────────────────────────────────────────

interface SchedulePickerProps {
  schedules: Schedule[];
  selected: string | null;
  onSelect: (id: string) => void;
}

function SchedulePicker({ schedules, selected, onSelect }: SchedulePickerProps) {
  if (schedules.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
      {schedules.map((s) => {
        const color = SCHEDULE_COLORS.find((c) => c.value === s.color);
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            aria-pressed={selected === s.id}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer',
              selected === s.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
            )}
          >
            <span
              className="inline-block size-2 rounded-full mr-1.5 align-middle"
              style={{ backgroundColor: color?.text ?? '#2563eb' }}
              aria-hidden="true"
            />
            {s.title}
          </button>
        );
      })}
    </div>
  );
}

// ─── Task card ─────────────────────────────────────────────────────────────

interface TaskCardProps {
  item: ScheduleItem;
  isCurrent: boolean;
  onComplete: () => void;
  onSkip: () => void;
  onMoveLater: () => void;
}

function TaskCard({ item, isCurrent, onComplete, onSkip, onMoveLater }: TaskCardProps) {
  return (
    <article
      className={cn(
        'rounded-[var(--radius-active,0.5rem)] border p-5 transition-all',
        item.completed
          ? 'bg-muted/50 border-border opacity-70'
          : isCurrent
          ? 'bg-card border-primary shadow-md ring-1 ring-primary/20'
          : 'bg-card border-border'
      )}
      aria-label={`Task: ${item.title}${item.completed ? ', completed' : isCurrent ? ', current task' : ''}`}
    >
      <div className="flex items-start gap-4">
        {/* Emoji icon */}
        <div
          className={cn(
            'size-16 rounded-[var(--radius-active,0.5rem)] flex items-center justify-center text-3xl shrink-0',
            item.completed ? 'bg-muted' : isCurrent ? 'bg-primary/10' : 'bg-muted'
          )}
          aria-hidden="true"
        >
          {item.completed ? '✅' : item.icon ?? '📋'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {isCurrent && !item.completed && (
              <Badge variant="default" className="text-xs">Now</Badge>
            )}
            {item.completed && <Badge variant="success" className="text-xs">Done</Badge>}
          </div>
          <h3
            className={cn(
              'text-xl font-semibold',
              item.completed ? 'line-through text-muted-foreground' : 'text-foreground'
            )}
          >
            {item.title}
          </h3>
          {item.description && (
            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
          )}
          {(item.startTime || item.endTime) && (
            <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
              <Clock className="size-4" aria-hidden="true" />
              {item.startTime && item.endTime
                ? `${formatTime(item.startTime)} – ${formatTime(item.endTime)}`
                : item.startTime
                ? formatTime(item.startTime)
                : ''}
            </div>
          )}
        </div>
      </div>

      {/* Actions — only for incomplete tasks */}
      {!item.completed && (
        <div className="flex gap-2 mt-4 flex-wrap">
          <Button
            size="lg"
            onClick={onComplete}
            className="flex-1 sm:flex-none"
            aria-label={`Mark ${item.title} as complete`}
          >
            <CheckCircle2 className="size-5" />
            Done
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onSkip}
            aria-label={`Skip ${item.title}`}
            title="Skip this task"
          >
            <SkipForward className="size-5" />
            Skip
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={onMoveLater}
            aria-label={`Move ${item.title} to later`}
            title="Move to end of list"
          >
            <FastForward className="size-5" />
            Later
          </Button>
        </div>
      )}
    </article>
  );
}

// ─── Timeline strip ────────────────────────────────────────────────────────

interface TimelineStripProps {
  items: ScheduleItem[];
  currentIndex: number;
}

function TimelineStrip({ items, currentIndex }: TimelineStripProps) {
  if (items.length === 0) return null;
  return (
    <div
      className="flex items-center gap-1 overflow-x-auto pb-2 no-scrollbar"
      role="list"
      aria-label="Schedule timeline"
    >
      {items.map((item, i) => (
        <div key={item.id} className="flex items-center gap-1 shrink-0" role="listitem">
          <div
            className={cn(
              'size-8 rounded-full flex items-center justify-center text-sm border-2 transition-all',
              item.completed
                ? 'bg-success/20 border-success text-success'
                : i === currentIndex
                ? 'bg-primary border-primary text-primary-foreground scale-110'
                : 'bg-muted border-border text-muted-foreground'
            )}
            aria-label={`${item.title}${item.completed ? ' — completed' : i === currentIndex ? ' — current' : ''}`}
          >
            {item.completed ? '✓' : item.icon ?? `${i + 1}`}
          </div>
          {i < items.length - 1 && (
            <div
              className={cn(
                'h-0.5 w-6',
                item.completed ? 'bg-success' : 'bg-border'
              )}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function TodayPage() {
  const { schedules, hydrated, toggleItem, updateItem } = useLocalSchedules();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [skippedIds, setSkippedIds] = useState<Set<string>>(new Set());

  const activeSchedules = schedules.filter((s) => !s.archived);

  // Auto-select first schedule on load
  useEffect(() => {
    if (hydrated && !selectedId && activeSchedules.length > 0) {
      setSelectedId(activeSchedules[0].id);
    }
  }, [hydrated, activeSchedules, selectedId]);

  const schedule = activeSchedules.find((s) => s.id === selectedId) ?? null;
  const rawItems = [...(schedule?.items ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

  // Skipped items go to end, maintaining their relative order
  const items = [
    ...rawItems.filter((i) => !skippedIds.has(i.id)),
    ...rawItems.filter((i) => skippedIds.has(i.id)),
  ];

  const currentIndex = items.findIndex((i) => !i.completed && !skippedIds.has(i.id));

  const completedCount = items.filter((i) => i.completed).length;

  // Persist daily progress so the weekly chart stays up to date
  useEffect(() => {
    if (!hydrated || items.length === 0) return;
    const pct = Math.round((completedCount / items.length) * 100);
    const dateKey = new Date().toISOString().slice(0, 10);
    saveProgress(dateKey, pct);
  }, [completedCount, items.length, hydrated]);

  function handleSkip(itemId: string) {
    setSkippedIds((prev) => new Set([...prev, itemId]));
  }

  function handleMoveLater(item: ScheduleItem) {
    const newOrder = items.filter((i) => !i.completed).length - 1;
    updateItem(selectedId!, item.id, { sortOrder: newOrder });
  }

  if (!hydrated) {
    return (
      <AppShell title="Today's Schedule">
        <div className="max-w-3xl mx-auto space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded-[var(--radius-active,0.5rem)]" />
          ))}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Today's Schedule">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* No schedules */}
        {activeSchedules.length === 0 && (
          <Card className="border-dashed border-2">
            <CardContent className="py-16 flex flex-col items-center text-center gap-4">
              <CalendarDays className="size-12 text-primary/30" aria-hidden="true" />
              <p className="font-semibold text-foreground">No schedules yet</p>
              <p className="text-sm text-muted-foreground">
                Create a schedule first, then come back here to follow it.
              </p>
              <Button asChild>
                <Link href="/schedules">Go to Schedules</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Schedule picker */}
        {activeSchedules.length > 1 && (
          <SchedulePicker
            schedules={activeSchedules}
            selected={selectedId}
            onSelect={setSelectedId}
          />
        )}

        {/* Progress */}
        {schedule && items.length > 0 && (
          <ProgressWidget
            completed={completedCount}
            total={items.length}
            label={schedule.title}
          />
        )}

        {/* Timeline strip */}
        {items.length > 0 && (
          <TimelineStrip items={items} currentIndex={currentIndex} />
        )}

        {/* All done */}
        {schedule && items.length > 0 && completedCount === items.length && (
          <Card className="bg-success/10 border-success/30">
            <CardContent className="py-8 text-center">
              <p className="text-4xl mb-3" aria-hidden="true">🎉</p>
              <p className="text-xl font-bold text-foreground">All done!</p>
              <p className="text-muted-foreground mt-1">
                You completed all {items.length} tasks. Well done!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Task cards */}
        {items.length > 0 && completedCount < items.length && (
          <div className="space-y-3">
            {items.map((item, i) => (
              <TaskCard
                key={item.id}
                item={item}
                isCurrent={i === currentIndex}
                onComplete={() => toggleItem(selectedId!, item.id)}
                onSkip={() => handleSkip(item.id)}
                onMoveLater={() => handleMoveLater(item)}
              />
            ))}
          </div>
        )}

        {/* Completed items section */}
        {schedule && completedCount > 0 && completedCount < items.length && (
          <details className="group">
            <summary className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors list-none py-2">
              <ChevronRight className="size-4 transition-transform group-open:rotate-90" aria-hidden="true" />
              {completedCount} completed task{completedCount !== 1 ? 's' : ''}
            </summary>
            <div className="space-y-2 mt-2">
              {items
                .filter((i) => i.completed)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-muted/50 border border-border rounded-[var(--radius-active,0.5rem)] opacity-60"
                  >
                    <span className="text-xl" aria-hidden="true">{item.icon ?? '📋'}</span>
                    <span className="text-sm line-through text-muted-foreground flex-1">
                      {item.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleItem(selectedId!, item.id)}
                      aria-label={`Undo completion of ${item.title}`}
                    >
                      Undo
                    </Button>
                  </div>
                ))}
            </div>
          </details>
        )}
      </div>
    </AppShell>
  );
}
