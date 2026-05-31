'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Archive, CalendarDays, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { ScheduleCard } from '@/components/schedule/schedule-card';
import { ScheduleForm } from '@/components/schedule/schedule-form';
import { Button } from '@/components/ui/button';
import { useLocalSchedules } from '@/hooks/use-local-schedules';
import type { Schedule } from '@/types';
import { cn } from '@/lib/utils';

export default function SchedulesPage() {
  const { schedules, hydrated, createSchedule, updateSchedule, deleteSchedule } =
    useLocalSchedules();
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Schedule | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const active = schedules.filter((s) => !s.archived);
  const archived = schedules.filter((s) => s.archived);

  if (!hydrated) {
    return (
      <AppShell title="Schedules">
        <div className="max-w-5xl mx-auto space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded-[var(--radius-active,0.5rem)]" />
          ))}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Schedules">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            {active.length} active schedule{active.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            {archived.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowArchived((v) => !v)}
              >
                <Archive className="size-4" />
                {showArchived ? 'Hide archived' : `Archived (${archived.length})`}
              </Button>
            )}
            <Button size="sm" onClick={() => setShowCreate(true)}>
              <Plus className="size-4" />
              New schedule
            </Button>
          </div>
        </div>

        {/* Active schedules */}
        {active.length === 0 ? (
          <div className="border-2 border-dashed border-border rounded-[var(--radius-active,0.5rem)] p-16 flex flex-col items-center gap-4 text-center">
            <CalendarDays className="size-12 text-primary/30" aria-hidden="true" />
            <div>
              <p className="font-semibold text-foreground">No schedules yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first schedule to get started.
              </p>
            </div>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="size-4" />
              Create first schedule
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {active.map((s) => (
              <ScheduleCard
                key={s.id}
                schedule={s}
                onArchive={(id) => updateSchedule(id, { archived: true })}
                onDelete={deleteSchedule}
                onEdit={setEditTarget}
              />
            ))}
          </div>
        )}

        {/* Archived schedules */}
        {showArchived && archived.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground border-t border-border pt-4">
              Archived
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-75">
              {archived.map((s) => (
                <ScheduleCard
                  key={s.id}
                  schedule={s}
                  onArchive={(id) => updateSchedule(id, { archived: false })}
                  onDelete={deleteSchedule}
                  onEdit={setEditTarget}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create dialog */}
      <Dialog.Root open={showCreate} onOpenChange={setShowCreate}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            className={cn(
              'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md',
              'bg-card border border-border shadow-xl rounded-[var(--radius-active,0.5rem)] p-6',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
            )}
          >
            <div className="flex items-center justify-between mb-5">
              <Dialog.Title className="text-lg font-semibold text-foreground">
                New schedule
              </Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" aria-label="Close">
                  <X className="size-4" />
                </Button>
              </Dialog.Close>
            </div>
            <ScheduleForm
              onSubmit={(values) => {
                createSchedule(values);
                setShowCreate(false);
              }}
              onCancel={() => setShowCreate(false)}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Edit dialog */}
      <Dialog.Root open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            className={cn(
              'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md',
              'bg-card border border-border shadow-xl rounded-[var(--radius-active,0.5rem)] p-6',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
            )}
          >
            <div className="flex items-center justify-between mb-5">
              <Dialog.Title className="text-lg font-semibold text-foreground">
                Edit schedule
              </Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" aria-label="Close">
                  <X className="size-4" />
                </Button>
              </Dialog.Close>
            </div>
            {editTarget && (
              <ScheduleForm
                defaultValues={editTarget}
                onSubmit={(values) => {
                  updateSchedule(editTarget.id, values);
                  setEditTarget(null);
                }}
                onCancel={() => setEditTarget(null)}
                submitLabel="Save changes"
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </AppShell>
  );
}
