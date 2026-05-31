'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, Pencil, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { ScheduleBuilder } from '@/components/schedule/schedule-builder';
import { ScheduleForm } from '@/components/schedule/schedule-form';
import { ShareButton, PrintButton } from '@/components/schedule/share-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalSchedules } from '@/hooks/use-local-schedules';
import { SCHEDULE_COLORS } from '@/lib/constants';
import { cn, getCompletionPercentage } from '@/lib/utils';

export default function ScheduleDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { hydrated, getSchedule, updateSchedule, addItem, updateItem, deleteItem, reorderItems } =
    useLocalSchedules();
  const [showEdit, setShowEdit] = useState(false);

  const schedule = getSchedule(params.id);

  useEffect(() => {
    if (hydrated && !schedule) {
      router.replace('/schedules');
    }
  }, [hydrated, schedule, router]);

  if (!hydrated || !schedule) {
    return (
      <AppShell title="Schedule">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-32 bg-muted animate-pulse rounded-[var(--radius-active,0.5rem)]" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-[var(--radius-active,0.5rem)]" />
          ))}
        </div>
      </AppShell>
    );
  }

  const items = schedule.items ?? [];
  const pct = getCompletionPercentage(items);
  const colorDef = SCHEDULE_COLORS.find((c) => c.value === schedule.color);

  return (
    <AppShell title={schedule.title}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back + header */}
        <div className="flex items-start gap-3 flex-wrap">
          <Button variant="ghost" size="icon" asChild aria-label="Back to schedules">
            <Link href="/schedules">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold text-foreground">{schedule.title}</h2>
              <div
                className="size-3 rounded-full shrink-0"
                style={{ backgroundColor: colorDef?.text ?? '#2563eb' }}
                aria-hidden="true"
              />
              {schedule.archived && <Badge variant="outline">Archived</Badge>}
            </div>
            {schedule.description && (
              <p className="text-muted-foreground mt-1">{schedule.description}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <PrintButton scheduleId={schedule.id} />
            <ShareButton scheduleId={schedule.id} />
            <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>
              <Pencil className="size-4" />
              Edit
            </Button>
          </div>
        </div>

        {/* Progress summary */}
        {items.length > 0 && (
          <Card>
            <CardContent className="py-4 px-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {items.filter((i) => i.completed).length} / {items.length} completed
                </span>
              </div>
              <div
                className="h-2 bg-muted rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Builder */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Tasks</h3>
          <ScheduleBuilder
            items={items}
            scheduleId={schedule.id}
            onAddItem={(data) => addItem(schedule.id, data)}
            onUpdateItem={(itemId, data) => updateItem(schedule.id, itemId, data)}
            onDeleteItem={(itemId) => deleteItem(schedule.id, itemId)}
            onReorder={(ids) => reorderItems(schedule.id, ids)}
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
              <Dialog.Title className="text-lg font-semibold text-foreground">
                Edit schedule
              </Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" aria-label="Close">
                  <X className="size-4" />
                </Button>
              </Dialog.Close>
            </div>
            <ScheduleForm
              defaultValues={schedule}
              onSubmit={(values) => {
                updateSchedule(schedule.id, values);
                setShowEdit(false);
              }}
              onCancel={() => setShowEdit(false)}
              submitLabel="Save changes"
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </AppShell>
  );
}
