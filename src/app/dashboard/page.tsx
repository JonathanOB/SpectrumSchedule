import { auth, currentUser } from '@clerk/nextjs/server';
import {
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  Plus,
  Repeat2,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/app-shell';
import { ProgressWidget } from '@/components/dashboard/progress-widget';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = { title: 'Dashboard' };

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const DEMO_TASKS = [
  { id: '1', emoji: '🌅', title: 'Wake up & stretch', time: '7:00 AM', completed: true },
  { id: '2', emoji: '🪥', title: 'Brush teeth', time: '7:15 AM', completed: true },
  { id: '3', emoji: '🍳', title: 'Breakfast', time: '7:30 AM', completed: false },
  { id: '4', emoji: '💊', title: 'Take medication', time: '8:00 AM', completed: false },
  { id: '5', emoji: '🏃', title: 'Exercise', time: '9:00 AM', completed: false },
];

const QUICK_ACTIONS = [
  {
    icon: CalendarDays,
    label: 'New Schedule',
    href: '/schedules/new',
    description: 'Create a new schedule',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Repeat2,
    label: 'New Routine',
    href: '/routines/new',
    description: 'Save a reusable routine',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: CalendarCheck2,
    label: "Today's View",
    href: '/today',
    description: "See today's full schedule",
    color: 'text-success',
    bg: 'bg-success/10',
  },
];

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;

  const firstName = user?.firstName ?? 'there';
  const completedCount = DEMO_TASKS.filter((t) => t.completed).length;
  const greeting = getGreeting();

  return (
    <AppShell title="Dashboard">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Greeting */}
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {greeting}, {firstName}! 👋
          </h2>
          <p className="text-muted-foreground mt-1">
            Here's how your day is going.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ProgressWidget
            completed={completedCount}
            total={DEMO_TASKS.length}
            label="Today's progress"
          />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-muted-foreground">
                Schedules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-foreground">0</p>
              <p className="text-sm text-muted-foreground mt-1">Active schedules</p>
              <Button variant="link" size="sm" asChild className="px-0 mt-2 h-auto">
                <Link href="/schedules">
                  Create first schedule <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-muted-foreground">
                Routines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-foreground">0</p>
              <p className="text-sm text-muted-foreground mt-1">Saved templates</p>
              <Button variant="link" size="sm" asChild className="px-0 mt-2 h-auto">
                <Link href="/routines">
                  Create first routine <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's tasks */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-lg">Today's tasks</h3>
              <Button variant="outline" size="sm" asChild>
                <Link href="/today">
                  See all <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="space-y-2">
              {DEMO_TASKS.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-4 p-4 rounded-[var(--radius-active,0.5rem)] border transition-colors ${
                    task.completed
                      ? 'bg-muted/50 border-border opacity-70'
                      : 'bg-card border-border hover:border-primary/30'
                  }`}
                >
                  <span className="text-2xl shrink-0" aria-hidden="true">
                    {task.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium truncate ${
                        task.completed
                          ? 'line-through text-muted-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{task.time}</p>
                  </div>
                  {task.completed ? (
                    <Badge variant="success">Done</Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Getting started prompt */}
            <Card className="border-dashed border-2 border-border bg-muted/30">
              <CardContent className="py-6 flex flex-col items-center text-center gap-3">
                <Sparkles className="size-8 text-primary/40" aria-hidden="true" />
                <p className="font-medium text-foreground">Connect Supabase to save real data</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Once you add your Supabase credentials, your schedules and progress will be
                  saved to the cloud.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/settings/accessibility">Customise your experience</Link>
                </Button>
              </CardContent>
            </Card>
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
                    <div
                      className={`size-10 rounded-[calc(var(--radius-active,0.5rem)*0.75)] ${action.bg} flex items-center justify-center shrink-0`}
                      aria-hidden="true"
                    >
                      <Icon className={`size-5 ${action.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                    <Plus
                      className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0"
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </div>

            {/* Routine templates card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Suggested routines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pb-4">
                {SUGGESTED_ROUTINES.map((r) => (
                  <button
                    key={r.name}
                    className="w-full flex items-center gap-3 p-2.5 rounded-[calc(var(--radius-active,0.5rem)*0.75)] hover:bg-muted transition-colors text-left cursor-pointer"
                    aria-label={`Create ${r.name} routine`}
                  >
                    <span className="text-xl" aria-hidden="true">{r.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.tasks} tasks</p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

const SUGGESTED_ROUTINES = [
  { name: 'Morning Routine', emoji: '🌅', tasks: 6 },
  { name: 'School Day', emoji: '🏫', tasks: 8 },
  { name: 'Bedtime Routine', emoji: '😴', tasks: 5 },
  { name: 'Weekend Relax', emoji: '🧘', tasks: 4 },
];
