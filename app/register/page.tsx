'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

function RegisterPageContent() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/checkout';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const doRegister = async () => {
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (signInRes?.ok) {
        router.push(next);
      } else {
        router.push('/auth/login');
      }
    } else {
      const data = await res.json();
      setError(data.error || 'Error al registrarse');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-6">
        <h1 className="mb-4 text-2xl font-bold">Crear cuenta</h1>
        <div className="space-y-3">
          <input
            className="w-full border p-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        <input
          className="w-full border p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="border px-4 py-2" onClick={doRegister}>
          Registrarse
        </button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}
