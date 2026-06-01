'use client';

import { Palette } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAccessibility } from '@/hooks/use-accessibility';
import { COLOR_THEMES } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export function ThemeSwitcher() {
  const { preferences, updatePreference } = useAccessibility();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Change colour theme"
        title="Change colour theme"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Palette className="size-5" aria-hidden="true" />
      </Button>

      {open && (
        <div
          role="listbox"
          aria-label="Colour theme"
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            zIndex: 9999,
            minWidth: '200px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '4px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.12), 0 4px 6px -4px rgba(0,0,0,0.08)',
          }}
        >
          <p
            style={{
              padding: '6px 8px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#94a3b8',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              userSelect: 'none',
            }}
          >
            Colour Theme
          </p>

          {COLOR_THEMES.map((theme) => {
            const active = preferences.colorTheme === theme.id;
            return (
              <button
                key={theme.id}
                role="option"
                aria-selected={active}
                onClick={() => {
                  updatePreference('colorTheme', theme.id);
                  setOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: active ? '#f1f5f9' : 'transparent',
                  fontWeight: active ? 600 : 400,
                  color: '#0f172a',
                  textAlign: 'left',
                  lineHeight: '1.4',
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = active ? '#f1f5f9' : 'transparent';
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: theme.preview,
                    flexShrink: 0,
                    boxShadow: '0 0 0 1.5px rgba(0,0,0,0.12)',
                  }}
                />
                <span style={{ flex: 1 }}>{theme.label}</span>
                {active && (
                  <span aria-hidden="true" style={{ fontSize: '12px', color: '#64748b' }}>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
