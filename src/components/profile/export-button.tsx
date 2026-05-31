'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Schedule, RoutineTemplate } from '@/types';

interface ExportButtonProps {
  schedules: Schedule[];
  routines: RoutineTemplate[];
}

export function ExportButton({ schedules, routines }: ExportButtonProps) {
  function handleExport() {
    const data = {
      exportedAt: new Date().toISOString(),
      schedules,
      routines,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spectrum-schedule-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} className="shrink-0">
      <Download className="size-4" />
      Export JSON
    </Button>
  );
}
