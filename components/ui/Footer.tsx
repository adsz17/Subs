import Link from 'next/link';
import {
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const navigationLinks = [
  { href: '/#features', label: 'Características' },
  { href: '/#pricing', label: 'Planes' },
  { href: '/#testimonials', label: 'Historias de clientes' },
  { href: '/#faq', label: 'Preguntas frecuentes' },
];

const resourceLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/guides', label: 'Guías' },
  { href: '/docs', label: 'Documentación' },
  { href: '/support', label: 'Centro de soporte' },
];

const socialLinks = [
  { href: 'https://twitter.com', label: 'Twitter', icon: Twitter },
  { href: 'https://www.linkedin.com', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://instagram.com', label: 'Instagram', icon: Instagram },
];

export function Footer() {
  return (
    <footer className="relative isolate mt-24 overflow-hidden bg-gradient-to-br from-[#050b1c] via-[#070d25] to-[#040616] text-ink">
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(113,87,255,0.18),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(113,87,255,0.32),_transparent_60%)]" aria-hidden />
      <div className="container relative z-10 py-16 sm:py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))]">
          <div className="space-y-6">
            <div className="space-y-3">
              <Link href="/" className="text-2xl font-semibold text-ink">
                Subs
              </Link>
              <p className="max-w-xs text-sm text-muted-ink">
                Plataforma todo-en-uno para monetizar tus contenidos y construir una comunidad fiel con experiencias premium.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-ink transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-5 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/70">
              Navegación
            </p>
            <ul className="space-y-3 text-muted-ink">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/70">
              Recursos
            </p>
            <ul className="space-y-3 text-muted-ink">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6 text-sm">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/70">
                Mantente al día
              </p>
              <p className="text-muted-ink">
                Suscríbete a nuestro boletín para recibir novedades de lanzamientos y estrategias exclusivas para creadores.
              </p>
              <form className="flex w-full flex-col gap-3 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Correo electrónico
                </label>
                <Input
                  id="newsletter-email"
                  type="email"
                  placeholder="nombre@correo.com"
                  className="h-11 flex-1 border-white/20 bg-white/10 text-ink placeholder:text-ink/60 focus:border-blue-400 focus:ring-blue-400"
                  required
                />
                <Button className="h-11 shrink-0 px-6">Suscribirme</Button>
              </form>
            </div>
            <div className="space-y-3 text-muted-ink">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/70">
                Contáctanos
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-ink/70" />
                  <Link href="mailto:hola@subs.com" className="transition hover:text-ink">
                    hola@subs.com
                  </Link>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-ink/70" />
                  <span>+34 600 000 000</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-ink/70" />
                  <span>Barcelona, España</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-muted-ink sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Subs. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/terms" className="transition hover:text-ink">
              Términos
            </Link>
            <Link href="/privacy" className="transition hover:text-ink">
              Privacidad
            </Link>
            <Link href="/cookies" className="transition hover:text-ink">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
