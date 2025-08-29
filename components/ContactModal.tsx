'use client';

import { useState } from 'react';
import { ContactForm } from '@/components/ContactForm';
import { Button } from '@/components/ui/button';

interface Props {
  triggerText?: string;
}

export function ContactModal({ triggerText = 'Consultar' }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" className="w-full" onClick={() => setOpen(true)}>
        {triggerText}
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Enviar mensaje</h2>
              <button onClick={() => setOpen(false)} className="text-gray-500">
                ×
              </button>
            </div>
            <ContactForm onSubmitted={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

