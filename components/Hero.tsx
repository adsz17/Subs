'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-4"
      >
        <h1 className="mb-4 font-serif text-5xl md:text-7xl">Servicios SaaS</h1>
        <p className="mb-8 text-lg text-zinc-600 md:text-2xl">
          Lanza y vende tus servicios digitales con pagos cripto o tarjeta.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <a href="#servicios">Ver servicios</a>
          </Button>
          <Button asChild variant="outline">
            <a href="#contacto">Contactar</a>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
