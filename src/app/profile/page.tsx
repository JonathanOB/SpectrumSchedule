import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

export const metadata: Metadata = { title: 'Profile' };

export default function ProfilePage() {
  return (
    <AppShell title="Profile">
      <div className="max-w-2xl mx-auto">
        <Card className="border-dashed border-2">
          <CardContent className="py-16 flex flex-col items-center text-center gap-4">
            <User className="size-12 text-primary/40" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-foreground">Profile</h2>
            <p className="text-muted-foreground max-w-sm">
              Coming in Stage 10. Manage your account, export data, and review preferences.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
