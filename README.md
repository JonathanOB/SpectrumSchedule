# Spectrum Schedule

A visual routine and schedule platform designed for autistic adults and children, ADHD users, caregivers, and parents. Built with accessibility and simplicity as the primary requirements. Not a medical application.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Auth | Clerk |
| Database | Supabase (PostgreSQL) |
| Forms | React Hook Form + Zod |
| Drag & Drop | @dnd-kit |
| Icons | Lucide React |
| UI Primitives | Radix UI |

## Features

- **6 colour themes** — Calm Blue, Soft Green, Warm Beige, Lavender, Dark, High Contrast
- **4 font families** — Inter, Atkinson Hyperlegible, OpenDyslexic, Lexend
- **Full typography control** — text size, letter spacing, line height
- **Motion preferences** — normal, reduced, or none
- **Border radius control** — sharp, rounded, soft
- **Drag-and-drop schedule builder** with full keyboard support
- **Today's View** — large task cards with Done / Skip / Later actions
- **Visual timeline strip** — progress indicator across the day
- **Routine templates** — reusable step collections, apply to any schedule in one click
- **Caregiver share links** — read-only public view, no login required
- **Printable schedules** — print-optimised layout that auto-triggers print dialog
- **Offline support** — localStorage caching works without a connection
- **Cloud sync** — preferences and data saved to Supabase for signed-in users
- **Full keyboard navigation** and ARIA semantics throughout

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/JonathanOB/spectrumschedule.git
cd spectrumschedule
npm install
```

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

```env
# Clerk — https://clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/

# Supabase — https://supabase.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Open the **SQL Editor**
3. Run the full contents of `supabase/schema.sql`

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Sign-in / Sign-up (Clerk hosted UI)
│   ├── dashboard/          # Main dashboard (Server Component, real data)
│   ├── schedules/          # Schedule list + drag-and-drop builder
│   ├── routines/           # Routine template list + step builder
│   ├── today/              # Today's task view with Done/Skip/Later
│   ├── share/[token]/      # Public caregiver read-only view
│   └── settings/           # Accessibility settings with live preview
├── actions/                # Server Actions (Supabase CRUD, share links)
├── components/
│   ├── accessibility/      # ThemeSwitcher
│   ├── dashboard/          # ProgressWidget
│   ├── landing/            # Landing page sections
│   ├── layout/             # AppShell, Sidebar, AppHeader, Footer
│   ├── routines/           # RoutineCard, RoutineBuilder, RoutineForm
│   ├── schedule/           # ScheduleCard, ScheduleBuilder, IconPicker, ShareButton
│   └── ui/                 # Button, Card, Badge
├── hooks/                  # useLocalSchedules, useLocalRoutines, useAccessibility
├── lib/
│   ├── supabase/           # Browser + server Supabase clients
│   ├── constants.ts        # Themes, fonts, icons, schedule colours
│   └── utils.ts            # cn(), formatTime(), generateId(), etc.
├── providers/              # AccessibilityProvider (theme + prefs + cloud sync)
└── types/                  # TypeScript interfaces for all domain models
supabase/
└── schema.sql              # Full database schema with RLS
```

## Accessibility

- All colour themes meet WCAG AA contrast minimums; High Contrast meets AAA
- Keyboard-navigable drag-and-drop via @dnd-kit (arrow keys reorder items)
- Proper ARIA roles, labels, and `aria-live` regions throughout
- Visible focus indicators on every interactive element
- `motion-reduced` and `motion-none` CSS classes applied from user preference
- Respects `prefers-reduced-motion` media query by default
- Semantic HTML structure with landmark roles
- Large touch targets (minimum 44×44 px) on all interactive elements

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local.example`
4. Deploy

```bash
# Or via CLI
vercel deploy --prod
```

## Licence

MIT

## Disclaimer
This is an app built for a portfolio and not a production ready application. Certain testing may not have been conducted.