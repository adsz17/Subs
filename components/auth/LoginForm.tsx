'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

function buildRegisterUrl(email: string, next: string) {
  const params = new URLSearchParams();
  if (email) params.set('email', email);
  params.set('welcome', '1');
  params.set('next', next);
  return `/register?${params.toString()}`;
}

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const nextParam = search.get('next') ?? search.get('redirect');
  const next = nextParam && nextParam.startsWith('/') ? nextParam : '/servicios';
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
      setError('Ingresa tu email y contraseña.');
      return;
    }
    setIsSubmitting(true);
    try {
      const checkRes = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        cache: 'no-store',
      });
      if (checkRes.ok) {
        const data = (await checkRes.json()) as { exists: boolean };
        if (!data.exists) {
          setIsSubmitting(false);
          router.push(buildRegisterUrl(email, next));
          return;
        }
      }
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: next,
      });
      if (result?.ok) {
        router.push(next);
      } else if (result?.error === 'USER_NOT_FOUND') {
        router.push(buildRegisterUrl(email, next));
      } else {
        setError('Credenciales inválidas. Intenta de nuevo.');
      }
    } catch (err) {
      setError('No se pudo iniciar sesión. Intenta nuevamente.');
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
          <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
          <p className="text-sm text-muted-foreground">Accede con tus credenciales para continuar.</p>
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="••••••••"
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
          {isSubmitting ? 'Ingresando…' : 'Entrar'}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{' '}
          <Link href={buildRegisterUrl(email, next)} className="font-medium text-primary hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </form>
    </div>
  );
}
