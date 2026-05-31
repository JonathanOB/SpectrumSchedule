'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarCheck2,
  CalendarDays,
  LayoutDashboard,
  Repeat2,
  Settings2,
  User,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/today', label: "Today's Schedule", icon: CalendarCheck2 },
  { href: '/schedules', label: 'Schedules', icon: CalendarDays },
  { href: '/routines', label: 'Routines', icon: Repeat2 },
];

const BOTTOM_ITEMS = [
  { href: '/settings/accessibility', label: 'Accessibility', icon: Settings2 },
  { href: '/profile', label: 'Profile', icon: User },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        id="app-sidebar"
        className={cn(
          'fixed top-0 left-0 z-40 h-full w-64 flex flex-col',
          'bg-card border-r border-border',
          'transition-transform duration-200',
          // Desktop: always visible; Mobile: slide in/out
          'lg:static lg:translate-x-0 lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Application navigation"
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-border shrink-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-bold text-lg text-foreground hover:text-primary transition-colors"
            onClick={onClose}
          >
            <span className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
              S
            </span>
            <span>Spectrum</span>
          </Link>
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Main">
          <ul className="space-y-1" role="list">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-active,0.5rem)]',
                      'text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="size-5 shrink-0" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom nav */}
        <nav className="py-4 px-3 border-t border-border" aria-label="Settings">
          <ul className="space-y-1" role="list">
            {BOTTOM_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-active,0.5rem)]',
                      'text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="size-5 shrink-0" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
