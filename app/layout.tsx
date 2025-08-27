import './globals.css';
import type { ReactNode } from 'react';
import { Playfair_Display, Open_Sans } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display'
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata = {
  title: 'Servicios SaaS',
  description: 'Landing + Admin para servicios con precios'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${openSans.variable} ${playfair.variable}`}>
      <body className="min-h-screen antialiased bg-gradient-to-br from-[#faaca8] to-[#dad0ec] text-gray-800">
        {children}
      </body>
    </html>
  );
}
