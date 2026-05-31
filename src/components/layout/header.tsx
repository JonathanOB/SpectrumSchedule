'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ThemeSwitcher } from '@/components/accessibility/theme-switcher';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '#benefits', label: 'Benefits' },
  { href: '#accessibility', label: 'Accessibility' },
  { href: '#how-it-works', label: 'How It Works' },
];

export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-foreground hover:text-primary transition-colors focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 rounded-sm"
          >
            <span
              className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold"
              aria-hidden="true"
            >
              S
            </span>
            <span>Spectrum Schedule</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 text-sm text-muted-foreground hover:text-foreground',
                  'rounded-[var(--radius-active,0.5rem)] hover:bg-muted',
                  'transition-colors focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Get Started Free</Link>
              </Button>
            </div>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          className="md:hidden border-t border-border bg-background px-4 pb-4"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1 pt-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-3 text-sm text-foreground hover:bg-muted rounded-[var(--radius-active,0.5rem)] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border">
              <Button variant="outline" asChild>
                <Link href="/sign-in" onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up" onClick={() => setMenuOpen(false)}>
                  Get Started Free
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
