'use client';

import { ContactForm } from '@/components/ContactForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Clock, MapPin } from 'lucide-react';

export function Contact() {
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '+54 9 11 5555-5555';
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'hola@subs.studio';
  const weekdayHours =
    process.env.NEXT_PUBLIC_CONTACT_HOURS_WEEK ?? 'Lunes a Viernes · 9:00 - 18:00';
  const weekendHours =
    process.env.NEXT_PUBLIC_CONTACT_HOURS_WEEKEND ?? 'Sábados · 10:00 - 14:00';
  const address = process.env.NEXT_PUBLIC_CONTACT_ADDRESS ?? 'Av. Siempre Viva 742, Buenos Aires';
  const mapEmbedUrl = process.env.NEXT_PUBLIC_CONTACT_MAP_URL;

  return (
    <section
      id="contacto"
      className="mx-auto max-w-5xl px-4 pt-[var(--section-pt)] pb-[var(--section-pb)]"
    >
      <h2 className="mb-8 text-center text-3xl font-serif">Contacto</h2>
      <Card className="bg-white/80 backdrop-blur dark:bg-slate-900/60">
        <CardHeader>
          <CardTitle className="text-2xl">Coordinemos una llamada</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Completá el formulario o elegí alguno de nuestros canales directos. Te responderemos dentro de las próximas 24 horas hábiles.
          </p>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <ContactForm />
          <aside className="space-y-6">
            <div className="rounded-md border border-slate-200/70 bg-white/60 p-4 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900/40">
              <div className="mb-3 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                <Phone className="h-4 w-4" aria-hidden="true" />
                Datos de contacto
              </div>
              <dl className="space-y-3 text-slate-700 dark:text-slate-300">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Teléfono</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100">
                    <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:underline">
                      {phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100">
                    <a href={`mailto:${email}`} className="hover:underline">
                      {email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    Horario de atención
                  </dt>
                  <dd className="space-y-1">
                    <p>{weekdayHours}</p>
                    <p>{weekendHours}</p>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="rounded-md border border-slate-200/70 bg-white/60 p-4 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900/40">
              <div className="mb-3 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Encontranos en nuestra oficina
              </div>
              <p className="mb-3 text-slate-700 dark:text-slate-300">{address}</p>
              {mapEmbedUrl ? (
                <div className="overflow-hidden rounded-md border border-slate-200/70 shadow-sm dark:border-slate-700">
                  <iframe
                    title="Mapa de ubicación"
                    src={mapEmbedUrl}
                    className="h-40 w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Agregá un mapa compartiendo `NEXT_PUBLIC_CONTACT_MAP_URL`.
                </div>
              )}
            </div>
          </aside>
        </CardContent>
      </Card>
    </section>
  );
}
