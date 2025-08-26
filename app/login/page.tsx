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
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login (demo)</h1>
      <div className="space-y-3">
        <input className="border p-2 w-full" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <select className="border p-2 w-full" value={role} onChange={e=>setRole(e.target.value)}>
          <option>ADMIN</option>
          <option>STAFF</option>
          <option>CUSTOMER</option>
        </select>
        <button className="border px-4 py-2" onClick={doLogin}>Entrar</button>
      </div>
      <p className="text-sm mt-4 text-gray-500">Este login es de demo para proteger /admin. Integra NextAuth más adelante.</p>
    </div>
  );
}
