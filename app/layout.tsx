import './globals.css';
import type { ReactNode } from 'react';
import { Playfair_Display, Inter } from 'next/font/google';
import { baseMetadata } from '@/lib/seo';

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
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-white text-zinc-900 antialiased dark:bg-gray-950 dark:text-zinc-50">
        {children}
      </body>
    </html>
  );
}
