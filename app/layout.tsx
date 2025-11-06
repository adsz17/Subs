import './globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Playfair_Display, Inter } from 'next/font/google';
import { baseMetadata } from '@/lib/seo';
import { SiteHeader } from '@/components/ui/SiteHeader';
import { Footer } from '@/components/ui/Footer';
import { ThemeScript } from '@/components/theme/ThemeScript';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = baseMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen antialiased">
        <div className="relative flex min-h-screen flex-col">
          <div className="bg-secondary text-secondary-foreground">
            <div className="container flex h-10 items-center justify-center gap-2 text-xs font-medium md:text-sm">
              <span className="uppercase tracking-wide">Sesión estratégica gratuita este mes</span>
              <Link
                href="/#contacto"
                className="rounded-full bg-primary/80 px-3 py-1 text-primary-foreground transition hover:bg-primary"
              >
                Reserva ahora
              </Link>
            </div>
          </div>
          <SiteHeader />
          <main className="flex-1 px-4 py-agency-lg md:px-6 lg:px-8">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
