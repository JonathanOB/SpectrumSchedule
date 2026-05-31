import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Settings2 } from 'lucide-react';

export const metadata: Metadata = { title: 'Accessibility Settings' };

export default function AccessibilitySettingsPage() {
  return (
    <AppShell title="Accessibility Settings">
      <div className="max-w-3xl mx-auto">
        <Card className="border-dashed border-2">
          <CardContent className="py-16 flex flex-col items-center text-center gap-4">
            <Settings2 className="size-12 text-primary/40" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-foreground">Accessibility Settings</h2>
            <p className="text-muted-foreground max-w-sm">
              Coming in Stage 8. Full live-preview panel for fonts, colour themes, text size,
              spacing, and motion preferences.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
