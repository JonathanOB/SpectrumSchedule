import Link from 'next/link';

const FOOTER_LINKS = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '#benefits' },
      { label: 'Accessibility', href: '#accessibility' },
      { label: 'How it works', href: '#how-it-works' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Sign In', href: '/sign-in' },
      { label: 'Create Account', href: '/sign-up' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Accessibility Settings', href: '/settings/accessibility' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-auto" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg text-foreground hover:text-primary transition-colors mb-3"
            >
              <span className="size-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                S
              </span>
              Spectrum Schedule
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A visual routine and schedule platform designed for everyone.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.heading}>
              <h3 className="text-sm font-semibold text-foreground mb-3">{group.heading}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Spectrum Schedule. Built with accessibility first.
          </p>
          <p className="text-xs text-muted-foreground">
            This is not a medical application.
          </p>
        </div>
      </div>
    </footer>
  );
}
