import Link from 'next/link';
import { ArrowRight, CalendarCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden py-20 md:py-28 lg:py-36"
      aria-labelledby="hero-heading"
    >
      {/* Subtle background decoration */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-8 max-w-3xl mx-auto">
          {/* Eyebrow */}
          <Badge variant="secondary" className="gap-1.5 px-4 py-1.5 text-sm">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Designed for neurodivergent minds
          </Badge>

          {/* Heading */}
          <h1
            id="hero-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight"
          >
            Schedules that{' '}
            <span className="text-primary">feel right</span>{' '}
            for you
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Spectrum Schedule is a calm, visual routine planner built for autistic adults and
            children, ADHD users, caregivers, and parents. Every detail — fonts, colours,
            spacing, motion — is yours to control.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Start for free
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>

          {/* Social proof */}
          <p className="text-sm text-muted-foreground">
            No credit card required &middot; Works offline &middot; Fully accessible
          </p>
        </div>

        {/* App preview card */}
        <div className="mt-16 md:mt-20 relative">
          <div className="bg-card border border-border rounded-[var(--radius-active,0.5rem)] shadow-xl overflow-hidden max-w-4xl mx-auto">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="size-3 rounded-full bg-destructive/60" />
                <span className="size-3 rounded-full bg-warning/60" />
                <span className="size-3 rounded-full bg-success/60" />
              </div>
              <div className="flex-1 mx-4 bg-background rounded border border-border h-6 flex items-center px-3">
                <span className="text-xs text-muted-foreground">spectrumschedule.app/today</span>
              </div>
            </div>

            {/* Mock schedule view */}
            <div className="p-6 bg-background">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Saturday, 31 May</p>
                  <h2 className="text-2xl font-bold text-foreground">Good morning! ☀️</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Today's progress</p>
                  <p className="text-2xl font-bold text-primary">3 / 8</p>
                </div>
              </div>

              {/* Mock task cards */}
              <div className="space-y-3">
                {MOCK_TASKS.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-4 p-4 rounded-[var(--radius-active,0.5rem)] border ${
                      task.completed
                        ? 'bg-success/10 border-success/30 opacity-75'
                        : 'bg-card border-border'
                    }`}
                  >
                    <span className="text-2xl shrink-0" aria-hidden="true">
                      {task.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                      >
                        {task.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{task.time}</p>
                    </div>
                    {task.completed ? (
                      <span className="text-success text-sm font-medium shrink-0">Done ✓</span>
                    ) : (
                      <span className="size-6 rounded-full border-2 border-border shrink-0" aria-hidden="true" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card border border-border shadow-lg rounded-full px-4 py-2"
            aria-hidden="true"
          >
            <CalendarCheck className="size-4 text-success" />
            <span className="text-sm font-medium text-foreground">3 tasks completed today</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const MOCK_TASKS = [
  { id: 1, emoji: '🌅', title: 'Wake up & stretch', time: '7:00 AM', completed: true },
  { id: 2, emoji: '🪥', title: 'Brush teeth', time: '7:15 AM', completed: true },
  { id: 3, emoji: '🍳', title: 'Breakfast', time: '7:30 AM', completed: true },
  { id: 4, emoji: '💊', title: 'Take medication', time: '8:00 AM', completed: false },
  { id: 5, emoji: '🏫', title: 'School / Work', time: '9:00 AM', completed: false },
];
