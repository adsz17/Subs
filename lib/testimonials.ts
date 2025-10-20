import { cache } from 'react';

export type Testimonial = {
  id: string;
  name: string;
  role?: string;
  message: string;
  avatarUrl?: string;
  rating: number;
};

type RemoteTestimonial = {
  id?: number | string;
  name?: string;
  designation?: string;
  message?: string;
  avatar?: string;
  rating?: number;
};

const REMOTE_TESTIMONIALS_URL = 'https://testimonialapi.toolcarton.com/api';

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'fallback-ana',
    name: 'Ana Martínez',
    role: 'Directora de Marketing',
    message: 'Excelente servicio y atención. El equipo nos acompañó en cada paso del proceso.',
    rating: 5,
  },
  {
    id: 'fallback-luis',
    name: 'Luis Hernández',
    role: 'Fundador de Startify',
    message:
      'Nuestra conversión aumentó al 200%. La consultoría y ejecución fueron impecables.',
    rating: 5,
  },
  {
    id: 'fallback-maria',
    name: 'María González',
    role: 'COO en FintechGo',
    message: 'Implementación rápida y soporte increíble. Un partner estratégico de confianza.',
    rating: 4,
  },
];

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  try {
    const response = await fetch(REMOTE_TESTIMONIALS_URL, {
      cache: 'force-cache',
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) {
      throw new Error(`Remote testimonials returned ${response.status}`);
    }

    const rawData = (await response.json()) as RemoteTestimonial[];

    const testimonials = rawData
      .filter((item) => Boolean(item.message && item.name))
      .map<Testimonial>((item, index) => {
        const parsedRating = Number(item.rating ?? 5);
        const rating = Number.isFinite(parsedRating) ? parsedRating : 5;

        return {
          id: String(item.id ?? `remote-${index}`),
          name: item.name?.trim() ?? 'Cliente',
          role: item.designation?.trim(),
          message: item.message?.trim() ?? '',
          avatarUrl: item.avatar?.trim(),
          rating: Math.min(Math.max(rating, 1), 5),
        };
      });

    if (testimonials.length > 0) {
      return testimonials;
    }
  } catch (error) {
    console.error('Error fetching remote testimonials', error);
  }

  return FALLBACK_TESTIMONIALS;
});
