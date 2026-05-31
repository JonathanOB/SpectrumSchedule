'use client';

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { AppHeader } from './app-header';

interface AppShellProps {
  title: string;
  children: React.ReactNode;
}

export function AppShell({ title, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AppHeader title={title} onMenuOpen={() => setSidebarOpen(true)} />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
