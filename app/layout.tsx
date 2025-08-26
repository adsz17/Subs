import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Servicios SaaS',
  description: 'Landing + Admin para servicios con precios'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
