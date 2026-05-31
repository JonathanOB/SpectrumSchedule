'use server';

import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import type { AccessibilityPreferences } from '@/types';
import { ensureProfile } from './schedule-actions';

async function requireAuth() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorised');
  return userId;
}

export async function getPreferences(): Promise<AccessibilityPreferences | null> {
  const userId = await requireAuth();
  const db = createServerClient();
  const { data } = await db
    .from('user_preferences')
    .select('*')
    .eq('clerk_user_id', userId)
    .single();
  if (!data) return null;
  return {
    colorTheme: data.color_theme,
    textSize: data.text_size,
    fontFamily: data.font_family,
    letterSpacing: data.letter_spacing,
    lineHeight: data.line_height,
    borderRadius: data.border_radius,
    motionPreference: data.motion_preference,
  } as AccessibilityPreferences;
}

export async function savePreferences(prefs: AccessibilityPreferences): Promise<void> {
  const userId = await requireAuth();
  await ensureProfile();
  const db = createServerClient();
  await db.from('user_preferences').upsert(
    {
      clerk_user_id: userId,
      color_theme: prefs.colorTheme,
      text_size: prefs.textSize,
      font_family: prefs.fontFamily,
      letter_spacing: prefs.letterSpacing,
      line_height: prefs.lineHeight,
      border_radius: prefs.borderRadius,
      motion_preference: prefs.motionPreference,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'clerk_user_id' }
  );
}
