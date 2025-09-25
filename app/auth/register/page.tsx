import { Suspense } from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function AuthRegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[70vh] items-center justify-center">Cargando…</div>}>
      <RegisterForm />
    </Suspense>
  );
}
