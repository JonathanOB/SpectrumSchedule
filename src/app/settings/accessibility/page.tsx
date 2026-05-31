'use client';

import { RotateCcw } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { useAccessibility } from '@/hooks/use-accessibility';
import {
  COLOR_THEMES,
  FONT_OPTIONS,
  TEXT_SIZE_OPTIONS,
} from '@/lib/constants';
import { cn } from '@/lib/utils';
import type {
  AccessibilityPreferences,
  BorderRadius,
  LetterSpacing,
  LineHeight,
  MotionPreference,
} from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DEFAULT_PREFERENCES } from '@/providers/accessibility-provider';

// ─── Option row ────────────────────────────────────────────────────────────

interface OptionGroupProps<T extends string> {
  label: string;
  description?: string;
  options: { id: T; label: string; description?: string }[];
  value: T;
  onChange: (v: T) => void;
}

function OptionGroup<T extends string>({
  label,
  description,
  options,
  value,
  onChange,
}: OptionGroupProps<T>) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            aria-pressed={value === opt.id}
            className={cn(
              'px-3 py-2 rounded-[var(--radius-active,0.5rem)] text-sm border transition-all cursor-pointer text-left',
              value === opt.id
                ? 'border-primary bg-primary/10 text-primary font-medium ring-1 ring-primary/30'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
            )}
          >
            <span className="block">{opt.label}</span>
            {opt.description && (
              <span className="block text-xs opacity-70 mt-0.5">{opt.description}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Live preview ──────────────────────────────────────────────────────────

function LivePreview({ preferences }: { preferences: AccessibilityPreferences }) {
  const theme = COLOR_THEMES.find((t) => t.id === preferences.colorTheme);
  const font = FONT_OPTIONS.find((f) => f.id === preferences.fontFamily);
  const sizeMap: Record<string, string> = {
    small: '13px',
    medium: '15px',
    large: '17px',
    'extra-large': '19px',
  };
  const spacingMap: Record<string, string> = {
    normal: 'normal',
    relaxed: '0.03em',
    wide: '0.06em',
  };
  const lineMap: Record<string, string> = {
    normal: '1.4',
    comfortable: '1.7',
    spacious: '2',
  };
  const radiusMap: Record<string, string> = {
    sharp: '0px',
    rounded: '8px',
    soft: '16px',
  };

  const previewStyle: React.CSSProperties = {
    fontSize: sizeMap[preferences.textSize],
    letterSpacing: spacingMap[preferences.letterSpacing],
    lineHeight: lineMap[preferences.lineHeight],
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: radiusMap[preferences.borderRadius],
    borderColor: (theme?.preview ?? '#2563eb') + '40',
    backgroundColor: '#ffffff',
  };

  return (
    <div
      className="rounded-[var(--radius-active,0.5rem)] border overflow-hidden shadow"
      style={cardStyle}
      aria-label="Live accessibility preview"
      aria-live="polite"
    >
      {/* Mock header */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ backgroundColor: (theme?.preview ?? '#2563eb') + '12', borderColor: (theme?.preview ?? '#2563eb') + '30' }}
      >
        <span style={{ ...previewStyle, fontWeight: 700, color: '#0f172a', fontFamily: font?.id === 'opendyslexic' ? 'serif' : 'inherit' }}>
          Morning Routine
        </span>
        <span
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{ backgroundColor: (theme?.preview ?? '#2563eb') + '20', color: theme?.preview ?? '#2563eb', borderRadius: radiusMap[preferences.borderRadius] }}
        >
          2 / 5
        </span>
      </div>

      {/* Tasks */}
      <div className="p-3 space-y-2">
        {PREVIEW_ITEMS.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 border"
            style={{
              borderRadius: radiusMap[preferences.borderRadius],
              backgroundColor: item.done ? (theme?.preview ?? '#2563eb') + '10' : 'transparent',
              borderColor: item.done ? (theme?.preview ?? '#2563eb') + '40' : '#e2e8f0',
            }}
          >
            <span style={{ fontSize: '1.25em' }} aria-hidden="true">{item.emoji}</span>
            <div style={previewStyle}>
              <p
                style={{
                  color: item.done ? '#64748b' : '#0f172a',
                  textDecoration: item.done ? 'line-through' : 'none',
                  fontWeight: 500,
                }}
              >
                {item.title}
              </p>
              <p style={{ color: '#94a3b8', fontSize: '0.875em' }}>{item.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mock button */}
      <div className="px-3 pb-3">
        <div
          className="flex items-center justify-center py-2.5 text-sm font-medium"
          style={{
            backgroundColor: theme?.preview ?? '#2563eb',
            color: '#ffffff',
            borderRadius: radiusMap[preferences.borderRadius],
            ...previewStyle,
          }}
        >
          Mark next task done
        </div>
      </div>
    </div>
  );
}

const PREVIEW_ITEMS = [
  { id: 1, emoji: '🌅', title: 'Wake up', time: '7:00 AM', done: true },
  { id: 2, emoji: '🪥', title: 'Brush teeth', time: '7:10 AM', done: true },
  { id: 3, emoji: '🍳', title: 'Breakfast', time: '7:30 AM', done: false },
  { id: 4, emoji: '💊', title: 'Medication', time: '8:00 AM', done: false },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function AccessibilitySettingsPage() {
  const { preferences, updatePreference, resetPreferences } = useAccessibility();

  const LETTER_SPACING_OPTIONS: { id: LetterSpacing; label: string; description?: string }[] = [
    { id: 'normal', label: 'Normal' },
    { id: 'relaxed', label: 'Relaxed' },
    { id: 'wide', label: 'Wide' },
  ];

  const LINE_HEIGHT_OPTIONS: { id: LineHeight; label: string; description?: string }[] = [
    { id: 'normal', label: 'Normal', description: '1.5×' },
    { id: 'comfortable', label: 'Comfortable', description: '1.75×' },
    { id: 'spacious', label: 'Spacious', description: '2×' },
  ];

  const RADIUS_OPTIONS: { id: BorderRadius; label: string; description?: string }[] = [
    { id: 'sharp', label: 'Sharp', description: 'No rounding' },
    { id: 'rounded', label: 'Rounded', description: 'Subtle curves' },
    { id: 'soft', label: 'Soft', description: 'Generous curves' },
  ];

  const MOTION_OPTIONS: { id: MotionPreference; label: string; description?: string }[] = [
    { id: 'normal', label: 'Normal', description: 'All animations' },
    { id: 'reduced', label: 'Reduced', description: 'Minimal motion' },
    { id: 'none', label: 'None', description: 'No animations' },
  ];

  return (
    <AppShell title="Accessibility Settings">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Settings panel */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Your preferences</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetPreferences}
                title="Reset to defaults"
              >
                <RotateCcw className="size-4" />
                Reset
              </Button>
            </div>

            {/* Colour theme */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Colour Theme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {COLOR_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => updatePreference('colorTheme', theme.id)}
                      aria-pressed={preferences.colorTheme === theme.id}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-[var(--radius-active,0.5rem)] border transition-all cursor-pointer text-left',
                        preferences.colorTheme === theme.id
                          ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                          : 'border-border hover:border-primary/40'
                      )}
                    >
                      <span
                        className="size-5 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: theme.preview }}
                        aria-hidden="true"
                      />
                      <span className="text-sm font-medium text-foreground">{theme.label}</span>
                      {preferences.colorTheme === theme.id && (
                        <span className="ml-auto text-primary text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Font family */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Font Family</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {FONT_OPTIONS.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => updatePreference('fontFamily', font.id)}
                      aria-pressed={preferences.fontFamily === font.id}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-[var(--radius-active,0.5rem)] border transition-all cursor-pointer text-left',
                        preferences.fontFamily === font.id
                          ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                          : 'border-border hover:border-primary/40'
                      )}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{font.label}</p>
                        <p className="text-xs text-muted-foreground">{font.description}</p>
                      </div>
                      {preferences.fontFamily === font.id && (
                        <span className="text-primary text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Typography */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Typography</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <OptionGroup
                  label="Text Size"
                  options={TEXT_SIZE_OPTIONS.map((o) => ({ id: o.id, label: o.label, description: o.size }))}
                  value={preferences.textSize}
                  onChange={(v) => updatePreference('textSize', v)}
                />
                <OptionGroup
                  label="Letter Spacing"
                  options={LETTER_SPACING_OPTIONS}
                  value={preferences.letterSpacing}
                  onChange={(v) => updatePreference('letterSpacing', v)}
                />
                <OptionGroup
                  label="Line Height"
                  options={LINE_HEIGHT_OPTIONS}
                  value={preferences.lineHeight}
                  onChange={(v) => updatePreference('lineHeight', v)}
                />
              </CardContent>
            </Card>

            {/* Layout & Motion */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Layout & Motion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <OptionGroup
                  label="Border Radius"
                  options={RADIUS_OPTIONS}
                  value={preferences.borderRadius}
                  onChange={(v) => updatePreference('borderRadius', v)}
                />
                <OptionGroup
                  label="Motion Preference"
                  description="Controls animations and transitions across the app."
                  options={MOTION_OPTIONS}
                  value={preferences.motionPreference}
                  onChange={(v) => updatePreference('motionPreference', v)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sticky live preview */}
          <div className="sticky top-24">
            <h2 className="text-base font-semibold text-foreground mb-3">Live preview</h2>
            <LivePreview preferences={preferences} />
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Changes apply instantly across the whole app.
              Preferences are saved automatically.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
