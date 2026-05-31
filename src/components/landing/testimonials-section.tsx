import { Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "My son has autism and struggled with every other scheduling app we tried. The large icons, calm colours, and predictable layout make this the first one he actually uses every day.",
    author: 'Parent of an autistic child',
    role: 'Caregiver',
  },
  {
    id: 2,
    quote:
      'As an autistic adult, I need my tools to be calm and consistent. Being able to choose my font and turn off all animations was a game changer for me.',
    author: 'Autistic adult user',
    role: 'Self-managed schedule',
  },
  {
    id: 3,
    quote:
      'I use it with three different clients. The caregiver sharing link means I can check in without disrupting their routine or needing to log into anything.',
    author: 'Support worker',
    role: 'Community care',
  },
];

export function TestimonialsSection() {
  return (
    <section
      className="py-20 md:py-28 bg-muted/50"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="testimonials-heading"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Designed with the community
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Built from the ground up with feedback from autistic adults, parents,
            and support workers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <Card key={t.id} className="border-border">
              <CardContent className="p-6 flex flex-col gap-4">
                <Quote className="size-6 text-primary/40" aria-hidden="true" />
                <blockquote className="text-muted-foreground leading-relaxed text-sm">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <footer className="mt-auto">
                  <p className="font-semibold text-foreground text-sm">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </footer>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
