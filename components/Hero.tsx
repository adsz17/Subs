'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import { HighlightBadge } from '@/components/LogoCloud';
import { Button } from '@/components/ui/button';

export function Hero() {
  const highlights = [
    { id: 'clients', label: '+120 clientes felices' },
    { id: 'uptime', label: '99.9% uptime garantizado' },
    { id: 'integrations', label: 'Integraciones globales' },
  ];

  return (
    <section className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-purple-50 px-6 py-24 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-300/40 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[-6rem] h-80 w-80 rounded-full bg-purple-300/30 blur-3xl" />
        <div className="absolute right-[-10rem] top-12 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-4xl text-balance"
      >
        <h1 className="mb-6 font-serif text-5xl leading-tight text-zinc-900 md:text-7xl">
          Servicios <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-sky-500 bg-clip-text text-transparent">SaaS</span>{' '}
          que impulsan tu <span className="underline decoration-indigo-300 decoration-4 underline-offset-8">crecimiento</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-700 md:text-2xl">
          Lanza y vende tus servicios digitales con experiencias de pago flexibles, automatización completa y soporte experto.
        </p>
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          {highlights.map((item) => (
            <HighlightBadge key={item.id}>{item.label}</HighlightBadge>
          ))}
        </div>
        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:justify-center">
          <Button asChild className="w-full sm:w-auto">
            <a href="#servicios">Ver servicios</a>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <a href="#contacto">Contactar</a>
          </Button>
        </div>
      </motion.div>
      <motion.a
        href="#servicios"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="absolute bottom-12 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-white/70 text-indigo-600 shadow-lg backdrop-blur hover:border-indigo-200 hover:text-indigo-500"
        aria-label="Desplazarse a servicios"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.span>
      </motion.a>
    </section>
  );
}
