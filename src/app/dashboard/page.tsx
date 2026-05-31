import { auth, currentUser } from '@clerk/nextjs/server';
import { ArrowRight, CalendarCheck2, CalendarDays, Plus, Repeat2 } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/app-shell';
import { ProgressWidget } from '@/components/dashboard/progress-widget';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSchedules } from '@/actions/schedule-actions';
import { getRoutines } from '@/actions/routine-actions';
import { getCompletionPercentage } from '@/lib/utils';
import { WeeklyProgress } from '@/components/dashboard/weekly-progress';
import type { Schedule } from '@/types';

export const metadata: Metadata = { title: 'Dashboard' };

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const QUICK_ACTIONS = [
  { icon: CalendarDays, label: 'New Schedule', href: '/schedules', description: 'Create a new schedule', color: 'text-primary', bg: 'bg-primary/10' },
  { icon: Repeat2, label: 'New Routine', href: '/routines', description: 'Save a reusable routine', color: 'text-accent', bg: 'bg-accent/10' },
  { icon: CalendarCheck2, label: "Today's View", href: '/today', description: "Follow today's schedule", color: 'text-success', bg: 'bg-success/10' },
];

const SUGGESTED_ROUTINES = [
  { name: 'Morning Routine', emoji: '🌅', tasks: 6 },
  { name: 'School Day', emoji: '🏫', tasks: 8 },
  { name: 'Bedtime Routine', emoji: '😴', tasks: 5 },
];

async function fetchDashboardData(isAuthenticated: boolean) {
  if (!isAuthenticated) return { schedules: [], routines: [] };
  try {
    const [schedules, routines] = await Promise.all([getSchedules(), getRoutines()]);
    return { schedules, routines };
  } catch {
    return { schedules: [], routines: [] };
  }
}

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const { schedules, routines } = await fetchDashboardData(!!userId);

  const firstName = user?.firstName ?? 'there';
  const greeting = getGreeting();

  const activeSchedules = schedules.filter((s) => !s.archived);
  const todaySchedule: Schedule | undefined = activeSchedules[0];
  const todayItems = todaySchedule?.items ?? [];
  const completedToday = todayItems.filter((i) => i.completed).length;

  return (
    <AppShell title="Dashboard">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Greeting */}
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {greeting}, {firstName}! 👋
          </h2>
          <p className="text-muted-foreground mt-1">
            {activeSchedules.length > 0
              ? `You have ${activeSchedules.length} active schedule${activeSchedules.length !== 1 ? 's' : ''}.`
              : "Let's build your first schedule."}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {todayItems.length > 0 ? (
            <ProgressWidget completed={completedToday} total={todayItems.length} label="Today's progress" />
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-muted-foreground">Today's progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-foreground">—</p>
                <p className="text-sm text-muted-foreground mt-1">No tasks scheduled</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-muted-foreground">Schedules</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-foreground">{activeSchedules.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Active schedules</p>
              <Button variant="link" size="sm" asChild className="px-0 mt-2 h-auto">
                <Link href="/schedules">
                  {activeSchedules.length === 0 ? 'Create first' : 'View all'} <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-muted-foreground">Routines</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-foreground">{routines.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Saved templates</p>
              <Button variant="link" size="sm" asChild className="px-0 mt-2 h-auto">
                <Link href="/routines">
                  {routines.length === 0 ? 'Create first' : 'View all'} <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <WeeklyProgress />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's tasks */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-lg">
                {todaySchedule ? todaySchedule.title : "Today's tasks"}
              </h3>
              <Button variant="outline" size="sm" asChild>
                <Link href="/today">See all <ArrowRight className="size-4" /></Link>
              </Button>
            </div>

            {todayItems.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="py-10 flex flex-col items-center text-center gap-3">
                  <CalendarDays className="size-10 text-primary/30" aria-hidden="true" />
                  <p className="font-medium text-foreground">No tasks for today</p>
                  <p className="text-sm text-muted-foreground">
                    Create a schedule and add tasks to get started.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/schedules"><Plus className="size-4" /> Create schedule</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {todayItems.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-4 p-4 rounded-[var(--radius-active,0.5rem)] border transition-colors ${
                      task.completed
                        ? 'bg-muted/50 border-border opacity-70'
                        : 'bg-card border-border'
                    }`}
                  >
                    <span className="text-2xl shrink-0" aria-hidden="true">{task.icon ?? '📋'}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.title}
                      </p>
                      {task.startTime && (
                        <p className="text-sm text-muted-foreground">{task.startTime}</p>
                      )}
                    </div>
                    {task.completed ? (
                      <Badge variant="success">Done</Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </div>
                ))}
                {todayItems.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center pt-1">
                    +{todayItems.length - 5} more tasks
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-lg">Quick actions</h3>
            <div className="space-y-3">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 p-4 rounded-[var(--radius-active,0.5rem)] border border-border bg-card hover:border-primary/40 hover:bg-muted/30 transition-colors group"
                  >
                    <div className={`size-10 rounded-[calc(var(--radius-active,0.5rem)*0.75)] ${action.bg} flex items-center justify-center shrink-0`} aria-hidden="true">
                      <Icon className={`size-5 ${action.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                    <Plus className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>

            {/* Suggested routines */}
            {routines.length === 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Suggested routines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 pb-4">
                  {SUGGESTED_ROUTINES.map((r) => (
                    <Link
                      key={r.name}
                      href="/routines"
                      className="flex items-center gap-3 p-2.5 rounded-[calc(var(--radius-active,0.5rem)*0.75)] hover:bg-muted transition-colors"
                    >
                      <span className="text-xl" aria-hidden="true">{r.emoji}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.tasks} steps</p>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Active schedule cards */}
            {activeSchedules.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Your schedules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pb-4">
                  {activeSchedules.slice(0, 3).map((s) => (
                    <Link
                      key={s.id}
                      href={`/schedules/${s.id}`}
                      className="flex items-center justify-between p-2.5 rounded-[calc(var(--radius-active,0.5rem)*0.75)] hover:bg-muted transition-colors group"
                    >
                      <p className="text-sm font-medium text-foreground truncate">{s.title}</p>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {getCompletionPercentage(s.items ?? [])}%
                      </span>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
