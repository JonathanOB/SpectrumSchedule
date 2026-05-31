'use client';

import { useCallback, useEffect, useState } from 'react';
import type { RoutineItem, RoutineTemplate } from '@/types';
import { generateId } from '@/lib/utils';

const STORAGE_KEY = 'spectrum-routines';

function load(): RoutineTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RoutineTemplate[]) : [];
  } catch {
    return [];
  }
}

function save(routines: RoutineTemplate[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
  } catch {
    // ignore
  }
}

export function useLocalRoutines() {
  const [routines, setRoutines] = useState<RoutineTemplate[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRoutines(load());
    setHydrated(true);
  }, []);

  const persist = useCallback((updated: RoutineTemplate[]) => {
    setRoutines(updated);
    save(updated);
  }, []);

  const createRoutine = useCallback(
    (data: { title: string; description?: string }) => {
      const routine: RoutineTemplate = {
        id: generateId(),
        userId: 'local',
        title: data.title,
        description: data.description,
        items: [],
      };
      persist([...routines, routine]);
      return routine;
    },
    [routines, persist]
  );

  const updateRoutine = useCallback(
    (id: string, data: Partial<Pick<RoutineTemplate, 'title' | 'description'>>) => {
      persist(routines.map((r) => (r.id === id ? { ...r, ...data } : r)));
    },
    [routines, persist]
  );

  const deleteRoutine = useCallback(
    (id: string) => {
      persist(routines.filter((r) => r.id !== id));
    },
    [routines, persist]
  );

  const addItem = useCallback(
    (routineId: string, data: Pick<RoutineItem, 'title' | 'icon'>) => {
      persist(
        routines.map((r) => {
          if (r.id !== routineId) return r;
          const items = r.items ?? [];
          const newItem: RoutineItem = {
            id: generateId(),
            routineId,
            sortOrder: items.length,
            ...data,
          };
          return { ...r, items: [...items, newItem] };
        })
      );
    },
    [routines, persist]
  );

  const updateItem = useCallback(
    (routineId: string, itemId: string, data: Partial<RoutineItem>) => {
      persist(
        routines.map((r) => {
          if (r.id !== routineId) return r;
          return {
            ...r,
            items: (r.items ?? []).map((i) => (i.id === itemId ? { ...i, ...data } : i)),
          };
        })
      );
    },
    [routines, persist]
  );

  const deleteItem = useCallback(
    (routineId: string, itemId: string) => {
      persist(
        routines.map((r) => {
          if (r.id !== routineId) return r;
          return {
            ...r,
            items: (r.items ?? [])
              .filter((i) => i.id !== itemId)
              .map((i, idx) => ({ ...i, sortOrder: idx })),
          };
        })
      );
    },
    [routines, persist]
  );

  const reorderItems = useCallback(
    (routineId: string, orderedIds: string[]) => {
      persist(
        routines.map((r) => {
          if (r.id !== routineId) return r;
          const map = new Map((r.items ?? []).map((i) => [i.id, i]));
          const reordered = orderedIds
            .map((id, idx) => {
              const item = map.get(id);
              return item ? { ...item, sortOrder: idx } : null;
            })
            .filter(Boolean) as RoutineItem[];
          return { ...r, items: reordered };
        })
      );
    },
    [routines, persist]
  );

  const getRoutine = useCallback(
    (id: string) => routines.find((r) => r.id === id),
    [routines]
  );

  return {
    routines,
    hydrated,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    getRoutine,
  };
}
