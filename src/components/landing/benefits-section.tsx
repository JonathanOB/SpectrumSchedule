import {
  CalendarDays,
  Layers,
  Palette,
  Share2,
  Smartphone,
  WifiOff,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const BENEFITS = [
  {
    icon: CalendarDays,
    title: 'Visual Daily Schedules',
    description:
      'Large, clear task cards with icons, times, and progress indicators. Everything you need at a glance — nothing more.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Layers,
    title: 'Reusable Routine Templates',
    description:
      'Save your Morning Routine, School Routine, or Bedtime Routine once and apply them to any day in seconds.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Palette,
    title: 'Full Accessibility Control',
    description:
      'Choose your font, colour theme, text size, spacing, and motion preference. Your schedule, your way — every time.',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: Share2,
    title: 'Caregiver Sharing',
    description:
      'Generate a read-only link for parents or support workers. They can view your schedule without editing anything.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    icon: Smartphone,
    title: 'Works on Any Device',
    description:
      'Built mobile-first with large touch targets. Use it on a phone, tablet, or computer — it adapts beautifully.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: WifiOff,
    title: 'Works Offline',
    description:
      "Your schedules are cached locally so they're always available, even without an internet connection.",
    color: 'text-muted-foreground',
    bg: 'bg-muted',
  },
];

export function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="py-20 md:py-28"
      aria-labelledby="benefits-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="benefits-heading"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Everything you need, nothing you don't
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Spectrum Schedule is designed to be predictable, calm, and genuinely helpful
            — not overwhelming.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <Card key={benefit.title} className="border-border">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div
                    className={`size-12 rounded-[var(--radius-active,0.5rem)] ${benefit.bg} flex items-center justify-center`}
                    aria-hidden="true"
                  >
                    <Icon className={`size-6 ${benefit.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
