'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type {
  AccessibilityPreferences,
  BorderRadius,
  ColorTheme,
  FontFamily,
  LetterSpacing,
  LineHeight,
  MotionPreference,
  TextSize,
} from '@/types';

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  colorTheme: 'calm-blue',
  textSize: 'medium',
  fontFamily: 'inter',
  letterSpacing: 'normal',
  lineHeight: 'comfortable',
  borderRadius: 'rounded',
  motionPreference: 'normal',
};

const STORAGE_KEY = 'spectrum-schedule-a11y';

// ─── Context ──────────────────────────────────────────────────────────────────

interface AccessibilityContextValue {
  preferences: AccessibilityPreferences;
  updatePreference: <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => void;
  resetPreferences: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TEXT_SIZE_MAP: Record<TextSize, string> = {
  small: '14px',
  medium: '16px',
  large: '18px',
  'extra-large': '20px',
};

const FONT_MAP: Record<FontFamily, string> = {
  inter: 'var(--font-inter, Inter, system-ui, sans-serif)',
  atkinson: 'var(--font-atkinson, "Atkinson Hyperlegible", system-ui, sans-serif)',
  opendyslexic: '"OpenDyslexic", system-ui, sans-serif',
  lexend: 'var(--font-lexend, Lexend, system-ui, sans-serif)',
};

const LETTER_SPACING_MAP: Record<LetterSpacing, string> = {
  normal: 'normal',
  relaxed: '0.025em',
  wide: '0.05em',
};

const LINE_HEIGHT_MAP: Record<LineHeight, string> = {
  normal: '1.5',
  comfortable: '1.75',
  spacious: '2',
};

const RADIUS_MAP: Record<BorderRadius, string> = {
  sharp: '0px',
  rounded: '0.5rem',
  soft: '1rem',
};

function applyPreferences(prefs: AccessibilityPreferences) {
  const html = document.documentElement;

  html.setAttribute('data-theme', prefs.colorTheme);
  html.style.fontSize = TEXT_SIZE_MAP[prefs.textSize];
  html.style.setProperty('--font-active', FONT_MAP[prefs.fontFamily]);
  html.style.setProperty('--letter-spacing-active', LETTER_SPACING_MAP[prefs.letterSpacing]);
  html.style.setProperty('--line-height-active', LINE_HEIGHT_MAP[prefs.lineHeight]);
  html.style.setProperty('--radius-active', RADIUS_MAP[prefs.borderRadius]);

  html.classList.remove('motion-reduced', 'motion-none');
  if (prefs.motionPreference === 'reduced') html.classList.add('motion-reduced');
  if (prefs.motionPreference === 'none') html.classList.add('motion-none');
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(DEFAULT_PREFERENCES);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AccessibilityPreferences>;
        setPreferences((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Apply preferences to DOM and persist whenever they change
  useEffect(() => {
    if (!hydrated) return;
    applyPreferences(preferences);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // ignore
    }
  }, [preferences, hydrated]);

  const updatePreference = useCallback(
    <K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) => {
      setPreferences((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  return (
    <AccessibilityContext.Provider value={{ preferences, updatePreference, resetPreferences }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
