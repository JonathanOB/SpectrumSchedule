'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Palette } from 'lucide-react';
import { useAccessibility } from '@/hooks/use-accessibility';
import { COLOR_THEMES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function ThemeSwitcher() {
  const { preferences, updatePreference } = useAccessibility();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Change colour theme"
          title="Change colour theme"
        >
          <Palette className="size-5" aria-hidden="true" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            'z-50 min-w-[200px] overflow-hidden',
            'rounded-[var(--radius-active,0.5rem)] p-1',
            'shadow-lg border',
            // Explicit colours so the dropdown is always legible regardless of theme
            'bg-white text-slate-900 border-slate-200',
            '[data-theme=dark]_&:bg-slate-800 [data-theme=dark]_&:text-slate-100 [data-theme=dark]_&:border-slate-700'
          )}
          sideOffset={8}
          align="end"
        >
          <p className="px-2 py-1.5 text-xs font-medium text-slate-500 select-none">
            Colour Theme
          </p>

          {COLOR_THEMES.map((theme) => (
            <DropdownMenu.Item
              key={theme.id}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm cursor-pointer select-none',
                'rounded-[calc(var(--radius-active,0.5rem)*0.75)]',
                'outline-none',
                // Radix highlights items via data-highlighted, not :hover/:focus
                'data-[highlighted]:bg-slate-100',
                preferences.colorTheme === theme.id && 'font-medium'
              )}
              onSelect={() => updatePreference('colorTheme', theme.id)}
            >
              <span
                className="size-4 rounded-full border border-white/30 shrink-0 shadow-sm"
                style={{ backgroundColor: theme.preview }}
                aria-hidden="true"
              />
              <span className="flex-1">{theme.label}</span>
              {preferences.colorTheme === theme.id && (
                <span className="text-xs ml-auto" aria-hidden="true">✓</span>
              )}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
