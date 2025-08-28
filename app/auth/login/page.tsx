'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('ADMIN');

  const doLogin = async () => {
    document.cookie = `role=${role}; path=/`;
    window.location.href = '/admin';
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">Login (demo)</h1>
      <div className="space-y-3">
        <input
          className="w-full border p-2"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          className="w-full border p-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option>ADMIN</option>
          <option>STAFF</option>
          <option>CUSTOMER</option>
        </select>
        <button className="border px-4 py-2" onClick={doLogin}>
          Entrar
        </button>
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Este login es de demo para proteger /admin. Integra NextAuth más adelante.
      </p>
    </div>
  );
}
