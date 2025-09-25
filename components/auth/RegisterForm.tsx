'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export function RegisterForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/servicios';
  const welcome = search.get('welcome') === '1';
  const [email, setEmail] = useState(() => search.get('email') || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const queryEmail = search.get('email');
    if (queryEmail) {
      setEmail(queryEmail);
    }
  }, [search]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Completa todos los campos.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Error al registrarse' }));
        setError(data.error || 'Error al registrarse');
        return;
      }
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: next,
      });
      if (signInResult?.ok) {
        router.push(next);
      } else {
        router.push('/login');
      }
    } catch (err) {
      setError('No se pudo completar el registro. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-lg border border-border bg-background p-8 shadow-sm"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Crea tu cuenta</h1>
          <p className="text-sm text-muted-foreground">
            {welcome ? '¡Bienvenido! Completa tus datos para comenzar.' : 'Regístrate para explorar nuestros cursos y servicios.'}
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creando cuenta…' : 'Registrarme'}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
