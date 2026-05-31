'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Schedule, ScheduleItem } from '@/types';
import { generateId } from '@/lib/utils';

const STORAGE_KEY = 'spectrum-schedules';

function load(): Schedule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Schedule[]) : [];
  } catch {
    return [];
  }
}

function save(schedules: Schedule[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
  } catch {
    // ignore
  }
}

export function useLocalSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSchedules(load());
    setHydrated(true);
  }, []);

  const persist = useCallback((updated: Schedule[]) => {
    setSchedules(updated);
    save(updated);
  }, []);

  const createSchedule = useCallback(
    (data: { title: string; description?: string; color: string }) => {
      const schedule: Schedule = {
        id: generateId(),
        userId: 'local',
        title: data.title,
        description: data.description,
        color: data.color,
        archived: false,
        createdAt: new Date().toISOString(),
        items: [],
      };
      persist([...schedules, schedule]);
      return schedule;
    },
    [schedules, persist]
  );

  const updateSchedule = useCallback(
    (id: string, data: Partial<Pick<Schedule, 'title' | 'description' | 'color' | 'archived'>>) => {
      persist(schedules.map((s) => (s.id === id ? { ...s, ...data } : s)));
    },
    [schedules, persist]
  );

  const deleteSchedule = useCallback(
    (id: string) => {
      persist(schedules.filter((s) => s.id !== id));
    },
    [schedules, persist]
  );

  const addItem = useCallback(
    (scheduleId: string, data: Omit<ScheduleItem, 'id' | 'scheduleId' | 'completed' | 'sortOrder'>) => {
      persist(
        schedules.map((s) => {
          if (s.id !== scheduleId) return s;
          const items = s.items ?? [];
          const newItem: ScheduleItem = {
            id: generateId(),
            scheduleId,
            completed: false,
            sortOrder: items.length,
            ...data,
          };
          return { ...s, items: [...items, newItem] };
        })
      );
    },
    [schedules, persist]
  );

  const updateItem = useCallback(
    (scheduleId: string, itemId: string, data: Partial<ScheduleItem>) => {
      persist(
        schedules.map((s) => {
          if (s.id !== scheduleId) return s;
          return {
            ...s,
            items: (s.items ?? []).map((item) =>
              item.id === itemId ? { ...item, ...data } : item
            ),
          };
        })
      );
    },
    [schedules, persist]
  );

  const deleteItem = useCallback(
    (scheduleId: string, itemId: string) => {
      persist(
        schedules.map((s) => {
          if (s.id !== scheduleId) return s;
          return {
            ...s,
            items: (s.items ?? [])
              .filter((i) => i.id !== itemId)
              .map((i, idx) => ({ ...i, sortOrder: idx })),
          };
        })
      );
    },
    [schedules, persist]
  );

  const reorderItems = useCallback(
    (scheduleId: string, orderedIds: string[]) => {
      persist(
        schedules.map((s) => {
          if (s.id !== scheduleId) return s;
          const itemMap = new Map((s.items ?? []).map((i) => [i.id, i]));
          const reordered = orderedIds
            .map((id, idx) => {
              const item = itemMap.get(id);
              return item ? { ...item, sortOrder: idx } : null;
            })
            .filter(Boolean) as ScheduleItem[];
          return { ...s, items: reordered };
        })
      );
    },
    [schedules, persist]
  );

  const toggleItem = useCallback(
    (scheduleId: string, itemId: string) => {
      persist(
        schedules.map((s) => {
          if (s.id !== scheduleId) return s;
          return {
            ...s,
            items: (s.items ?? []).map((i) =>
              i.id === itemId ? { ...i, completed: !i.completed } : i
            ),
          };
        })
      );
    },
    [schedules, persist]
  );

  const getSchedule = useCallback(
    (id: string) => schedules.find((s) => s.id === id),
    [schedules]
  );

  return {
    schedules,
    hydrated,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    toggleItem,
    getSchedule,
    activeSchedules: schedules.filter((s) => !s.archived),
    archivedSchedules: schedules.filter((s) => s.archived),
  };
}
