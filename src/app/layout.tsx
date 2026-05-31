import type { Metadata, Viewport } from 'next';
import { Atkinson_Hyperlegible, Inter, Lexend } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { AccessibilityProvider } from '@/providers/accessibility-provider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const atkinson = Atkinson_Hyperlegible({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-atkinson',
  display: 'swap',
});

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Spectrum Schedule',
    template: '%s | Spectrum Schedule',
  },
  description:
    'A visual routine and schedule platform designed for autistic adults, children, ADHD users, caregivers, and parents. Calm, accessible, and fully customisable.',
  keywords: [
    'schedule',
    'routine',
    'autism',
    'ADHD',
    'accessibility',
    'visual schedule',
    'caregiver',
  ],
  authors: [{ name: 'Spectrum Schedule' }],
  openGraph: {
    type: 'website',
    title: 'Spectrum Schedule',
    description: 'Visual routine and schedule planning for everyone.',
    siteName: 'Spectrum Schedule',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f0f4f8' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="calm-blue"
      suppressHydrationWarning
      className={`${inter.variable} ${atkinson.variable} ${lexend.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <ClerkProvider>
          <AccessibilityProvider>{children}</AccessibilityProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
