import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const baseMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Servicios SaaS',
    template: '%s | Servicios SaaS'
  },
  description: 'Lanza y vende tus servicios digitales con pagos cripto o tarjeta.',
  openGraph: {
    type: 'website',
    url: baseUrl,
    title: 'Servicios SaaS',
    description: 'Lanza y vende tus servicios digitales con pagos cripto o tarjeta.',
    siteName: 'Servicios SaaS'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Servicios SaaS',
    description: 'Lanza y vende tus servicios digitales con pagos cripto o tarjeta.'
  }
};
