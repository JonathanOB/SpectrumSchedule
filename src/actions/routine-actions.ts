'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import type { RoutineItem, RoutineTemplate } from '@/types';
import { ensureProfile } from './schedule-actions';

async function requireAuth() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorised');
  return userId;
}

export async function getRoutines(): Promise<RoutineTemplate[]> {
  const userId = await requireAuth();
  const db = createServerClient();
  const { data, error } = await db
    .from('routine_templates')
    .select('*, routine_items(*)')
    .eq('clerk_user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapRoutine);
}

export async function getRoutine(id: string): Promise<RoutineTemplate | null> {
  const userId = await requireAuth();
  const db = createServerClient();
  const { data, error } = await db
    .from('routine_templates')
    .select('*, routine_items(*)')
    .eq('id', id)
    .eq('clerk_user_id', userId)
    .single();
  if (error) return null;
  return mapRoutine(data);
}

export async function createRoutine(input: {
  title: string;
  description?: string;
}): Promise<RoutineTemplate> {
  const userId = await requireAuth();
  await ensureProfile();
  const db = createServerClient();
  const { data, error } = await db
    .from('routine_templates')
    .insert({ ...input, clerk_user_id: userId })
    .select('*, routine_items(*)')
    .single();
  if (error) throw error;
  revalidatePath('/routines');
  return mapRoutine(data);
}

export async function updateRoutine(
  id: string,
  input: Partial<Pick<RoutineTemplate, 'title' | 'description'>>
): Promise<void> {
  const userId = await requireAuth();
  const db = createServerClient();
  const { error } = await db
    .from('routine_templates')
    .update(input)
    .eq('id', id)
    .eq('clerk_user_id', userId);
  if (error) throw error;
  revalidatePath('/routines');
  revalidatePath(`/routines/${id}`);
}

export async function deleteRoutine(id: string): Promise<void> {
  const userId = await requireAuth();
  const db = createServerClient();
  const { error } = await db
    .from('routine_templates')
    .delete()
    .eq('id', id)
    .eq('clerk_user_id', userId);
  if (error) throw error;
  revalidatePath('/routines');
}

export async function addRoutineItem(
  routineId: string,
  input: Pick<RoutineItem, 'title' | 'icon'>
): Promise<RoutineItem> {
  await requireAuth();
  const db = createServerClient();
  const { data: existing } = await db
    .from('routine_items')
    .select('sort_order')
    .eq('routine_id', routineId)
    .order('sort_order', { ascending: false })
    .limit(1);
  const nextOrder = existing?.[0]?.sort_order != null ? existing[0].sort_order + 1 : 0;
  const { data, error } = await db
    .from('routine_items')
    .insert({ ...input, routine_id: routineId, sort_order: nextOrder })
    .select()
    .single();
  if (error) throw error;
  revalidatePath(`/routines/${routineId}`);
  return mapItem(data);
}

export async function updateRoutineItem(
  itemId: string,
  routineId: string,
  input: Partial<Pick<RoutineItem, 'title' | 'icon' | 'sortOrder'>>
): Promise<void> {
  await requireAuth();
  const db = createServerClient();
  const { error } = await db
    .from('routine_items')
    .update({ title: input.title, icon: input.icon, sort_order: input.sortOrder })
    .eq('id', itemId)
    .eq('routine_id', routineId);
  if (error) throw error;
  revalidatePath(`/routines/${routineId}`);
}

export async function deleteRoutineItem(itemId: string, routineId: string): Promise<void> {
  await requireAuth();
  const db = createServerClient();
  const { error } = await db
    .from('routine_items')
    .delete()
    .eq('id', itemId)
    .eq('routine_id', routineId);
  if (error) throw error;
  revalidatePath(`/routines/${routineId}`);
}

export async function reorderRoutineItems(
  routineId: string,
  orderedIds: string[]
): Promise<void> {
  await requireAuth();
  const db = createServerClient();
  await Promise.all(
    orderedIds.map((id, idx) =>
      db.from('routine_items').update({ sort_order: idx }).eq('id', id).eq('routine_id', routineId)
    )
  );
  revalidatePath(`/routines/${routineId}`);
}

// ─── Mappers ──────────────────────────────────────────────────────────────

function mapRoutine(row: Record<string, unknown>): RoutineTemplate {
  return {
    id: row.id as string,
    userId: row.clerk_user_id as string,
    title: row.title as string,
    description: (row.description as string) ?? undefined,
    items: ((row.routine_items as Record<string, unknown>[]) ?? []).map(mapItem),
  };
}

function mapItem(row: Record<string, unknown>): RoutineItem {
  return {
    id: row.id as string,
    routineId: row.routine_id as string,
    title: row.title as string,
    icon: (row.icon as string) ?? undefined,
    sortOrder: row.sort_order as number,
  };
}
