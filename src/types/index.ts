// ─── Accessibility Preferences ───────────────────────────────────────────────

export type ColorTheme =
  | 'calm-blue'
  | 'soft-green'
  | 'warm-beige'
  | 'lavender'
  | 'dark'
  | 'high-contrast';

export type TextSize = 'small' | 'medium' | 'large' | 'extra-large';

export type FontFamily = 'inter' | 'atkinson' | 'opendyslexic' | 'lexend';

export type LetterSpacing = 'normal' | 'relaxed' | 'wide';

export type LineHeight = 'normal' | 'comfortable' | 'spacious';

export type BorderRadius = 'sharp' | 'rounded' | 'soft';

export type MotionPreference = 'normal' | 'reduced' | 'none';

export interface AccessibilityPreferences {
  colorTheme: ColorTheme;
  textSize: TextSize;
  fontFamily: FontFamily;
  letterSpacing: LetterSpacing;
  lineHeight: LineHeight;
  borderRadius: BorderRadius;
  motionPreference: MotionPreference;
}

// ─── Database Models ──────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  clerkUserId: string;
  displayName: string;
  createdAt: string;
}

export interface UserPreferences {
  id: string;
  userId: string;
  fontFamily: FontFamily;
  textSize: TextSize;
  colorTheme: ColorTheme;
  letterSpacing: LetterSpacing;
  lineHeight: LineHeight;
  borderRadius: BorderRadius;
  motionPreference: MotionPreference;
}

export interface Schedule {
  id: string;
  userId: string;
  title: string;
  description?: string;
  color: string;
  archived: boolean;
  createdAt: string;
  items?: ScheduleItem[];
}

export interface ScheduleItem {
  id: string;
  scheduleId: string;
  title: string;
  description?: string;
  icon?: string;
  startTime?: string;
  endTime?: string;
  completed: boolean;
  sortOrder: number;
}

export interface RoutineTemplate {
  id: string;
  userId: string;
  title: string;
  description?: string;
  items?: RoutineItem[];
}

export interface RoutineItem {
  id: string;
  routineId: string;
  title: string;
  icon?: string;
  sortOrder: number;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export interface ScheduleColor {
  label: string;
  value: string;
  bg: string;
  text: string;
}

export interface TaskIcon {
  id: string;
  label: string;
  emoji: string;
}

export type ViewMode = 'cards' | 'timeline' | 'list';

// ─── Caregiver ────────────────────────────────────────────────────────────────

export interface ShareLink {
  id: string;
  scheduleId: string;
  token: string;
  expiresAt?: string;
  createdAt: string;
}
