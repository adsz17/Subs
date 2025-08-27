import './globals.css';
import type { ReactNode } from 'react';
import { Playfair_Display, Open_Sans } from 'next/font/google';
import type { Metadata } from 'next';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display'
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'Servicios SaaS',
  description: 'Lanza y vende tus servicios digitales con pagos cripto o tarjeta.',
  openGraph: {
    title: 'Servicios SaaS',
    description: 'Lanza y vende tus servicios digitales con pagos cripto o tarjeta.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'Servicios SaaS',
    images: ['/opengraph-image.png'],
    locale: 'es_ES',
    type: 'website'
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${openSans.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-zinc-950 text-zinc-50 antialiased">
        {children}
      </body>
    </html>
  );
}
