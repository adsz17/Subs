'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden text-center text-white">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-zinc-950 to-zinc-900" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.1),transparent)]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-4"
      >
        <h1 className="mb-4 text-5xl font-bold md:text-7xl">Servicios SaaS</h1>
        <p className="mb-8 text-lg md:text-2xl">Lanza y vende tus servicios digitales con pagos cripto o tarjeta.</p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <a href="#servicios">Ver servicios</a>
          </Button>
          <Button asChild className="bg-gray-200 text-gray-900 hover:bg-gray-300">
            <a href="#contacto">Contactar</a>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
