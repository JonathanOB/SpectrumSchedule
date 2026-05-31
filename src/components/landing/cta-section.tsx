import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CtaSection() {
  return (
    <section
      className="py-20 md:py-28"
      aria-labelledby="cta-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-[var(--radius-active,0.5rem)] px-8 py-14 md:py-20 text-center">
          <h2
            id="cta-heading"
            className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4"
          >
            Start your first schedule today
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Free to use. No credit card. Works on any device. Your data, your preferences,
            your control.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              asChild
            >
              <Link href="/sign-up">
                Create your account
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/today">Try without signing up</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
