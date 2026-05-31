import Link from 'next/link';
import { ThemeSwitcher } from '@/components/accessibility/theme-switcher';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Minimal header */}
      <header className="border-b border-border px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-foreground hover:text-primary transition-colors"
        >
          <span className="size-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
            S
          </span>
          Spectrum Schedule
        </Link>
        <ThemeSwitcher />
      </header>

      {/* Centred content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        {children}
      </main>

      <footer className="border-t border-border px-4 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          This is not a medical application.
        </p>
      </footer>
    </div>
  );
}
