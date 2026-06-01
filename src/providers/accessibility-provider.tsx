'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '@clerk/nextjs';
import { savePreferences, getPreferences } from '@/actions/preference-actions';
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

// ─── Maps ─────────────────────────────────────────────────────────────────────

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

// ─── DOM application ─────────────────────────────────────────────────────────

// All DOM side-effects live here. Called synchronously so changes are instant.
function applyPreferences(prefs: AccessibilityPreferences) {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  html.setAttribute('data-theme', prefs.colorTheme);
  html.style.fontSize = TEXT_SIZE_MAP[prefs.textSize] ?? '16px';
  html.style.setProperty('--font-active', FONT_MAP[prefs.fontFamily]);
  html.style.setProperty('--letter-spacing-active', LETTER_SPACING_MAP[prefs.letterSpacing]);
  html.style.setProperty('--line-height-active', LINE_HEIGHT_MAP[prefs.lineHeight]);
  html.style.setProperty('--radius-active', RADIUS_MAP[prefs.borderRadius]);
  html.classList.remove('motion-reduced', 'motion-none');
  if (prefs.motionPreference === 'reduced') html.classList.add('motion-reduced');
  if (prefs.motionPreference === 'none') html.classList.add('motion-none');
}

function persistLocal(prefs: AccessibilityPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

function loadLocal(): AccessibilityPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AccessibilityPreferences>;
      return { ...DEFAULT_PREFERENCES, ...parsed };
    }
  } catch {
    // ignore
  }
  return DEFAULT_PREFERENCES;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  // Canonical source of truth lives in this ref so updatePreference is stable
  // and never captures a stale closure.
  const prefsRef = useRef<AccessibilityPreferences>(DEFAULT_PREFERENCES);

  // React state is only used to trigger re-renders in consumers (e.g. to show
  // the checkmark next to the active theme). It does NOT drive DOM updates.
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(DEFAULT_PREFERENCES);

  const { isSignedIn } = useAuth();
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabaseSyncedRef = useRef(false);

  // Apply a new preference object: update ref, DOM, localStorage, and React state.
  const apply = useCallback((next: AccessibilityPreferences) => {
    prefsRef.current = next;
    applyPreferences(next);
    persistLocal(next);
    setPreferences(next);
  }, []);

  // 1. Load from localStorage on mount and apply immediately.
  useEffect(() => {
    apply(loadLocal());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Once signed in, overlay Supabase preferences (once per session).
  useEffect(() => {
    if (!isSignedIn || supabaseSyncedRef.current) return;
    supabaseSyncedRef.current = true;
    getPreferences()
      .then((remote) => {
        if (remote) apply(remote);
      })
      .catch(() => {
        // Fall back to localStorage values already loaded
      });
  }, [isSignedIn, apply]);

  // 3. Debounced Supabase sync whenever preferences change for signed-in users.
  useEffect(() => {
    if (!isSignedIn) return;
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      savePreferences(prefsRef.current).catch(() => {
        // ignore
      });
    }, 800);
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [preferences, isSignedIn]);

  // updatePreference is stable and applies changes synchronously.
  const updatePreference = useCallback(
    <K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) => {
      const next = { ...prefsRef.current, [key]: value };
      apply(next);
    },
    [apply]
  );

  const resetPreferences = useCallback(() => {
    apply(DEFAULT_PREFERENCES);
  }, [apply]);

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
