'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DayRecord {
  label: string;
  pct: number;
  isToday: boolean;
}

const STORAGE_KEY = 'spectrum-daily-progress';

function loadHistory(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveProgress(dateKey: string, pct: number) {
  try {
    const history = loadHistory();
    history[dateKey] = pct;
    // Only keep last 30 days
    const keys = Object.keys(history).sort().slice(-30);
    const trimmed: Record<string, number> = {};
    keys.forEach((k) => { trimmed[k] = history[k]; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

export function WeeklyProgress() {
  const [days, setDays] = useState<DayRecord[]>([]);

  useEffect(() => {
    const history = loadHistory();
    const today = new Date();
    const result: DayRecord[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = i === 0 ? 'Today' : d.toLocaleDateString('en-GB', { weekday: 'short' });
      result.push({
        label,
        pct: history[key] ?? 0,
        isToday: i === 0,
      });
    }

    setDays(result);
  }, []);

  const totalDaysWithActivity = days.filter((d) => d.pct > 0).length;
  const avgPct = days.length > 0 ? Math.round(days.reduce((s, d) => s + d.pct, 0) / days.length) : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-muted-foreground">
          Weekly progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-3 mb-4">
          <span className="text-4xl font-bold text-foreground">{avgPct}%</span>
          <span className="text-sm text-muted-foreground mb-1">
            avg · {totalDaysWithActivity}/7 days active
          </span>
        </div>

        {/* Bar chart */}
        <div
          className="flex items-end gap-1.5 h-16"
          role="img"
          aria-label={`Weekly completion: ${days.map((d) => `${d.label} ${d.pct}%`).join(', ')}`}
        >
          {days.map((day) => (
            <div key={day.label} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end h-12">
                <div
                  className={`w-full rounded-t-sm transition-all ${day.isToday ? 'bg-primary' : 'bg-primary/30'}`}
                  style={{ height: `${Math.max(day.pct, day.pct > 0 ? 8 : 2)}%`, minHeight: day.pct > 0 ? '4px' : '2px' }}
                  aria-hidden="true"
                />
              </div>
              <span className={`text-[10px] leading-none ${day.isToday ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                {day.label.slice(0, 3)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
