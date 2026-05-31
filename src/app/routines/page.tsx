import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Repeat2 } from 'lucide-react';

export const metadata: Metadata = { title: 'Routines' };

export default function RoutinesPage() {
  return (
    <AppShell title="Routines">
      <div className="max-w-5xl mx-auto">
        <Card className="border-dashed border-2">
          <CardContent className="py-16 flex flex-col items-center text-center gap-4">
            <Repeat2 className="size-12 text-primary/40" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-foreground">Routine Templates</h2>
            <p className="text-muted-foreground max-w-sm">
              Coming in Stage 7. Save and reuse your Morning Routine, School Day, Bedtime
              Routine and more.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
