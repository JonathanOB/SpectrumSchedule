import { CalendarDays, Clock, Lock } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import { formatTime } from '@/lib/utils';
import type { Schedule, ScheduleItem } from '@/types';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Shared Schedule | Spectrum Schedule',
  robots: { index: false },
};

async function getSharedSchedule(token: string): Promise<Schedule | null> {
  const db = createServerClient();
  const { data: link } = await db
    .from('share_links')
    .select('schedule_id, expires_at')
    .eq('token', token)
    .single();

  if (!link) return null;
  if (link.expires_at && new Date(link.expires_at) < new Date()) return null;

  const { data } = await db
    .from('schedules')
    .select('*, schedule_items(*)')
    .eq('id', link.schedule_id)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    userId: data.clerk_user_id,
    title: data.title,
    description: data.description ?? undefined,
    color: data.color,
    archived: data.archived,
    createdAt: data.created_at,
    items: ((data.schedule_items as Record<string, unknown>[]) ?? [])
      .map((i) => ({
        id: i.id as string,
        scheduleId: i.schedule_id as string,
        title: i.title as string,
        description: (i.description as string) ?? undefined,
        icon: (i.icon as string) ?? undefined,
        startTime: (i.start_time as string) ?? undefined,
        endTime: (i.end_time as string) ?? undefined,
        completed: i.completed as boolean,
        sortOrder: i.sort_order as number,
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const schedule = await getSharedSchedule(token);

  if (!schedule) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <Lock className="size-12 text-muted-foreground mx-auto" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-foreground">Link not found</h1>
          <p className="text-muted-foreground">
            This shared schedule link is invalid or has expired.
          </p>
          <Link
            href="/"
            className="inline-block text-sm text-primary hover:underline"
          >
            ← Back to Spectrum Schedule
          </Link>
        </div>
      </div>
    );
  }

  const items = schedule.items ?? [];
  const completed = items.filter((i) => i.completed).length;
  const pct = items.length > 0 ? Math.round((completed / items.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-bold text-foreground hover:text-primary transition-colors"
          >
            Spectrum Schedule
          </Link>
          <Badge variant="outline" className="text-xs gap-1.5">
            <Lock className="size-3" aria-hidden="true" />
            Read-only view
          </Badge>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6" id="main-content">
        {/* Schedule header */}
        <div>
          <div className="flex items-start gap-3">
            <CalendarDays className="size-6 text-primary mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">{schedule.title}</h1>
              {schedule.description && (
                <p className="text-muted-foreground mt-1">{schedule.description}</p>
              )}
            </div>
          </div>

          {/* Progress */}
          {items.length > 0 && (
            <div className="mt-4 p-4 bg-card border border-border rounded-[var(--radius-active,0.5rem)]">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{completed} / {items.length} done</span>
              </div>
              <div
                className="h-2 bg-muted rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${pct}% complete`}
              >
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Task list */}
        {items.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No tasks in this schedule.</p>
        ) : (
          <div className="space-y-3" role="list" aria-label="Schedule tasks">
            {items.map((item: ScheduleItem) => (
              <div
                key={item.id}
                role="listitem"
                className={`flex items-start gap-4 p-4 rounded-[var(--radius-active,0.5rem)] border transition-colors ${
                  item.completed
                    ? 'bg-success/5 border-success/30 opacity-75'
                    : 'bg-card border-border'
                }`}
              >
                <span className="text-2xl shrink-0 mt-0.5" aria-hidden="true">
                  {item.completed ? '✅' : (item.icon ?? '📋')}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium ${
                      item.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                    }`}
                  >
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
                  )}
                  {(item.startTime || item.endTime) && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-sm text-muted-foreground">
                      <Clock className="size-3.5" aria-hidden="true" />
                      {item.startTime && item.endTime
                        ? `${formatTime(item.startTime)} – ${formatTime(item.endTime)}`
                        : item.startTime
                        ? formatTime(item.startTime)
                        : ''}
                    </div>
                  )}
                </div>
                {item.completed && (
                  <Badge variant="success" className="shrink-0 mt-0.5">Done</Badge>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer note */}
        <p className="text-xs text-muted-foreground text-center pt-4 border-t border-border">
          This is a read-only view shared via Spectrum Schedule.{' '}
          <Link href="/" className="text-primary hover:underline">
            Create your own account →
          </Link>
        </p>
      </main>
    </div>
  );
}
