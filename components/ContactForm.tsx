'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export type ContactValues = z.infer<typeof contactSchema>;

interface Props {
  onSubmitted?: () => void;
}

type SubmissionStatus =
  | { state: 'idle' }
  | { state: 'success'; ticketId: string }
  | { state: 'error'; message: string };

export function ContactForm({ onSubmitted }: Props) {
  const [status, setStatus] = useState<SubmissionStatus>({ state: 'idle' });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactValues) => {
    setStatus(prev => (prev.state === 'success' ? prev : { state: 'idle' }));
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message =
          typeof payload?.error === 'string'
            ? payload.error
            : 'No pudimos enviar tu mensaje. Inténtalo nuevamente más tarde.';
        setStatus({ state: 'error', message });
        return;
      }

      const ticketId = typeof payload?.ticketId === 'string' ? payload.ticketId : undefined;
      if (!ticketId) {
        setStatus({
          state: 'error',
          message: 'Recibimos tu mensaje, pero no pudimos generar un identificador. Contactanos nuevamente.',
        });
        return;
      }

      setStatus({ state: 'success', ticketId });
      reset();
      onSubmitted?.();
    } catch (error) {
      console.error('Failed to submit contact form', error);
      setStatus({
        state: 'error',
        message: 'Ocurrió un problema inesperado al enviar tu mensaje. Inténtalo nuevamente.',
      });
    }
  };

  return (
    <div>
      {status.state === 'success' && (
        <Alert variant="success" className="mb-4" role="status">
          <AlertTitle>¡Mensaje enviado con éxito!</AlertTitle>
          <AlertDescription>
            Gracias por escribirnos. Tu ticket de seguimiento es <span className="font-semibold">#{status.ticketId}</span>.
          </AlertDescription>
        </Alert>
      )}
      {status.state === 'error' && (
        <Alert variant="destructive" className="mb-4" role="alert">
          <AlertTitle>No pudimos procesar tu mensaje</AlertTitle>
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input placeholder="Nombre" {...register('name')} aria-invalid={!!errors.name} />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <Input type="email" placeholder="Email" {...register('email')} aria-invalid={!!errors.email} />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <Textarea placeholder="Mensaje" rows={4} {...register('message')} aria-invalid={!!errors.message} />
          {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {isSubmitting ? 'Enviando…' : 'Enviar'}
        </Button>
      </form>
    </div>
  );
}

