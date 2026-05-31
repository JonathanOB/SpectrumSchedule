'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { ArrowLeft, CheckCircle2, ChevronDown, Copy, Pencil, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { RoutineBuilder } from '@/components/routines/routine-builder';
import { RoutineForm } from '@/components/routines/routine-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalRoutines } from '@/hooks/use-local-routines';
import { useLocalSchedules } from '@/hooks/use-local-schedules';
import { cn } from '@/lib/utils';

export default function RoutineDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { routines, hydrated, getRoutine, updateRoutine, addItem, updateItem, deleteItem, reorderItems } =
    useLocalRoutines();
  const { schedules, addItem: addToSchedule } = useLocalSchedules();
  const [showEdit, setShowEdit] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [applied, setApplied] = useState(false);

  const routine = getRoutine(params.id);

  useEffect(() => {
    if (hydrated && !routine) router.replace('/routines');
  }, [hydrated, routine, router]);

  if (!hydrated || !routine) {
    return (
      <AppShell title="Routine">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-muted animate-pulse rounded-[var(--radius-active,0.5rem)]" />
          ))}
        </div>
      </AppShell>
    );
  }

  const items = [...(routine.items ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const activeSchedules = schedules.filter((s) => !s.archived);

  function handleApply() {
    if (!selectedScheduleId) return;
    items.forEach((item) => {
      addToSchedule(selectedScheduleId, { title: item.title, icon: item.icon });
    });
    setApplied(true);
    setTimeout(() => { setShowApply(false); setApplied(false); setSelectedScheduleId(''); }, 1500);
  }

  return (
    <AppShell title={routine.title}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back + header */}
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild aria-label="Back to routines">
            <Link href="/routines"><ArrowLeft className="size-5" /></Link>
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-foreground">{routine.title}</h2>
            {routine.description && (
              <p className="text-muted-foreground mt-1">{routine.description}</p>
            )}
            <Badge variant="muted" className="mt-2 text-xs">
              {items.length} {items.length === 1 ? 'step' : 'steps'}
            </Badge>
          </div>
          <div className="flex gap-2 shrink-0">
            {activeSchedules.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setShowApply(true)}>
                <Copy className="size-4" /> Apply to schedule
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>
              <Pencil className="size-4" /> Edit
            </Button>
          </div>
        </div>

        {/* Builder */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Steps</h3>
          <RoutineBuilder
            items={items}
            onAddItem={(data) => addItem(routine.id, data)}
            onUpdateItem={(id, data) => updateItem(routine.id, id, data)}
            onDeleteItem={(id) => deleteItem(routine.id, id)}
            onReorder={(ids) => reorderItems(routine.id, ids)}
          />
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog.Root open={showEdit} onOpenChange={setShowEdit}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm" />
          <Dialog.Content
            className={cn(
              'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md',
              'bg-card border border-border shadow-xl rounded-[var(--radius-active,0.5rem)] p-6'
            )}
          >
            <div className="flex items-center justify-between mb-5">
              <Dialog.Title className="text-lg font-semibold text-foreground">Edit routine</Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" aria-label="Close"><X className="size-4" /></Button>
              </Dialog.Close>
            </div>
            <RoutineForm
              defaultValues={routine}
              submitLabel="Save changes"
              onSubmit={(v) => { updateRoutine(routine.id, v); setShowEdit(false); }}
              onCancel={() => setShowEdit(false)}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Apply to schedule dialog */}
      <Dialog.Root open={showApply} onOpenChange={(o) => { if (!o) { setShowApply(false); setApplied(false); setSelectedScheduleId(''); } }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm" />
          <Dialog.Content
            className={cn(
              'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm',
              'bg-card border border-border shadow-xl rounded-[var(--radius-active,0.5rem)] p-6'
            )}
            aria-describedby="apply-desc"
          >
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-semibold text-foreground">
                Apply to schedule
              </Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" aria-label="Close"><X className="size-4" /></Button>
              </Dialog.Close>
            </div>

            {applied ? (
              <div className="py-6 flex flex-col items-center gap-3 text-center">
                <CheckCircle2 className="size-10 text-success" aria-hidden="true" />
                <p className="font-medium text-foreground">Steps added!</p>
              </div>
            ) : (
              <>
                <p id="apply-desc" className="text-sm text-muted-foreground mb-4">
                  Choose which schedule to copy {items.length} step{items.length !== 1 ? 's' : ''} into.
                </p>

                <Select.Root value={selectedScheduleId} onValueChange={setSelectedScheduleId}>
                  <Select.Trigger
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 text-sm',
                      'bg-background border border-border rounded-[var(--radius-active,0.5rem)]',
                      'text-foreground focus-visible:outline-2 focus-visible:outline-ring'
                    )}
                    aria-label="Select schedule"
                  >
                    <Select.Value placeholder="Select a schedule…" />
                    <Select.Icon><ChevronDown className="size-4 text-muted-foreground" /></Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content
                      className="z-50 bg-white border border-slate-200 rounded-[var(--radius-active,0.5rem)] shadow-lg overflow-hidden"
                      position="popper"
                      sideOffset={4}
                    >
                      <Select.Viewport className="p-1">
                        {activeSchedules.map((s) => (
                          <Select.Item
                            key={s.id}
                            value={s.id}
                            className="flex items-center px-3 py-2 text-sm cursor-pointer rounded-sm data-[highlighted]:bg-slate-100 outline-none"
                          >
                            <Select.ItemText>{s.title}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>

                <div className="flex justify-end gap-3 mt-5">
                  <Button variant="outline" onClick={() => setShowApply(false)}>Cancel</Button>
                  <Button onClick={handleApply} disabled={!selectedScheduleId}>
                    Apply {items.length} step{items.length !== 1 ? 's' : ''}
                  </Button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </AppShell>
  );
}
