'use client';

import { Menu } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { ThemeSwitcher } from '@/components/accessibility/theme-switcher';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  title: string;
  onMenuOpen: () => void;
}

export function AppHeader({ title, onMenuOpen }: AppHeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center px-4 gap-4 shrink-0 sticky top-0 z-20">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuOpen}
        aria-label="Open navigation"
        aria-controls="app-sidebar"
        aria-haspopup="true"
      >
        <Menu className="size-5" aria-hidden="true" />
      </Button>

      {/* Page title */}
      <h1 className="font-semibold text-foreground text-lg flex-1">{title}</h1>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'size-9',
            },
          }}
        />
      </div>
    </header>
  );
}
