'use client';

import { ContactForm } from '@/components/ContactForm';

export function Contact() {
  return (
    <section
      id="contacto"
      className="mx-auto max-w-md px-4 pt-[var(--section-pt)] pb-[var(--section-pb)]"
    >
      <h2 className="mb-8 text-center text-3xl font-serif">Contacto</h2>
      <ContactForm />
    </section>
  );
}
