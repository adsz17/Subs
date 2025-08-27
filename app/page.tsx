import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-6 text-5xl font-bold">Servicios SaaS</h1>
      <p className="mb-8 max-w-xl">Landing simple. Mirá nuestros servicios y precios.</p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link className="btn" href="/servicios">
          Ver servicios
        </Link>
        <Link className="btn" href="/admin">
          Entrar al Admin
        </Link>
      </div>
    </main>
  );
}
