'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Plus, Repeat2, X } from 'lucide-react';
import { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { RoutineCard } from '@/components/routines/routine-card';
import { RoutineForm } from '@/components/routines/routine-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalRoutines } from '@/hooks/use-local-routines';
import { cn } from '@/lib/utils';
import type { RoutineTemplate } from '@/types';

const SUGGESTED = [
  {
    title: 'Morning Routine',
    description: 'Start the day right',
    steps: ['🌅 Wake up', '🪥 Brush teeth', '🚿 Shower', '👗 Get dressed', '🍳 Breakfast', '💊 Medication'],
  },
  {
    title: 'School Day',
    description: 'Prepare and travel to school',
    steps: ['🎒 Pack bag', '🚌 Bus / travel', '🏫 Arrive at school', '📚 Classes', '🍱 Lunch', '🏡 Home time'],
  },
  {
    title: 'Bedtime Routine',
    description: 'Wind down for sleep',
    steps: ['🛁 Bath / shower', '🪥 Brush teeth', '📖 Reading time', '💡 Lights off', '😴 Sleep'],
  },
  {
    title: 'Weekend Relax',
    description: 'A calm, flexible day',
    steps: ['🌅 Wake up slowly', '🍳 Brunch', '🎮 Free time', '🌳 Outdoor walk', '🧘 Relaxation', '😴 Early night'],
  },
];

export default function RoutinesPage() {
  const { routines, hydrated, createRoutine, updateRoutine, deleteRoutine } = useLocalRoutines();
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<RoutineTemplate | null>(null);

  if (!hydrated) {
    return (
      <AppShell title="Routines">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-[var(--radius-active,0.5rem)]" />
          ))}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Routines">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            {routines.length} routine template{routines.length !== 1 ? 's' : ''}
          </p>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="size-4" /> New routine
          </Button>
        </div>

        {/* Existing routines */}
        {routines.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {routines.map((r) => (
              <RoutineCard
                key={r.id}
                routine={r}
                onEdit={setEditTarget}
                onDelete={deleteRoutine}
              />
            ))}
          </div>
        )}

        {/* Suggested templates */}
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold text-foreground text-lg">
              {routines.length === 0 ? 'Start with a template' : 'Add from suggestions'}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              One click to create a pre-built routine — customise it however you like.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SUGGESTED.map((s) => {
              const alreadyExists = routines.some(
                (r) => r.title.toLowerCase() === s.title.toLowerCase()
              );
              return (
                <Card key={s.title} className={cn('border-border', alreadyExists && 'opacity-50')}>
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{s.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {s.steps.map((step) => {
                        const [emoji, ...rest] = step.split(' ');
                        return (
                          <span
                            key={step}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs text-foreground"
                          >
                            <span aria-hidden="true">{emoji}</span>
                            {rest.join(' ')}
                          </span>
                        );
                      })}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={alreadyExists}
                      onClick={() => {
                        const routine = createRoutine({ title: s.title, description: s.description });
                        // Routines page doesn't add items directly — user opens detail to edit
                      }}
                    >
                      {alreadyExists ? 'Already added' : 'Use this template'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Empty state */}
        {routines.length === 0 && (
          <div className="border-2 border-dashed border-border rounded-[var(--radius-active,0.5rem)] p-12 flex flex-col items-center text-center gap-4">
            <Repeat2 className="size-12 text-primary/30" aria-hidden="true" />
            <div>
              <p className="font-semibold text-foreground">No routines yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create one from scratch or use a template above.
              </p>
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
              'bg-card border border-border shadow-xl rounded-[var(--radius-active,0.5rem)] p-6'
            )}
          >
            <div className="flex items-center justify-between mb-5">
              <Dialog.Title className="text-lg font-semibold text-foreground">New routine</Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" aria-label="Close"><X className="size-4" /></Button>
              </Dialog.Close>
            </div>
            <RoutineForm
              onSubmit={(v) => { createRoutine(v); setShowCreate(false); }}
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
              'bg-card border border-border shadow-xl rounded-[var(--radius-active,0.5rem)] p-6'
            )}
          >
            <div className="flex items-center justify-between mb-5">
              <Dialog.Title className="text-lg font-semibold text-foreground">Edit routine</Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" aria-label="Close"><X className="size-4" /></Button>
              </Dialog.Close>
            </div>
            {editTarget && (
              <RoutineForm
                defaultValues={editTarget}
                submitLabel="Save changes"
                onSubmit={(v) => { updateRoutine(editTarget.id, v); setEditTarget(null); }}
                onCancel={() => setEditTarget(null)}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </AppShell>
  );
}
