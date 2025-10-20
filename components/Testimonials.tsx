import { TestimonialsCarousel } from '@/components/TestimonialsCarousel';
import { getTestimonials } from '@/lib/testimonials';

export async function Testimonials() {
  const testimonials = await getTestimonials();

  if (!testimonials.length) {
    return null;
  }

  return (
    <section
      id="testimonios"
      className="mx-auto max-w-7xl px-4 pt-[var(--section-pt)] pb-[var(--section-pb)]"
    >
      <TestimonialsCarousel testimonials={testimonials} />
    </section>
  );
}
