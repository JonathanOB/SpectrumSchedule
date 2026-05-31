'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { TASK_ICONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface IconPickerProps {
  value?: string;
  onChange: (emoji: string) => void;
  children: React.ReactNode;
}

export function IconPicker({ value, onChange, children }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? TASK_ICONS.filter((i) => i.label.toLowerCase().includes(search.toLowerCase()))
    : TASK_ICONS;

  function handleSelect(emoji: string) {
    onChange(emoji);
    setOpen(false);
    setSearch('');
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-md bg-card border border-border shadow-xl',
            'rounded-[var(--radius-active,0.5rem)] p-0 overflow-hidden',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
          )}
          aria-describedby={undefined}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <Dialog.Title className="font-semibold text-foreground">Choose an icon</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close icon picker">
                <X className="size-4" />
              </Button>
            </Dialog.Close>
          </div>

          {/* Search */}
          <div className="px-4 py-3 border-b border-border relative">
            <Search
              className="absolute left-7 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                'w-full pl-9 pr-4 py-2 text-sm',
                'bg-muted border border-border rounded-[calc(var(--radius-active,0.5rem)*0.75)]',
                'text-foreground placeholder:text-muted-foreground',
                'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1'
              )}
              aria-label="Search icons"
            />
          </div>

          {/* Grid */}
          <div
            className="p-3 grid grid-cols-6 gap-1 max-h-72 overflow-y-auto"
            role="listbox"
            aria-label="Task icons"
          >
            {filtered.length === 0 && (
              <p className="col-span-6 text-center py-8 text-sm text-muted-foreground">
                No icons found
              </p>
            )}
            {filtered.map((icon) => (
              <button
                key={icon.id}
                role="option"
                aria-selected={value === icon.emoji}
                title={icon.label}
                onClick={() => handleSelect(icon.emoji)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 p-2',
                  'rounded-[calc(var(--radius-active,0.5rem)*0.75)]',
                  'text-2xl cursor-pointer transition-colors',
                  'hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring',
                  value === icon.emoji && 'bg-primary/10 ring-2 ring-primary/30'
                )}
              >
                <span aria-hidden="true">{icon.emoji}</span>
                <span className="text-[10px] text-muted-foreground leading-none truncate w-full text-center">
                  {icon.label}
                </span>
              </button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
