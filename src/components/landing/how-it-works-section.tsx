import { CalendarPlus, CheckCircle2, Repeat, Settings2 } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: Settings2,
    title: 'Set your preferences',
    description:
      'Pick your colour theme, font, and text size. Set your motion preference. Spectrum Schedule remembers everything.',
  },
  {
    step: '02',
    icon: CalendarPlus,
    title: 'Build your first schedule',
    description:
      'Add tasks with icons and times. Drag to reorder. Give each schedule a colour so you can spot it at a glance.',
  },
  {
    step: '03',
    icon: Repeat,
    title: 'Save routines as templates',
    description:
      'Turn a schedule into a reusable template — Morning Routine, School Day, Relaxation Day. Apply in one tap.',
  },
  {
    step: '04',
    icon: CheckCircle2,
    title: 'Follow your day with ease',
    description:
      "Open Today's View. See large, calm task cards. Mark things done, skip what you need, and track your progress.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28"
      aria-labelledby="how-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="how-heading"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Simple enough for anyone
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get from zero to a working routine in under five minutes.
          </p>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 list-none">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === STEPS.length - 1;
            return (
              <li key={step.step} className="relative flex flex-col gap-4">
                {/* Connector line (desktop) */}
                {!isLast && (
                  <div
                    className="hidden lg:block absolute top-7 left-[calc(50%+2.5rem)] right-0 h-px bg-border"
                    aria-hidden="true"
                  />
                )}
                <div className="flex flex-col gap-3">
                  {/* Step icon */}
                  <div className="flex items-center gap-3">
                    <div className="size-14 rounded-[var(--radius-active,0.5rem)] bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="size-7 text-primary" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground">{step.step}</span>
                  </div>
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
