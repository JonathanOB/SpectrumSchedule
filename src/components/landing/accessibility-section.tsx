'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const THEMES = [
  { id: 'calm-blue', label: 'Calm Blue', bg: '#f0f4f8', primary: '#2563eb', text: '#0f172a' },
  { id: 'soft-green', label: 'Soft Green', bg: '#f0fdf4', primary: '#16a34a', text: '#052e16' },
  { id: 'warm-beige', label: 'Warm Beige', bg: '#fdf8f0', primary: '#c2410c', text: '#1c1917' },
  { id: 'lavender', label: 'Lavender', bg: '#f5f3ff', primary: '#7c3aed', text: '#1e0b3e' },
  {
    id: 'dark',
    label: 'Dark Mode',
    bg: '#0f172a',
    primary: '#6366f1',
    text: '#f1f5f9',
  },
  {
    id: 'high-contrast',
    label: 'High Contrast',
    bg: '#000000',
    primary: '#ffff00',
    text: '#ffffff',
  },
] as const;

const FONTS = [
  { id: 'inter', label: 'Inter', style: 'Inter, sans-serif', note: 'Clean & modern' },
  {
    id: 'atkinson',
    label: 'Atkinson Hyperlegible',
    style: 'system-ui, sans-serif',
    note: 'Low vision friendly',
  },
  {
    id: 'lexend',
    label: 'Lexend',
    style: 'system-ui, sans-serif',
    note: 'Reduces visual stress',
  },
  {
    id: 'opendyslexic',
    label: 'OpenDyslexic',
    style: 'serif',
    note: 'Dyslexia friendly',
  },
];

const A11Y_FEATURES = [
  'Full keyboard navigation',
  'Screen reader support (ARIA)',
  'Semantic HTML throughout',
  'Visible focus indicators',
  'Adjustable motion / no animation',
  'High contrast mode',
  'Large touch targets (min 44×44px)',
  'Printable schedule views',
];

export function AccessibilitySection() {
  const [activeTheme, setActiveTheme] = useState<(typeof THEMES)[number]>(THEMES[0]);
  const [activeFont, setActiveFont] = useState(FONTS[0]);

  return (
    <section
      id="accessibility"
      className="py-20 md:py-28 bg-muted/50"
      aria-labelledby="a11y-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="a11y-heading"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Accessibility isn't an add-on — it's the foundation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every aspect of the interface adapts to your needs. Try the live preview below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Controls */}
          <div className="space-y-8">
            {/* Theme picker */}
            <fieldset>
              <legend className="text-base font-semibold text-foreground mb-3">
                Colour Theme
              </legend>
              <div className="flex flex-wrap gap-2">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setActiveTheme(theme)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-[var(--radius-active,0.5rem)]',
                      'text-sm border-2 transition-all cursor-pointer',
                      activeTheme.id === theme.id
                        ? 'border-primary bg-primary/10 font-medium'
                        : 'border-border hover:border-primary/50'
                    )}
                    aria-pressed={activeTheme.id === theme.id}
                  >
                    <span
                      className="size-4 rounded-full border border-white/20"
                      style={{ backgroundColor: theme.primary }}
                      aria-hidden="true"
                    />
                    {theme.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Font picker */}
            <fieldset>
              <legend className="text-base font-semibold text-foreground mb-3">
                Font Family
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {FONTS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setActiveFont(font)}
                    className={cn(
                      'flex flex-col items-start px-3 py-2.5 rounded-[var(--radius-active,0.5rem)]',
                      'text-sm border transition-all cursor-pointer text-left',
                      activeFont.id === font.id
                        ? 'border-2 border-primary bg-primary/10'
                        : 'border-2 border-border hover:border-primary/50'
                    )}
                    aria-pressed={activeFont.id === font.id}
                  >
                    <span className="font-medium text-foreground" style={{ fontFamily: font.style }}>
                      {font.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{font.note}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Accessibility checklist */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">
                Built-in accessibility
              </h3>
              <ul className="space-y-2">
                {A11Y_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="size-4 text-success shrink-0" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Live preview */}
          <div aria-label="Live theme preview" aria-live="polite">
            <div
              className="rounded-[var(--radius-active,0.5rem)] border shadow-lg overflow-hidden transition-all duration-300"
              style={{
                backgroundColor: activeTheme.bg,
                borderColor: activeTheme.primary + '40',
              }}
            >
              {/* Preview header */}
              <div
                className="px-5 py-4 border-b"
                style={{ borderColor: activeTheme.primary + '30' }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-bold text-base"
                    style={{ color: activeTheme.text, fontFamily: activeFont.style }}
                  >
                    My Morning Routine
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: activeTheme.primary + '20',
                      color: activeTheme.primary,
                    }}
                  >
                    3 / 5 done
                  </span>
                </div>
              </div>

              {/* Preview tasks */}
              <div className="p-4 space-y-3">
                {PREVIEW_TASKS.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg border transition-all"
                    style={{
                      backgroundColor: task.done
                        ? activeTheme.primary + '15'
                        : activeTheme.bg,
                      borderColor: task.done ? activeTheme.primary + '40' : activeTheme.primary + '20',
                    }}
                  >
                    <span className="text-xl shrink-0" aria-hidden="true">
                      {task.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium"
                        style={{
                          color: task.done ? activeTheme.primary : activeTheme.text,
                          textDecoration: task.done ? 'line-through' : 'none',
                          fontFamily: activeFont.style,
                        }}
                      >
                        {task.title}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: activeTheme.primary + 'aa', fontFamily: activeFont.style }}
                      >
                        {task.time}
                      </p>
                    </div>
                    {task.done && (
                      <Check
                        className="size-4 shrink-0"
                        style={{ color: activeTheme.primary }}
                        aria-label="Completed"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Preview footer */}
              <div
                className="px-5 py-3 border-t text-center"
                style={{ borderColor: activeTheme.primary + '30' }}
              >
                <p
                  className="text-xs"
                  style={{ color: activeTheme.primary + 'bb', fontFamily: activeFont.style }}
                >
                  Viewing as: <strong>{activeTheme.label}</strong> &bull; Font:{' '}
                  <strong>{activeFont.label}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const PREVIEW_TASKS = [
  { id: 1, emoji: '🌅', title: 'Wake up', time: '7:00 AM', done: true },
  { id: 2, emoji: '🪥', title: 'Brush teeth', time: '7:10 AM', done: true },
  { id: 3, emoji: '🍳', title: 'Breakfast', time: '7:30 AM', done: true },
  { id: 4, emoji: '💊', title: 'Medication', time: '8:00 AM', done: false },
  { id: 5, emoji: '🏫', title: 'School / Work', time: '9:00 AM', done: false },
];
