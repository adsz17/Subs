import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-4">Servicios SaaS</h1>
      <p className="mb-4">Landing simple. Mirá nuestros servicios y precios.</p>
      <div className="flex gap-3">
        <Link className="btn" href="/servicios">Ver servicios</Link>
        <Link className="btn" href="/admin">Entrar al Admin</Link>
      </div>
    </div>
  );
}
