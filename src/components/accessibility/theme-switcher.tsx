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
            'bg-card border border-border shadow-lg',
            'rounded-[var(--radius-active,0.5rem)] p-1',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
          )}
          sideOffset={8}
          align="end"
        >
          <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Colour Theme
          </p>
          {COLOR_THEMES.map((theme) => (
            <DropdownMenu.Item
              key={theme.id}
              className={cn(
                'flex items-center gap-3 px-2 py-2 text-sm cursor-pointer',
                'rounded-[calc(var(--radius-active,0.5rem)*0.75)]',
                'hover:bg-muted focus:bg-muted outline-none',
                preferences.colorTheme === theme.id && 'bg-muted font-medium'
              )}
              onSelect={() => updatePreference('colorTheme', theme.id)}
            >
              <span
                className="size-4 rounded-full border border-border shrink-0"
                style={{ backgroundColor: theme.preview }}
                aria-hidden="true"
              />
              {theme.label}
              {preferences.colorTheme === theme.id && (
                <span className="ml-auto text-primary text-xs">✓</span>
              )}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
