import { AccessibilitySection } from '@/components/landing/accessibility-section';
import { BenefitsSection } from '@/components/landing/benefits-section';
import { CtaSection } from '@/components/landing/cta-section';
import { HeroSection } from '@/components/landing/hero-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { Footer } from '@/components/layout/footer';
import { LandingHeader } from '@/components/layout/header';

export default function HomePage() {
  return (
    <>
      <LandingHeader />
      <main id="main-content">
        <HeroSection />
        <BenefitsSection />
        <AccessibilitySection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
