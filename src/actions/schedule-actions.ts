'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import type { Schedule, ScheduleItem } from '@/types';

async function requireAuth() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorised');
  return userId;
}

// ─── Profile ──────────────────────────────────────────────────────────────

export async function ensureProfile(displayName?: string) {
  const userId = await requireAuth();
  const db = createServerClient();
  await db
    .from('profiles')
    .upsert({ clerk_user_id: userId, display_name: displayName ?? null }, { onConflict: 'clerk_user_id' });
}

// ─── Schedules ────────────────────────────────────────────────────────────

export async function getSchedules(): Promise<Schedule[]> {
  const userId = await requireAuth();
  const db = createServerClient();
  const { data, error } = await db
    .from('schedules')
    .select('*, schedule_items(*)')
    .eq('clerk_user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapSchedule);
}

export async function getSchedule(id: string): Promise<Schedule | null> {
  const userId = await requireAuth();
  const db = createServerClient();
  const { data, error } = await db
    .from('schedules')
    .select('*, schedule_items(*)')
    .eq('id', id)
    .eq('clerk_user_id', userId)
    .single();
  if (error) return null;
  return mapSchedule(data);
}

export async function createSchedule(input: {
  title: string;
  description?: string;
  color: string;
}): Promise<Schedule> {
  const userId = await requireAuth();
  await ensureProfile();
  const db = createServerClient();
  const { data, error } = await db
    .from('schedules')
    .insert({ ...input, clerk_user_id: userId })
    .select('*, schedule_items(*)')
    .single();
  if (error) throw error;
  revalidatePath('/schedules');
  revalidatePath('/dashboard');
  return mapSchedule(data);
}

export async function updateSchedule(
  id: string,
  input: Partial<Pick<Schedule, 'title' | 'description' | 'color' | 'archived'>>
): Promise<void> {
  const userId = await requireAuth();
  const db = createServerClient();
  const { error } = await db
    .from('schedules')
    .update(input)
    .eq('id', id)
    .eq('clerk_user_id', userId);
  if (error) throw error;
  revalidatePath('/schedules');
  revalidatePath(`/schedules/${id}`);
  revalidatePath('/dashboard');
}

export async function deleteSchedule(id: string): Promise<void> {
  const userId = await requireAuth();
  const db = createServerClient();
  const { error } = await db
    .from('schedules')
    .delete()
    .eq('id', id)
    .eq('clerk_user_id', userId);
  if (error) throw error;
  revalidatePath('/schedules');
  revalidatePath('/dashboard');
}

// ─── Schedule items ───────────────────────────────────────────────────────

export async function addScheduleItem(
  scheduleId: string,
  input: Omit<ScheduleItem, 'id' | 'scheduleId' | 'completed' | 'sortOrder'>
): Promise<ScheduleItem> {
  await requireAuth();
  const db = createServerClient();
  // Get current max sort order
  const { data: existing } = await db
    .from('schedule_items')
    .select('sort_order')
    .eq('schedule_id', scheduleId)
    .order('sort_order', { ascending: false })
    .limit(1);
  const nextOrder = existing?.[0]?.sort_order != null ? existing[0].sort_order + 1 : 0;
  const { data, error } = await db
    .from('schedule_items')
    .insert({ ...input, schedule_id: scheduleId, completed: false, sort_order: nextOrder })
    .select()
    .single();
  if (error) throw error;
  revalidatePath(`/schedules/${scheduleId}`);
  return mapItem(data);
}

export async function updateScheduleItem(
  itemId: string,
  scheduleId: string,
  input: Partial<ScheduleItem>
): Promise<void> {
  await requireAuth();
  const db = createServerClient();
  const { error } = await db
    .from('schedule_items')
    .update({ ...input, schedule_id: undefined, id: undefined })
    .eq('id', itemId)
    .eq('schedule_id', scheduleId);
  if (error) throw error;
  revalidatePath(`/schedules/${scheduleId}`);
  revalidatePath('/today');
}

export async function deleteScheduleItem(itemId: string, scheduleId: string): Promise<void> {
  await requireAuth();
  const db = createServerClient();
  const { error } = await db
    .from('schedule_items')
    .delete()
    .eq('id', itemId)
    .eq('schedule_id', scheduleId);
  if (error) throw error;
  revalidatePath(`/schedules/${scheduleId}`);
}

export async function reorderScheduleItems(
  scheduleId: string,
  orderedIds: string[]
): Promise<void> {
  await requireAuth();
  const db = createServerClient();
  await Promise.all(
    orderedIds.map((id, idx) =>
      db.from('schedule_items').update({ sort_order: idx }).eq('id', id).eq('schedule_id', scheduleId)
    )
  );
  revalidatePath(`/schedules/${scheduleId}`);
}

export async function toggleScheduleItem(itemId: string, scheduleId: string, completed: boolean): Promise<void> {
  await requireAuth();
  const db = createServerClient();
  const { error } = await db
    .from('schedule_items')
    .update({ completed })
    .eq('id', itemId)
    .eq('schedule_id', scheduleId);
  if (error) throw error;
  revalidatePath('/today');
  revalidatePath('/dashboard');
}

// ─── Share links ──────────────────────────────────────────────────────────

export async function createShareLink(scheduleId: string): Promise<string> {
  const userId = await requireAuth();
  const db = createServerClient();
  // Verify ownership
  const { data: schedule } = await db
    .from('schedules')
    .select('id')
    .eq('id', scheduleId)
    .eq('clerk_user_id', userId)
    .single();
  if (!schedule) throw new Error('Schedule not found');
  const { data, error } = await db
    .from('share_links')
    .insert({ schedule_id: scheduleId })
    .select('token')
    .single();
  if (error) throw error;
  return data.token as string;
}

// ─── Mappers ──────────────────────────────────────────────────────────────

function mapSchedule(row: Record<string, unknown>): Schedule {
  return {
    id: row.id as string,
    userId: row.clerk_user_id as string,
    title: row.title as string,
    description: (row.description as string) ?? undefined,
    color: row.color as string,
    archived: row.archived as boolean,
    createdAt: row.created_at as string,
    items: ((row.schedule_items as Record<string, unknown>[]) ?? []).map(mapItem),
  };
}

function mapItem(row: Record<string, unknown>): ScheduleItem {
  return {
    id: row.id as string,
    scheduleId: row.schedule_id as string,
    title: row.title as string,
    description: (row.description as string) ?? undefined,
    icon: (row.icon as string) ?? undefined,
    startTime: (row.start_time as string) ?? undefined,
    endTime: (row.end_time as string) ?? undefined,
    completed: row.completed as boolean,
    sortOrder: row.sort_order as number,
  };
}
