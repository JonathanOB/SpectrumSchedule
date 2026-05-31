'use client';

import { CheckCircle2, Copy, Link2, Printer } from 'lucide-react';
import { useState } from 'react';
import { createShareLink } from '@/actions/schedule-actions';
import { Button } from '@/components/ui/button';

interface ShareButtonProps {
  scheduleId: string;
}

export function ShareButton({ scheduleId }: ShareButtonProps) {
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const t = await createShareLink(scheduleId);
      setToken(t);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!token) return;
    const url = `${window.location.origin}/share/${token}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (token) {
    return (
      <Button variant="outline" size="sm" onClick={handleCopy} disabled={copied}>
        {copied ? (
          <><CheckCircle2 className="size-4 text-success" /> Copied!</>
        ) : (
          <><Copy className="size-4" /> Copy share link</>
        )}
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={handleGenerate} disabled={loading}>
      <Link2 className="size-4" />
      {loading ? 'Generating…' : 'Share (caregiver)'}
    </Button>
  );
}

interface PrintButtonProps {
  scheduleId: string;
}

export function PrintButton({ scheduleId }: PrintButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => window.open(`/schedules/${scheduleId}/print`, '_blank')}
      aria-label="Print schedule"
      title="Print schedule"
    >
      <Printer className="size-4" />
    </Button>
  );
}
