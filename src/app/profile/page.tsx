import { UserProfile } from '@clerk/nextjs';
import { auth, currentUser } from '@clerk/nextjs/server';
import { Download, Settings2 } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSchedules } from '@/actions/schedule-actions';
import { getRoutines } from '@/actions/routine-actions';
import { getPreferences } from '@/actions/preference-actions';
import { COLOR_THEMES, FONT_OPTIONS } from '@/lib/constants';

export const metadata: Metadata = { title: 'Profile' };

async function fetchProfileData() {
  try {
    const [schedules, routines, prefs] = await Promise.all([
      getSchedules(),
      getRoutines(),
      getPreferences(),
    ]);
    return { schedules, routines, prefs };
  } catch {
    return { schedules: [], routines: [], prefs: null };
  }
}

export default async function ProfilePage() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const { schedules, routines, prefs } = await fetchProfileData();

  const activeSchedules = schedules.filter((s) => !s.archived);
  const archivedSchedules = schedules.filter((s) => s.archived);
  const totalTasks = schedules.reduce((sum, s) => sum + (s.items?.length ?? 0), 0);
  const completedTasks = schedules.reduce(
    (sum, s) => sum + (s.items?.filter((i) => i.completed).length ?? 0),
    0
  );

  const themeName = COLOR_THEMES.find((t) => t.id === prefs?.colorTheme)?.label ?? 'Calm Blue';
  const fontName = FONT_OPTIONS.find((f) => f.id === prefs?.fontFamily)?.label ?? 'Inter';

  return (
    <AppShell title="Profile">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Clerk UserProfile */}
        <section aria-labelledby="account-heading">
          <h2 id="account-heading" className="text-lg font-semibold text-foreground mb-4">
            Account
          </h2>
          <UserProfile
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none border border-border rounded-[var(--radius-active,0.5rem)] w-full',
              },
            }}
          />
        </section>

        {/* Data summary */}
        <section aria-labelledby="data-heading">
          <h2 id="data-heading" className="text-lg font-semibold text-foreground mb-4">
            Your data
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Active schedules', value: activeSchedules.length },
              { label: 'Archived schedules', value: archivedSchedules.length },
              { label: 'Routine templates', value: routines.length },
              { label: 'Total tasks', value: totalTasks },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Current preferences */}
        <section aria-labelledby="prefs-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="prefs-heading" className="text-lg font-semibold text-foreground">
              Accessibility preferences
            </h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/settings/accessibility">
                <Settings2 className="size-4" />
                Edit preferences
              </Link>
            </Button>
          </div>

          <Card>
            <CardContent className="p-5">
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Theme', value: themeName },
                  { label: 'Font', value: fontName },
                  { label: 'Text size', value: prefs?.textSize ?? 'Medium' },
                  { label: 'Letter spacing', value: prefs?.letterSpacing ?? 'Normal' },
                  { label: 'Line height', value: prefs?.lineHeight ?? 'Comfortable' },
                  { label: 'Motion', value: prefs?.motionPreference ?? 'Normal' },
                ].map((item) => (
                  <div key={item.label}>
                    <dt className="text-xs text-muted-foreground">{item.label}</dt>
                    <dd className="text-sm font-medium text-foreground capitalize mt-0.5">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </section>

        {/* Export */}
        <section aria-labelledby="export-heading">
          <h2 id="export-heading" className="text-lg font-semibold text-foreground mb-4">
            Export data
          </h2>
          <Card>
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-foreground">Export your schedules</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Download all your schedules and routines as JSON.
                </p>
              </div>
              <ExportButton schedules={schedules} routines={routines} />
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}

// Client component for the export button (needs window / Blob)
import { ExportButton } from '@/components/profile/export-button';
